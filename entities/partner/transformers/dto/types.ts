export interface PartnerDto {
  id: string;
  name: string;
  workStartAt: string;
  workEndAt: string;
  rating: number;
  logoUrl?: string;
  backgroundUrl?: string;
  isFavorite?: boolean;
  distance?: number;
  price: number;
}
