import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BabyProfile {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  birth_weight?: number;
  birth_height?: number;
  gender?: string;
  created_at: string;
  updated_at: string;
}

export const useBabyProfile = (userId: string) => {
  const [babyProfiles, setBabyProfiles] = useState<BabyProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchBabyProfiles();
    }
  }, [userId]);

  const fetchBabyProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('baby_profiles')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBabyProfiles(data || []);
    } catch (error) {
      console.error('Error fetching baby profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load baby profiles.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createBabyProfile = async (profile: Omit<BabyProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('baby_profiles')
        .insert({
          ...profile,
          user_id: userId
        })
        .select()
        .single();

      if (error) throw error;
      setBabyProfiles(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Baby profile created successfully."
      });
      return data;
    } catch (error) {
      console.error('Error creating baby profile:', error);
      toast({
        title: "Error",
        description: "Failed to create baby profile.",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateBabyProfile = async (id: string, updates: Partial<BabyProfile>) => {
    try {
      const { data, error } = await supabase
        .from('baby_profiles')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setBabyProfiles(prev => 
        prev.map(profile => profile.id === id ? data : profile)
      );
      toast({
        title: "Success",
        description: "Baby profile updated successfully."
      });
      return data;
    } catch (error) {
      console.error('Error updating baby profile:', error);
      toast({
        title: "Error",
        description: "Failed to update baby profile.",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    babyProfiles,
    isLoading,
    createBabyProfile,
    updateBabyProfile,
    refreshProfiles: fetchBabyProfiles
  };
};