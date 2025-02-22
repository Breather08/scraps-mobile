import { PARTNERS_MOCK } from "./mocks/partners";
import { fromPartnerDto } from "./transformers/from-partner-dto";
import type { Partner } from "./types";

export const fetchPartners = () =>
  new Promise<Partner[]>((resolve) => {
    setTimeout(() => {
      resolve(PARTNERS_MOCK.map((partner) => fromPartnerDto(partner)));
    }, 200);
  });
