import type { Dayjs } from "dayjs";

export interface Partner {
  id: string;
  name: string;
  workStartAt: Dayjs | null;
  workEndAt: Dayjs | null;
  rating: number;
  price: number;
  logoUrl?: string;
  backgroundUrl?: string;
  isFavorite?: boolean;
  distance?: number;
}
