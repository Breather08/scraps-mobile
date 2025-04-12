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
