-- Create baby profiles table
CREATE TABLE public.baby_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  birth_weight DECIMAL(5,2),
  birth_height DECIMAL(5,2),
  gender TEXT CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.baby_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for baby profiles
CREATE POLICY "Users can view their own baby profiles" 
ON public.baby_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own baby profiles" 
ON public.baby_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby profiles" 
ON public.baby_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own baby profiles" 
ON public.baby_profiles 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create breastfeeding sessions table
CREATE TABLE public.breastfeeding_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  side_used TEXT CHECK (side_used IN ('left', 'right', 'both')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.breastfeeding_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for breastfeeding sessions
CREATE POLICY "Users can view their own breastfeeding sessions" 
ON public.breastfeeding_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own breastfeeding sessions" 
ON public.breastfeeding_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breastfeeding sessions" 
ON public.breastfeeding_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own breastfeeding sessions" 
ON public.breastfeeding_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create infant symptoms table
CREATE TABLE public.infant_symptoms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID NOT NULL,
  symptom_type TEXT NOT NULL,
  severity INTEGER CHECK (severity >= 1 AND severity <= 10),
  description TEXT,
  temperature DECIMAL(4,1),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.infant_symptoms ENABLE ROW LEVEL SECURITY;

-- Create policies for infant symptoms
CREATE POLICY "Users can view their own infant symptoms" 
ON public.infant_symptoms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own infant symptoms" 
ON public.infant_symptoms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own infant symptoms" 
ON public.infant_symptoms 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own infant symptoms" 
ON public.infant_symptoms 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create vaccines table
CREATE TABLE public.vaccines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID NOT NULL,
  vaccine_name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  administered_date DATE,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vaccines ENABLE ROW LEVEL SECURITY;

-- Create policies for vaccines
CREATE POLICY "Users can view their own vaccines" 
ON public.vaccines 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own vaccines" 
ON public.vaccines 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vaccines" 
ON public.vaccines 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vaccines" 
ON public.vaccines 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create baby growth tracking table
CREATE TABLE public.baby_growth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  head_circumference DECIMAL(5,2),
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.baby_growth ENABLE ROW LEVEL SECURITY;

-- Create policies for baby growth
CREATE POLICY "Users can view their own baby growth data" 
ON public.baby_growth 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own baby growth data" 
ON public.baby_growth 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby growth data" 
ON public.baby_growth 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own baby growth data" 
ON public.baby_growth 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create mood tracking table
CREATE TABLE public.mood_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mood_score INTEGER CHECK (mood_score >= 1 AND mood_score <= 10),
  anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 10),
  sleep_hours DECIMAL(3,1),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mood_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for mood tracking
CREATE POLICY "Users can view their own mood tracking" 
ON public.mood_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mood tracking" 
ON public.mood_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood tracking" 
ON public.mood_tracking 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood tracking" 
ON public.mood_tracking 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create milestones table
CREATE TABLE public.baby_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID NOT NULL,
  milestone_name TEXT NOT NULL,
  milestone_type TEXT CHECK (milestone_type IN ('physical', 'cognitive', 'social', 'language')),
  expected_age_months INTEGER,
  achieved_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.baby_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for baby milestones
CREATE POLICY "Users can view their own baby milestones" 
ON public.baby_milestones 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own baby milestones" 
ON public.baby_milestones 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own baby milestones" 
ON public.baby_milestones 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own baby milestones" 
ON public.baby_milestones 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_baby_profiles_updated_at
BEFORE UPDATE ON public.baby_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vaccines_updated_at
BEFORE UPDATE ON public.vaccines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();