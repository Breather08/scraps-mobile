import { supabase } from "../../services/supabase";
import type { Partner } from "./types";
import { fromPartnerDto } from "./transformers/from-partner-dto";
import { BusinessProfileRow } from "./transformers/dto/types";
import { useAuth } from "@/providers/auth-provider";

// TODO: Replace all raw sql with supabase rpc

export const fetchActivePartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_active", true);

  if (error || !Array.isArray(data)) return [];

  return data.map((profile: BusinessProfileRow) => fromPartnerDto(profile));
};

export const fetchAllPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*");

  if (error || !Array.isArray(data)) return [];

  return data.map((profile: BusinessProfileRow) => fromPartnerDto(profile));
};

export const fetchFavoritePartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("is_active", true);

  if (error || !Array.isArray(data)) return [];

  return data.map((profile: BusinessProfileRow) => fromPartnerDto(profile));
};

export const fetchPartnersByCategory = async (
  categoryId: string,
): Promise<Partner[]> => {
  // TODO: Implement filtering by category
  return fetchAllPartners();
};

export const fetchFeaturedPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_active", true)
    .order("average_rating", { ascending: false })
    .limit(5);

  if (error || !Array.isArray(data)) return [];

  return data.map((profile) => fromPartnerDto(profile));
};

export const searchPartners = async (query: string): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_active", true)
    .ilike("business_name", `%${query}%`);

  if (error || !Array.isArray(data)) return [];

  return data.map((profile) => fromPartnerDto(profile));
};

export const fetchPartnerById = async (
  partnerId: string,
): Promise<Partner | null> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", partnerId)
    .single();

  if (error || !data) return null;

  return fromPartnerDto(data);
};

export const getFavoritePartners = async () => {
  const { user } = useAuth();
  const { data, error } = await supabase.rpc("get_favorite_partners", {
    p_customer_id: user?.id,
  });

  if (error || !Array.isArray(data)) return [];

  return data.map((profile) => fromPartnerDto(profile));
};

export const getNearbyFavoritePartners = async (
  latitude: number,
  longitude: number,
) => {
  const { user } = useAuth();
  const { data, error } = await supabase.rpc("get_nearby_favorite_partners", {
    p_customer_id: user?.id,
    p_lat: latitude,
    p_lng: longitude,
    p_radius_km: 5,
  });

  if (error || !Array.isArray(data)) return [];

  return data.map((profile: BusinessProfileRow) => fromPartnerDto(profile));
};
