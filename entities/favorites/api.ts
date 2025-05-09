import { useAuth } from "@/providers/auth-provider";
import { supabase } from "@/services/supabase";

export const setFavoritePartner = async (businessId: string) => {
  const { user } = useAuth();
    const { error } = await supabase.rpc('toggle_favorite', {
      p_customer_id: user?.id,
      p_business_id: businessId
    });
    
    if (error) {
      console.error('Error toggling favorite:', error);
      return;
    }
}
