
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pregnancyWeek?: number;
  dueDate?: string;
  emergencyContacts: number;
  isHighRisk?: boolean;
  hasPregnancyData: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUserProfile(authUser);
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Get pregnancy data
      const { data: pregnancyData } = await supabase
        .from('pregnancy_data')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      // Count emergency contacts
      const { count: emergencyContactsCount } = await supabase
        .from('emergency_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id);

      // Calculate pregnancy week if data exists
      let pregnancyWeek = 0;
      if (pregnancyData?.last_menstrual_period) {
        const lmp = new Date(pregnancyData.last_menstrual_period);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lmp.getTime());
        pregnancyWeek = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
        pregnancyWeek = Math.min(pregnancyWeek, 42); // Cap at 42 weeks
      } else if (pregnancyData?.weeks_pregnant) {
        pregnancyWeek = pregnancyData.weeks_pregnant;
      }

      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        firstName: profile?.first_name || '',
        lastName: profile?.last_name || '',
        pregnancyWeek,
        dueDate: pregnancyData?.due_date || undefined,
        emergencyContacts: emergencyContactsCount || 0,
        isHighRisk: pregnancyData?.is_high_risk || false,
        hasPregnancyData: !!pregnancyData
      };

      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setIsLoading(false);
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });
    if (error) throw error;
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, refreshUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
