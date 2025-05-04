import type { Dayjs } from "dayjs";

export interface PriceRange {
  min: number;
  max: number;
}

export interface BoxType {
  id: string;
  name: string;
  description: string | null;
}

export interface BusinessBox {
  id: string;
  boxType: BoxType;
  count: number;
  priceRange: PriceRange;
  typicalItems: string[];
  dietaryOptions: string[];
  lastUpdated?: string;
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
  boxes: BusinessBox[];
  totalBoxCount: number;
}
