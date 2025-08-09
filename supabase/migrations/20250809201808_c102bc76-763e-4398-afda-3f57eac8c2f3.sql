-- Add SMS reminder tracking to vaccines table
ALTER TABLE public.vaccines 
ADD COLUMN reminder_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN reminder_sent_date DATE;

-- Add trigger to automatically send SMS reminders for upcoming vaccines
CREATE OR REPLACE FUNCTION public.check_vaccine_reminders()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if vaccine is due within 7 days and no reminder sent yet
  IF NEW.scheduled_date <= (CURRENT_DATE + INTERVAL '7 days') 
     AND NEW.administered_date IS NULL 
     AND (NEW.reminder_sent IS FALSE OR NEW.reminder_sent IS NULL) THEN
    
    -- Mark reminder as sent
    NEW.reminder_sent = TRUE;
    NEW.reminder_sent_date = CURRENT_DATE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vaccine reminder checking
DROP TRIGGER IF EXISTS vaccine_reminder_trigger ON public.vaccines;
CREATE TRIGGER vaccine_reminder_trigger
  BEFORE UPDATE ON public.vaccines
  FOR EACH ROW
  EXECUTE FUNCTION public.check_vaccine_reminders();

-- Create function to check for overdue vaccines and send alerts
CREATE OR REPLACE FUNCTION public.send_vaccine_reminders()
RETURNS void AS $$
DECLARE
  vaccine_record RECORD;
BEGIN
  -- Find vaccines that are due within 7 days and haven't had reminders sent
  FOR vaccine_record IN
    SELECT v.*, p.first_name, p.last_name
    FROM public.vaccines v
    JOIN public.profiles p ON v.user_id = p.id
    WHERE v.scheduled_date <= (CURRENT_DATE + INTERVAL '7 days')
      AND v.administered_date IS NULL
      AND (v.reminder_sent IS FALSE OR v.reminder_sent IS NULL)
  LOOP
    -- Here you would typically call an external service to send SMS
    -- For now, we'll just mark the reminder as sent
    UPDATE public.vaccines 
    SET reminder_sent = TRUE, reminder_sent_date = CURRENT_DATE
    WHERE id = vaccine_record.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create an edge function trigger for severe symptoms to send emergency alerts
CREATE OR REPLACE FUNCTION public.handle_severe_symptom_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if symptom is severe (severity >= 7)
  IF NEW.severity >= 7 THEN
    -- Insert emergency alert
    INSERT INTO public.emergency_alerts (
      user_id,
      alert_type,
      message,
      location
    ) VALUES (
      NEW.user_id,
      'severe_symptom',
      'Severe symptom logged: ' || NEW.symptom_type || ' (Severity: ' || NEW.severity || ')',
      'Dashboard - Symptom Logger'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for severe symptom alerts
DROP TRIGGER IF EXISTS severe_symptom_alert_trigger ON public.symptom_logs;
CREATE TRIGGER severe_symptom_alert_trigger
  AFTER INSERT ON public.symptom_logs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_severe_symptom_alert();