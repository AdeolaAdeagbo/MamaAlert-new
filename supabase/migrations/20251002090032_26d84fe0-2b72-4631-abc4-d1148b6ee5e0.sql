-- Create transport_requests table
CREATE TABLE IF NOT EXISTS public.transport_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pickup_location TEXT NOT NULL,
  pickup_latitude DECIMAL(10, 8),
  pickup_longitude DECIMAL(11, 8),
  destination TEXT NOT NULL,
  destination_latitude DECIMAL(10, 8),
  destination_longitude DECIMAL(11, 8),
  transport_type TEXT NOT NULL CHECK (transport_type IN ('ambulance', 'private', 'taxi')),
  urgency TEXT NOT NULL CHECK (urgency IN ('critical', 'urgent', 'normal')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'on_the_way', 'arrived', 'completed', 'cancelled')),
  driver_name TEXT,
  driver_phone TEXT,
  vehicle_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transport_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transport requests"
ON public.transport_requests
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transport requests"
ON public.transport_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transport requests"
ON public.transport_requests
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_transport_requests_updated_at
BEFORE UPDATE ON public.transport_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better query performance
CREATE INDEX idx_transport_requests_user_id ON public.transport_requests(user_id);
CREATE INDEX idx_transport_requests_status ON public.transport_requests(status);