
-- First, let's check what policies already exist and only create the missing ones

-- Enable RLS on tables that might not have it enabled yet
DO $$
BEGIN
    -- Only enable RLS if not already enabled
    IF NOT (SELECT schemaname = 'public' AND tablename = 'pregnancy_data' AND rowsecurity = true 
            FROM pg_tables WHERE schemaname = 'public' AND tablename = 'pregnancy_data') THEN
        ALTER TABLE public.pregnancy_data ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT schemaname = 'public' AND tablename = 'symptom_logs' AND rowsecurity = true 
            FROM pg_tables WHERE schemaname = 'public' AND tablename = 'symptom_logs') THEN
        ALTER TABLE public.symptom_logs ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT schemaname = 'public' AND tablename = 'emergency_contacts' AND rowsecurity = true 
            FROM pg_tables WHERE schemaname = 'public' AND tablename = 'emergency_contacts') THEN
        ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT schemaname = 'public' AND tablename = 'appointments' AND rowsecurity = true 
            FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT schemaname = 'public' AND tablename = 'emergency_alerts' AND rowsecurity = true 
            FROM pg_tables WHERE schemaname = 'public' AND tablename = 'emergency_alerts') THEN
        ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT (SELECT schemaname = 'public' AND tablename = 'profiles' AND rowsecurity = true 
            FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create policies only if they don't exist (using IF NOT EXISTS equivalent)

-- Pregnancy data policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pregnancy_data' AND policyname = 'Users can insert their own pregnancy data') THEN
        CREATE POLICY "Users can insert their own pregnancy data" 
          ON public.pregnancy_data 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pregnancy_data' AND policyname = 'Users can update their own pregnancy data') THEN
        CREATE POLICY "Users can update their own pregnancy data" 
          ON public.pregnancy_data 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pregnancy_data' AND policyname = 'Users can delete their own pregnancy data') THEN
        CREATE POLICY "Users can delete their own pregnancy data" 
          ON public.pregnancy_data 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Symptom logs policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'symptom_logs' AND policyname = 'Users can view their own symptom logs') THEN
        CREATE POLICY "Users can view their own symptom logs" 
          ON public.symptom_logs 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'symptom_logs' AND policyname = 'Users can insert their own symptom logs') THEN
        CREATE POLICY "Users can insert their own symptom logs" 
          ON public.symptom_logs 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'symptom_logs' AND policyname = 'Users can update their own symptom logs') THEN
        CREATE POLICY "Users can update their own symptom logs" 
          ON public.symptom_logs 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'symptom_logs' AND policyname = 'Users can delete their own symptom logs') THEN
        CREATE POLICY "Users can delete their own symptom logs" 
          ON public.symptom_logs 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Emergency contacts policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_contacts' AND policyname = 'Users can view their own emergency contacts') THEN
        CREATE POLICY "Users can view their own emergency contacts" 
          ON public.emergency_contacts 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_contacts' AND policyname = 'Users can insert their own emergency contacts') THEN
        CREATE POLICY "Users can insert their own emergency contacts" 
          ON public.emergency_contacts 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_contacts' AND policyname = 'Users can update their own emergency contacts') THEN
        CREATE POLICY "Users can update their own emergency contacts" 
          ON public.emergency_contacts 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_contacts' AND policyname = 'Users can delete their own emergency contacts') THEN
        CREATE POLICY "Users can delete their own emergency contacts" 
          ON public.emergency_contacts 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Appointments policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can view their own appointments') THEN
        CREATE POLICY "Users can view their own appointments" 
          ON public.appointments 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can insert their own appointments') THEN
        CREATE POLICY "Users can insert their own appointments" 
          ON public.appointments 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can update their own appointments') THEN
        CREATE POLICY "Users can update their own appointments" 
          ON public.appointments 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'appointments' AND policyname = 'Users can delete their own appointments') THEN
        CREATE POLICY "Users can delete their own appointments" 
          ON public.appointments 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Emergency alerts policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_alerts' AND policyname = 'Users can view their own emergency alerts') THEN
        CREATE POLICY "Users can view their own emergency alerts" 
          ON public.emergency_alerts 
          FOR SELECT 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_alerts' AND policyname = 'Users can insert their own emergency alerts') THEN
        CREATE POLICY "Users can insert their own emergency alerts" 
          ON public.emergency_alerts 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_alerts' AND policyname = 'Users can update their own emergency alerts') THEN
        CREATE POLICY "Users can update their own emergency alerts" 
          ON public.emergency_alerts 
          FOR UPDATE 
          USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'emergency_alerts' AND policyname = 'Users can delete their own emergency alerts') THEN
        CREATE POLICY "Users can delete their own emergency alerts" 
          ON public.emergency_alerts 
          FOR DELETE 
          USING (auth.uid() = user_id);
    END IF;
END $$;

-- Profiles policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
        CREATE POLICY "Users can view their own profile" 
          ON public.profiles 
          FOR SELECT 
          USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" 
          ON public.profiles 
          FOR INSERT 
          WITH CHECK (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" 
          ON public.profiles 
          FOR UPDATE 
          USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can delete their own profile') THEN
        CREATE POLICY "Users can delete their own profile" 
          ON public.profiles 
          FOR DELETE 
          USING (auth.uid() = id);
    END IF;
END $$;
