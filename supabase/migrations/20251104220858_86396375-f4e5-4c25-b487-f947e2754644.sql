-- Create trusted_transport table
CREATE TABLE public.trusted_transport (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  driver_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  vehicle_info TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.trusted_transport ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for trusted_transport
CREATE POLICY "Users can view their own transport contacts"
ON public.trusted_transport
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transport contacts"
ON public.trusted_transport
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transport contacts"
ON public.trusted_transport
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transport contacts"
ON public.trusted_transport
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_trusted_transport_updated_at
BEFORE UPDATE ON public.trusted_transport
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create emergency_planning table
CREATE TABLE public.emergency_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_items TEXT,
  weekly_reminders BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.emergency_planning ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for emergency_planning
CREATE POLICY "Users can view their own emergency planning"
ON public.emergency_planning
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own emergency planning"
ON public.emergency_planning
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own emergency planning"
ON public.emergency_planning
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own emergency planning"
ON public.emergency_planning
FOR DELETE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_emergency_planning_updated_at
BEFORE UPDATE ON public.emergency_planning
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();