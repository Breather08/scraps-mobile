import { useCallback, useEffect, useState } from "react";
import { FoodPackage } from "../types";
import { fetchBusinessPackages } from "../api";
import { supabase } from "@/services/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { fromFoodPackageDto } from "../transformers/from-food-package-dto";
import { FoodPackageDto } from "../transformers/dto/types";

export const useBusinessPackages = (
  businessId: string,
  includeUnavailable = false,
) => {
  const [packages, setPackages] = useState<FoodPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [realtimeChannel, setRealtimeChannel] = useState<
    RealtimeChannel | null
  >(null);

  const fetchPackages = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);

      const fetchedPackages = await fetchBusinessPackages(businessId);
      setPackages(fetchedPackages);
    } catch (err) {
      setError("Failed to load food packages. Please try again.");
      console.error("Error fetching packages:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [businessId, includeUnavailable]);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useEffect(() => {
    const channel = supabase
      .channel(`business-packages-${businessId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "food_packages",
        filter: `business_id=eq.${businessId}`,
      }, (payload) => {
        const data = fromFoodPackageDto(payload.new as FoodPackageDto);

        if (payload.eventType === "INSERT") {
          const currentDate = new Date();
          if (
            includeUnavailable || (
              data.available_quantity > 0 &&
              !data.sold_out &&
              data.availability_start &&
              data.availability_end &&
              currentDate >= data.availability_start &&
              currentDate <= data.availability_end
            )
          ) {
            setPackages((prev) => [data, ...prev]);
          }
        } else if (payload.eventType === "UPDATE") {
          setPackages((prev) =>
            prev.map((pkg) =>
              pkg.id === payload.new.id ? (payload.new as FoodPackage) : pkg
            )
          );
        } else if (payload.eventType === "DELETE") {
          setPackages((prev) =>
            prev.filter((pkg) => pkg.id !== payload.old.id)
          );
        }
      })
      .subscribe();

    setRealtimeChannel(channel);

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [businessId, includeUnavailable]);

  const refreshPackages = useCallback(() => {
    setRefreshing(true);
    fetchPackages();
  }, [fetchPackages]);

  const toggleShowUnavailable = useCallback(() => {
    const newIncludeUnavailable = !includeUnavailable;
    fetchBusinessPackages(businessId)
      .then((fetchedPackages) => {
        setPackages(fetchedPackages);
      })
      .catch((err) => {
        console.error("Error toggling unavailable packages:", err);
      });

    return newIncludeUnavailable;
  }, [businessId, includeUnavailable]);

  return {
    packages,
    loading,
    error,
    refreshing,
    refreshPackages,
    toggleShowUnavailable,
  };
};
