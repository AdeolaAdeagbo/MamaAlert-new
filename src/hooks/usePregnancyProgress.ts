
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PregnancyData {
  weeks_pregnant?: number;
  due_date?: string;
  last_menstrual_period?: string;
  is_high_risk?: boolean;
  created_at?: string;
}

export const usePregnancyProgress = (userId: string) => {
  const [pregnancyData, setPregnancyData] = useState<PregnancyData | null>(null);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateCurrentWeek = (lmp: string, createdAt: string) => {
    const lmpDate = new Date(lmp);
    const now = new Date();
    
    // Calculate weeks from LMP to now
    const diffTime = Math.abs(now.getTime() - lmpDate.getTime());
    const weeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    
    return Math.min(weeks, 42); // Cap at 42 weeks
  };

  const updatePregnancyWeek = async (newWeek: number) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('pregnancy_data')
        .update({ 
          weeks_pregnant: newWeek,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
      
      setCurrentWeek(newWeek);
      console.log(`Updated pregnancy week to: ${newWeek}`);
    } catch (error) {
      console.error('Error updating pregnancy week:', error);
    }
  };

  const loadAndUpdatePregnancyData = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('pregnancy_data')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setPregnancyData(data);
        
        // Calculate current week based on LMP or creation date
        if (data.last_menstrual_period) {
          const calculatedWeek = calculateCurrentWeek(
            data.last_menstrual_period, 
            data.created_at || new Date().toISOString()
          );
          
          // Update if calculated week is different from stored week
          if (calculatedWeek !== data.weeks_pregnant) {
            await updatePregnancyWeek(calculatedWeek);
          } else {
            setCurrentWeek(data.weeks_pregnant || 0);
          }
        } else {
          setCurrentWeek(data.weeks_pregnant || 0);
        }
      }
    } catch (error) {
      console.error('Error loading pregnancy data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAndUpdatePregnancyData();
  }, [userId]);

  // Auto-update weekly
  useEffect(() => {
    const interval = setInterval(() => {
      if (pregnancyData?.last_menstrual_period) {
        const newWeek = calculateCurrentWeek(
          pregnancyData.last_menstrual_period,
          pregnancyData.created_at || new Date().toISOString()
        );
        
        if (newWeek !== currentWeek) {
          updatePregnancyWeek(newWeek);
        }
      }
    }, 24 * 60 * 60 * 1000); // Check daily

    return () => clearInterval(interval);
  }, [pregnancyData, currentWeek]);

  return {
    pregnancyData,
    currentWeek,
    loading,
    refreshData: loadAndUpdatePregnancyData
  };
};
