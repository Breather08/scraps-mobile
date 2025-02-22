import type { PartnerDto } from "../transformers/dto/types";

export const PARTNERS_MOCK: PartnerDto[] = [
  {
    id: "0",
    name: "Papa Johns",
    workStartAt: new Date().toISOString(),
    workEndAt: new Date().toISOString(),
    logoUrl:
      "https://cdn.freebiesupply.com/logos/large/2x/papa-johns-pizza-1-logo-svg-vector.svg",
    backgroundUrl: "https://picsum.photos/200/300",
    rating: 4.7,
    distance: 1.2,
    price: 3000,
  },
  {
    id: "1",
    name: "KFC",
    workStartAt: new Date().toISOString(),
    workEndAt: new Date().toISOString(),
    logoUrl: "https://pngimg.com/d/kfc_PNG13.png",
    backgroundUrl: "https://picsum.photos/200/300",
    rating: 4.3,
    distance: 1.2,
    price: 2200,
  },
  {
    id: "2",
    name: "Starbucks",
    workStartAt: new Date().toISOString(),
    workEndAt: new Date().toISOString(),
    logoUrl:
      "https://cdn.freebiesupply.com/images/large/2x/starbucks-logo-black-and-white.png",
    backgroundUrl: "https://picsum.photos/200/300",
    rating: 4.5,
    distance: 1.2,
    price: 2000,
  },
  {
    id: "3",
    name: "Burger King",
    workStartAt: new Date().toISOString(),
    workEndAt: new Date().toISOString(),
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/1012px-Burger_King_logo_%281999%29.svg.png",
    backgroundUrl: "https://picsum.photos/200/300",
    rating: 4.0,
    distance: 1.2,
    price: 1500,
  },
];
