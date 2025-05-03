import type { Dayjs } from "dayjs";

export interface PriceRange {
  min: number;
  max: number;
}

export interface BoxType {
  name: string;
  count: number;
  type_id: string;
  description: string;
  price_range: PriceRange;
  typical_items: string[];
  dietary_options: string[];
}

export interface BoxesInfo {
  box_types: BoxType[];
  last_updated: string;
  total_available: number;
}

export interface Partner {
  id: string;
  name: string;
  workStartAt: Date;
  workEndAt: Date;
  rating: number;
  price: number;
  logoUrl?: string;
  backgroundUrl?: string;
  isFavorite?: boolean;
  address: string;
  coords: {
    longitude: number;
    latitude: number;
  };
  distance?: number;
  boxesInfo: BoxesInfo;
}
