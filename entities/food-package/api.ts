// src/api/foodPackages.ts
import { supabase } from "@/services/supabase";
import { FoodPackage } from "./types";
import { fromFoodPackageDto } from "./transformers/from-food-package-dto";

export const fetchBusinessPackages = async (
  businessId: string,
): Promise<FoodPackage[]> => {
  try {
    const { data, error } = await supabase
      .rpc("get_business_packages", {
        business_id_param: businessId,
      });

    if (error || !Array.isArray(data)) {
      console.error("Error fetching business packages:", error);
      throw error;
    }

    return data.map(fromFoodPackageDto);
  } catch (error) {
    console.error("Exception fetching business packages:", error);
    throw error;
  }
};
