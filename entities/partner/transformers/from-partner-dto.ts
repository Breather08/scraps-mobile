import type { Partner } from "../types";
import type { BusinessProfileRow, OperatingHours, OperatingHoursRow } from './dto/types'

export function fromOperatingHours(hours?: OperatingHoursRow[]): OperatingHours[] {
  if (!Array.isArray(hours)) return []

  const result = hours.reduce((acc: OperatingHours[], schedule: any, i: number) => {
    if (!schedule?.open || !schedule?.close) return acc;

    acc.push({
      open: schedule.open as string,
      close: schedule.close as string,
      day: i,
    });

    return acc;
  }, [] as OperatingHours[]);

  return result;
}

export function fromPartnerDto(row: BusinessProfileRow): Partner {
  const longitude = row.longitude || 0;
  const latitude = row.latitude || 0;
  
  let operatingHours: OperatingHours[] = [];
  
  try {
    if (row.operating_hours) {
      operatingHours = fromOperatingHours(row.operating_hours as OperatingHoursRow[]);
    }
  } catch (e) {
    console.warn("Failed to parse operating hours:", e);
  }
  
  const today = new Date();
  const dayOfWeek = today.getDay();
  const defaultOpen = new Date(today.setHours(9, 0, 0, 0));
  const defaultClose = new Date(today.setHours(22, 0, 0, 0));
  
  const todaysHours = operatingHours.find(h => h.day === dayOfWeek);
  let workStartAt = defaultOpen;
  let workEndAt = defaultClose;
  
  if (todaysHours) {
    const [openHours, openMinutes] = todaysHours.open.split(':').map(Number);
    const [closeHours, closeMinutes] = todaysHours.close.split(':').map(Number);
    
    workStartAt = new Date(today.setHours(openHours, openMinutes, 0, 0));
    workEndAt = new Date(today.setHours(closeHours, closeMinutes, 0, 0));
  }
  
  return {
    id: row.id,
    name: row.business_name,
    rating: row.average_rating ?? 0,
    address: row.address,
    logoUrl: row.logo_url ?? undefined,
    backgroundUrl: row.background_url ?? undefined,
    workStartAt,
    workEndAt,
    coords: {
      longitude,
      latitude,
    },
    distance: 0,
  };
}
