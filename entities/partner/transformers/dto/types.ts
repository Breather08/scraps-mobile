import type { Database } from "@/database.types";

export type BusinessProfileRow = Database["public"]["Tables"]["business_profiles"]["Row"];
export type OperatingHoursRow = { open?: string, close?: string }
export type OperatingHours = { open: string; close: string; day: number };

export interface PartnerDto {
  id: string;
  name: string;
  workStartAt: string;
  workEndAt: string;
  rating: number;
  logoUrl?: string;
  backgroundUrl?: string;
  isFavorite?: boolean;
  address: string;
  coords: {
    longitude: number;
    latitude: number;
  };
  distance?: number;
  price: number;
  description: {
    title: string;
    text: string;
  };
}
