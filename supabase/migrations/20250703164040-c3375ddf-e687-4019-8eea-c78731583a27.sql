
-- Add reminder_sent column to appointments table
ALTER TABLE public.appointments 
ADD COLUMN reminder_sent boolean NOT NULL DEFAULT false;
