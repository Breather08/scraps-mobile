import dayjs from "dayjs";
import type { Partner } from "../types";
import type { PartnerDto } from "./dto/types";

export function fromPartnerDto(dto: PartnerDto): Partner {
  return {
    ...dto,
    workStartAt: new Date(dto.workStartAt),
    workEndAt: new Date(dto.workEndAt),
  };
}
