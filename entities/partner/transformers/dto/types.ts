export interface PartnerDto {
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
