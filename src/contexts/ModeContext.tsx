import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

export type UserMode = 'pregnancy' | 'postpartum' | 'onboarding';

interface ModeContextType {
  currentMode: UserMode;
  isLoading: boolean;
  switchToPostpartum: (deliveryDate: string) => Promise<void>;
  switchToPregnancy: () => Promise<void>;
  setOnboardingMode: (mode: 'pregnancy' | 'postpartum') => Promise<void>;
  refreshMode: () => Promise<void>;
  deliveryDate?: string;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider = ({ children }: ModeProviderProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentMode, setCurrentMode] = useState<UserMode>('onboarding');
  const [isLoading, setIsLoading] = useState(true);
  const [deliveryDate, setDeliveryDate] = useState<string>();

  // Determine user mode based on pregnancy data
  const determineUserMode = async (userId: string): Promise<{ mode: UserMode; deliveryDate?: string }> => {
    try {
      const { data: pregnancyData, error } = await supabase
        .from('pregnancy_data')
        .select('delivery_date, last_menstrual_period, weeks_pregnant')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      // If no pregnancy data exists, user needs onboarding
      if (!pregnancyData) {
        return { mode: 'onboarding' };
      }

      // If delivery_date is set, user is in postpartum mode
      if (pregnancyData.delivery_date) {
        return { 
          mode: 'postpartum', 
          deliveryDate: pregnancyData.delivery_date 
        };
      }

      // If pregnancy data exists but no delivery date, user is in pregnancy mode
      return { mode: 'pregnancy' };
    } catch (error) {
      console.error('Error determining user mode:', error);
      return { mode: 'onboarding' };
    }
  };

  // Load user mode on mount and when user changes
  useEffect(() => {
    const loadUserMode = async () => {
      if (!user?.id) {
        setCurrentMode('onboarding');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { mode, deliveryDate: userDeliveryDate } = await determineUserMode(user.id);
      setCurrentMode(mode);
      setDeliveryDate(userDeliveryDate);
      setIsLoading(false);
    };

    loadUserMode();
  }, [user?.id]);

  // Switch to postpartum mode by logging delivery date
  const switchToPostpartum = async (deliveryDate: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Update or insert pregnancy data with delivery date
      const { data, error } = await supabase
        .from('pregnancy_data')
        .upsert({
          user_id: user.id,
          delivery_date: deliveryDate,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentMode('postpartum');
      setDeliveryDate(deliveryDate);
      
      toast({
        title: "Congratulations! 🎉",
        description: "Welcome to postpartum care. Your care plan has been updated.",
      });
    } catch (error) {
      console.error('Error switching to postpartum mode:', error);
      toast({
        title: "Error",
        description: "Failed to update delivery information.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Switch back to pregnancy mode by clearing delivery date
  const switchToPregnancy = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      const { error } = await supabase
        .from('pregnancy_data')
        .update({
          delivery_date: null,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setCurrentMode('pregnancy');
      setDeliveryDate(undefined);

      toast({
        title: "Switched to Pregnancy Mode",
        description: "You're now back in pregnancy care.",
      });
    } catch (error) {
      console.error('Error switching to pregnancy mode:', error);
      toast({
        title: "Error",
        description: "Failed to switch mode.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Set initial mode during onboarding
  const setOnboardingMode = async (mode: 'pregnancy' | 'postpartum') => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      if (mode === 'pregnancy') {
        // User selected pregnancy mode - no delivery date
        setCurrentMode('pregnancy');
      } else {
        // User selected postpartum mode - ask for delivery date
        const today = new Date().toISOString().split('T')[0];
        await switchToPostpartum(today);
      }
    } catch (error) {
      console.error('Error setting onboarding mode:', error);
      toast({
        title: "Error",
        description: "Failed to set user mode.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh mode from database
  const refreshMode = async () => {
    if (!user?.id) return;
    
    const { mode, deliveryDate: userDeliveryDate } = await determineUserMode(user.id);
    setCurrentMode(mode);
    setDeliveryDate(userDeliveryDate);
  };

  return (
    <ModeContext.Provider value={{
      currentMode,
      isLoading,
      switchToPostpartum,
      switchToPregnancy,
      setOnboardingMode,
      refreshMode,
      deliveryDate
    }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};