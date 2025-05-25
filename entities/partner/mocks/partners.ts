import type { Partner } from "../types";

export const PARTNERS_MOCK: Partner[] = [
  {
    id: "0",
    name: "Papa Johns",
    workStartAt: new Date("2025-03-24T09:00:00.000Z"),
    workEndAt: new Date("2025-03-24T23:00:00.000Z"),
    logoUrl:
      "https://cdn.freebiesupply.com/logos/large/2x/papa-johns-pizza-1-logo-svg-vector.svg",
    backgroundUrl:
      "https://api.deepai.org/job-view-file/0fd92556-538b-4858-9177-9191d5a38e79/outputs/output.jpg",
    rating: 4.7,
    distance: 1.2,
    address: "Jeltoksan 173",
    coords: {
      latitude: 51.127021,
      longitude: 71.427302,
    },
  },
  {
    id: "1",
    name: "KFC",
    workStartAt: new Date("2025-03-24T09:00:00.000Z"),
    workEndAt: new Date("2025-03-24T23:00:00.000Z"),
    logoUrl: "https://pngimg.com/d/kfc_PNG13.png",
    backgroundUrl: "https://legacy.reactjs.org/logo-og.png",
    rating: 4.3,
    distance: 1.2,
    address: "Jeltoksan 173",
    coords: {
      latitude: 51.120599,
      longitude: 71.415135,
    },
  },
  {
    id: "2",
    name: "Starbucks",
    workStartAt: new Date("2025-03-24T09:00:00.000Z"),
    workEndAt: new Date("2025-03-24T23:00:00.000Z"),
    logoUrl:
      "https://cdn.freebiesupply.com/images/large/2x/starbucks-logo-black-and-white.png",
    backgroundUrl:
      "https://api.deepai.org/job-view-file/241fdd44-becf-42b8-bc4a-2bfdc20be755/outputs/output.jpg",
    rating: 4.5,
    distance: 1.2,
    address: "Jeltoksan 173",
    coords: {
      latitude: 43.243421,
      longitude: 76.932322,
    },
  },
  {
    id: "3",
    name: "Burger King",
    workStartAt: new Date("2025-03-24T09:00:00.000Z"),
    workEndAt: new Date("2025-03-24T23:00:00.000Z"),
    logoUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/1012px-Burger_King_logo_%281999%29.svg.png",
    backgroundUrl: "https://legacy.reactjs.org/logo-og.png",
    rating: 4.0,
    distance: 1.2,
    address: "Jeltoksan 173",
    coords: {
      latitude: 51.13113,
      longitude: 51.13113,
    },
  },
];
