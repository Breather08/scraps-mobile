import type { Database } from "@/database.types";

export type BusinessProfileRow = Database["public"]["Tables"]["business_profiles"]["Row"];
export type OperatingHoursRow = { open?: string, close?: string }
export type OperatingHours = { open: string; close: string; day: number };
