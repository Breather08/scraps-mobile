import type { Dayjs } from "dayjs";

export interface Partner {
  id: string;
  name: string;
  workStartAt: {
    hours: number;
    minutes: number;
  };
  workEndAt: {
    hours: number;
    minutes: number;
  };
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
}
