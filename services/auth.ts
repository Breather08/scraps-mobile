// src/services/AuthService.ts
import { supabase } from './supabase';
import { User, AuthResponse, AuthError } from '@supabase/supabase-js';

class AuthService {
  // Phone authentication
  async signInWithPhone(phoneNumber: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });
      
      if (error) throw new Error(error.message);
      
      return { success: true };
    } catch (e) {
      throw new Error(`Error sending OTP: ${(e as Error).message}`);
    }
  }
  
  // Verify OTP code
  async verifyOTP(phoneNumber: string, otp: string): Promise<AuthResponse['data']> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
        type: 'sms',
      });
      
      if (error) throw new Error(error.message);
      
      // If successful verification, handle the session
      if (data?.user) {
        await this.handleUserSession(data.user);
      }
      
      return data;
    } catch (e) {
      throw new Error(`Error verifying OTP: ${(e as Error).message}`);
    }
  }
  
  // Check if user exists and create profile if needed
  async handleUserSession(user: User): Promise<{ success: boolean }> {
    try {
      // Check if user already has a profile
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select()
        .eq('id', user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        throw new Error(profileError.message);
      }
      
      if (!userProfile) {
        // Create new user record
        const { error: insertError } = await supabase.from('users').insert({
          id: user.id,
          phone: user.phone,
          role: 'customer' // Default role
        });
        
        if (insertError) throw new Error(insertError.message);
        
        // Create customer profile
        const { error: profileInsertError } = await supabase.from('customer_profiles').insert({
          id: user.id
        });
        
        if (profileInsertError) throw new Error(profileInsertError.message);
      }
      
      return { success: true };
    } catch (e) {
      throw new Error(`Error handling user session: ${(e as Error).message}`);
    }
  }
  
  // Get current session
  async getCurrentSession(): Promise<{ session: any }> {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) throw new Error(error.message);
    
    return data;
  }
  
  // Get current user
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw new Error(error.message);
    
    return data?.user || null;
  }
  
  // Sign out
  async signOut(): Promise<{ success: boolean }> {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw new Error(error.message);
    
    return { success: true };
  }
}

export default new AuthService();