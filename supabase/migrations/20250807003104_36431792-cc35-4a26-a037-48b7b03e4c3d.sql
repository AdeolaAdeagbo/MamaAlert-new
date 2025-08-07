-- Add delivery_date to pregnancy_data table to track when user gives birth
ALTER TABLE public.pregnancy_data 
ADD COLUMN delivery_date date;

-- Add comment to explain the column
COMMENT ON COLUMN public.pregnancy_data.delivery_date IS 'Date when the user gave birth, used to switch from pregnancy to postpartum mode';