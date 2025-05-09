import type { Dayjs } from "dayjs";
import { Database } from "../../database.types";

export interface PriceRange {
  min: number;
  max: number;
}

export interface BoxType {
  id: string;
  name: string;
  description: string | null;
}

export interface FoodPackage {
  id: string;
  name: string;
  description: string | null;
  discounted_price: number;
  original_price: number;
  quantity: number;
  food_type: string | null;
  image_urls: string[] | null;
  pickup_start_time: string;
  pickup_end_time: string;
  status: Database["public"]["Enums"]["package_status"] | null;
  created_at?: string;
  updated_at?: string;
}

// Keep BusinessBox for backward compatibility
export interface BusinessBox {
  id: string;
  boxType: BoxType;
  count: number;
  priceRange: PriceRange;
  lastUpdated?: string;
}

export interface Partner {
  id: string;
  name: string;
  workStartAt: Date;
  workEndAt: Date;
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
}
