import { FoodPackage } from "../types";
import type { FoodPackageDto } from "./dto/types"

export const fromFoodPackageDto = (dto: FoodPackageDto): FoodPackage => {
    return {
        id: dto.id,
        business_id: dto.business_id,
        name: dto.name,
        description: dto.description,
        original_price: dto.original_price,
        discounted_price: dto.discounted_price,
        quantity: dto.quantity,
        available_quantity: dto.available_quantity,
        max_quantity: dto.max_quantity,
        image_url: dto.image_url,
        food_type: dto.food_type,
        pickup_start_time: dto.pickup_start_time ? new Date(dto.pickup_start_time) : null,
        pickup_end_time: dto.pickup_end_time ? new Date(dto.pickup_end_time) : null,
        status: dto.status,
        availability_start: dto.availability_start ? new Date(dto.availability_start) : null,
        availability_end: dto.availability_end ? new Date(dto.availability_end) : null,
        sold_out: dto.sold_out || false,
        created_at: dto.created_at ? new Date(dto.created_at) : null,
        updated_at: dto.updated_at ? new Date(dto.updated_at) : null
    }
}