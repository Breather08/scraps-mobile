import { supabase } from "../../services/supabase";
import type { Database } from "../../database.types";
import type { Partner, BusinessBox, BoxType, PriceRange } from "./types";

type BusinessProfileRow = Database["public"]["Tables"]["business_profiles"]["Row"];
type BusinessBoxRow = Database["public"]["Tables"]["business_boxes"]["Row"];
type BoxTypeRow = Database["public"]["Tables"]["box_types"]["Row"];
type FoodPackageRow = Database["public"]["Tables"]["food_packages"]["Row"];
type OperatingHours = { open: string; close: string; day: number }[];

async function mapBusinessProfileToPartner(row: BusinessProfileRow, packagePrice?: number): Promise<Partner> {
  // Use the direct longitude and latitude columns instead of extracting from location
  const longitude = row.longitude || 0;
  const latitude = row.latitude || 0;
  
  let operatingHours: OperatingHours = [];
  
  try {
    // Parse operating hours if available
    if (row.operating_hours) {
      console.log('Raw operating hours', row.operating_hours); 
      operatingHours = JSON.parse(row.operating_hours as string) as OperatingHours;
    }
  } catch (e) {
    console.warn("Failed to parse operating hours:", e);
  }
  
  // Default to current date with 9 AM and 10 PM if no operating hours found
  const today = new Date();
  const dayOfWeek = today.getDay();
  const defaultOpen = new Date(today.setHours(9, 0, 0, 0));
  const defaultClose = new Date(today.setHours(22, 0, 0, 0));
  
  // Find today's operating hours if available
  const todaysHours = operatingHours.find(h => h.day === dayOfWeek);
  let workStartAt = defaultOpen;
  let workEndAt = defaultClose;
  
  if (todaysHours) {
    const [openHours, openMinutes] = todaysHours.open.split(':').map(Number);
    const [closeHours, closeMinutes] = todaysHours.close.split(':').map(Number);
    
    workStartAt = new Date(today.setHours(openHours, openMinutes, 0, 0));
    workEndAt = new Date(today.setHours(closeHours, closeMinutes, 0, 0));
  }
  
  // Fetch business boxes
  const { data: businessBoxesData, error: businessBoxesError } = await supabase
    .from('business_boxes')
    .select(`
      id, count, price_min, price_max, last_updated,
      box_type:box_type_id(id, name, description)
    `)
    .eq('business_id', row.id);
  
  if (businessBoxesError) {
    console.warn('Failed to fetch business boxes:', businessBoxesError);
  }
  
  // Process box data
  let boxes: BusinessBox[] = [];
  let totalBoxCount = 0;
  
  if (businessBoxesData && businessBoxesData.length > 0) {
    // Map each business box to our BusinessBox type
    for (const boxData of businessBoxesData) {
      // Fetch typical items for this box
      const { data: typicalItems } = await supabase
        .from('box_typical_items')
        .select('item_name')
        .eq('business_box_id', boxData.id);
      
      // Fetch dietary options for this box
      const { data: dietaryOptionsData } = await supabase
        .from('box_dietary_options')
        .select('dietary_options(name)')
        .eq('business_box_id', boxData.id);
      
      // Extract first item from box_type array - Supabase returns foreign key relations as arrays
      const boxTypeData = Array.isArray(boxData.box_type) && boxData.box_type.length > 0
        ? boxData.box_type[0]
        : (boxData.box_type as any) || { id: '', name: '', description: null };
      
      const boxType: BoxType = {
        id: boxTypeData.id || '',
        name: boxTypeData.name || '',
        description: boxTypeData.description
      };
      
      const priceRange: PriceRange = {
        min: boxData.price_min,
        max: boxData.price_max
      };
      
      // Map dietary options data, handling cases where dietary_options might be an array or object
      const dietaryOptions = dietaryOptionsData?.map(option => {
        const dietaryOption = Array.isArray(option.dietary_options) && option.dietary_options.length > 0
          ? option.dietary_options[0]
          : (option.dietary_options as any);
          
        return dietaryOption?.name || '';
      }) || [];
      
      // Add box to the list
      boxes.push({
        id: boxData.id,
        boxType,
        count: boxData.count,
        priceRange,
        typicalItems: typicalItems?.map(item => item.item_name) || [],
        dietaryOptions,
        lastUpdated: boxData.last_updated || undefined
      });
      
      // Sum up the total count
      totalBoxCount += boxData.count;
    }
  }
  
  return {
    id: row.id,
    name: row.business_name,
    rating: row.average_rating ?? 0,
    address: row.address,
    logoUrl: row.logo_url ?? undefined,
    backgroundUrl: undefined, // Background URL might need to be fetched from a different table
    price: packagePrice ?? 0,
    workStartAt,
    workEndAt,
    coords: {
      longitude,
      latitude,
    },
    distance: 0, // Will be calculated client-side based on user location
    boxes,
    totalBoxCount
  };
}

/**
 * Fetch all active partners
 */
export const fetchPartners = async (): Promise<Partner[]> => {
  // First, get all business profiles
  const { data: businessProfiles, error: profilesError } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_active", true);

  if (profilesError) {
    throw profilesError;
  }

  if (!businessProfiles || businessProfiles.length === 0) {
    return [];
  }

  // Then fetch the minimum price from food_packages for each business
  // const businessIds = businessProfiles.map(profile => profile.id);
  // const { data: packagePrices, error: pricesError } = await supabase
  //   .from("food_packages")
  //   .select("business_id, price")
  //   .in("business_id", businessIds)
  //   .order("price", { ascending: true });

  // if (pricesError) {
  //   // Log the error but continue with the available data
  //   console.error("Error fetching package prices:", pricesError);
  // }

  // Create a map of business_id to lowest price
  const priceMap = new Map<string, number>();
  // packagePrices?.forEach(pkg => {
  //   // Only set the price if it's not already set or if it's lower than the current price
  //   if (!priceMap.has(pkg.business_id) || pkg.price < priceMap.get(pkg.business_id)!) {
  //     priceMap.set(pkg.business_id, pkg.price);
  //   }
  // });

  // Map the business profiles to partner objects with prices and add distance calculation
  const partners = await Promise.all(
    businessProfiles.map(async (profile) => {
      // Get the price for this business, or undefined if not found
      const price = priceMap.get(profile.id);
      return await mapBusinessProfileToPartner(profile, price);
    })
  );

  return partners;
};

/**
 * Fetch partners by category
 */
export const fetchPartnersByCategory = async (
  categoryId: string
): Promise<Partner[]> => {
  // TODO: Implement filtering by category
  // For now, just return all partners
  return fetchPartners();
};

/**
 * Fetch featured partners (top-rated partners)
 */
export const fetchFeaturedPartners = async (): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_active", true)
    .order("average_rating", { ascending: false })
    .limit(5);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map business profiles to partner objects
  const partners = await Promise.all(
    data.map(async (profile) => await mapBusinessProfileToPartner(profile))
  );

  return partners;
};

/**
 * Search partners by name
 */
export const searchPartners = async (query: string): Promise<Partner[]> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_active", true)
    .ilike("business_name", `%${query}%`);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map business profiles to partner objects
  const partners = await Promise.all(
    data.map(async (profile) => await mapBusinessProfileToPartner(profile))
  );

  return partners;
};

/**
 * Fetch a partner by ID
 */
export const fetchPartnerById = async (partnerId: string): Promise<Partner> => {
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", partnerId)
    .single();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Partner with ID ${partnerId} not found`);
  }

  // Get the minimum price from food_packages
  const { data: packageData, error: priceError } = await supabase
    .from("food_packages")
    .select("price")
    .eq("business_id", partnerId)
    .order("price", { ascending: true })
    .limit(1);  

  const price = packageData && packageData.length > 0 ? packageData[0].price : 0;
  
  return await mapBusinessProfileToPartner(data, price);
};
