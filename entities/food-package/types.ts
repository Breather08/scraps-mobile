import { FOOD_PACKAGE_STATUSES } from "./constants"

export type FoodPackageStatus = typeof FOOD_PACKAGE_STATUSES[number]

export interface FoodPackage {
    id: string;
    business_id: string;
    name: string;
    description: string | null;
    original_price: number;
    discounted_price: number;
    quantity: number;
    available_quantity: number;
    max_quantity: number;
    image_url: string | null;
    food_type: string | null;
    pickup_start_time: Date | null;
    pickup_end_time: Date | null;
    status: FoodPackageStatus | null
    availability_start: Date | null;
    availability_end: Date | null;
    sold_out: boolean;
    created_at: Date | null;
    updated_at: Date | null;
}