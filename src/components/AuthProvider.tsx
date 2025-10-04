
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

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
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: any }>;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error?: any }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUserData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      await loadUserProfile(authUser);
    }
  };

  const loadUserProfile = async (authUser: User) => {
    try {
      console.log('Loading user profile for:', authUser.id);
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: authUser.id,
              first_name: authUser.user_metadata?.first_name || '',
              last_name: authUser.user_metadata?.last_name || ''
            });
          
          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        }
      }

      // Get pregnancy data
      const { data: pregnancyData, error: pregnancyError } = await supabase
        .from('pregnancy_data')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      if (pregnancyError && pregnancyError.code !== 'PGRST116') {
        console.error('Pregnancy data error:', pregnancyError);
      }

      // Count emergency contacts
      const { count: emergencyContactsCount, error: contactsError } = await supabase
        .from('emergency_contacts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authUser.id);

      if (contactsError) {
        console.error('Emergency contacts error:', contactsError);
      }

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
        firstName: profile?.first_name || authUser.user_metadata?.first_name || '',
        lastName: profile?.last_name || authUser.user_metadata?.last_name || '',
        pregnancyWeek,
        dueDate: pregnancyData?.due_date || undefined,
        emergencyContacts: emergencyContactsCount || 0,
        isHighRisk: pregnancyData?.is_high_risk || false,
        hasPregnancyData: !!pregnancyData
      };

      console.log('User profile loaded:', userProfile);
      setUser(userProfile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set basic user info if profile loading fails
      const basicProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        firstName: authUser.user_metadata?.first_name || '',
        lastName: authUser.user_metadata?.last_name || '',
        pregnancyWeek: 0,
        emergencyContacts: 0,
        isHighRisk: false,
        hasPregnancyData: false
      };
      setUser(basicProfile);
    }
  };

  useEffect(() => {
    console.log('AuthProvider initializing...');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        // Use setTimeout to prevent auth deadlock
        setTimeout(() => {
          loadUserProfile(session.user);
        }, 0);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      console.log('Initial session:', session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        setTimeout(() => {
          loadUserProfile(session.user);
        }, 0);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider cleanup');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Login attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      console.log('Login result:', { user: data.user?.id, error });
      
      if (error) {
        console.error('Login error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Login exception:', error);
      return { error };
    }
  };

  const signup = async (email: string, password: string, firstName: string, lastName: string) => {
    console.log('Signup attempt for:', email);
    
    try {
      const redirectUrl = `${window.location.origin}/dashboard`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });
      
      console.log('Signup result:', { user: data.user?.id, error });
      
      if (error) {
        console.error('Signup error:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  const logout = async () => {
    console.log('Logout attempt');
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const contextValue = {
    user,
    session,
    login,
    signup,
    logout,
    isLoading,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
