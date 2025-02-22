import dayjs from "dayjs";
import type { Partner } from "../types";
import type { PartnerDto } from "./dto/types";

export function fromPartnerDto(dto: PartnerDto): Partner {
  const workStartAt = dayjs(dto.workStartAt);
  const workEndAt = dayjs(dto.workEndAt);

  return {
    id: dto.id,
    name: dto.name,
    workStartAt: workStartAt.isValid() ? workStartAt : null,
    workEndAt: workEndAt.isValid() ? workEndAt : null,
    rating: dto.rating,
    logoUrl: dto.logoUrl,
    backgroundUrl: dto.backgroundUrl,
    isFavorite: dto.isFavorite,
    distance: dto.distance,
    price: dto.price,
  };
}
