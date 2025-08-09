import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "../_shared/supabase.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VaccineReminderRequest {
  messageType: string;
  vaccineName: string;
  scheduledDate: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messageType, vaccineName, scheduledDate, userId }: VaccineReminderRequest = await req.json();

    console.log('Processing vaccine reminder request:', { messageType, vaccineName, scheduledDate, userId });

    // Get user emergency contacts
    const { data: emergencyContacts, error: contactsError } = await supabase
      .from('emergency_contacts')
      .select('name, phone')
      .eq('user_id', userId);

    if (contactsError) {
      throw new Error(`Failed to fetch emergency contacts: ${contactsError.message}`);
    }

    if (!emergencyContacts || emergencyContacts.length === 0) {
      throw new Error('No emergency contacts found for user');
    }

    // Get user profile for name
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    if (profileError) {
      throw new Error(`Failed to fetch user profile: ${profileError.message}`);
    }

    const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : 'MamaAlert User';
    const formattedDate = new Date(scheduledDate).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const message = `VACCINATION REMINDER

${userName}'s baby has an upcoming vaccination scheduled:

Vaccine: ${vaccineName}
Date: ${formattedDate}

Please ensure the baby receives this important vaccination on time. You can find nearby healthcare centers in the MamaAlert app.

This is an automated reminder from MamaAlert.`;

    // Send SMS to emergency contacts
    const response = await supabase.functions.invoke('send-termii-sms', {
      body: {
        emergencyContacts: emergencyContacts.filter(contact => contact.phone),
        message,
        userName,
        messageType: "vaccine_reminder"
      }
    });

    if (response.error) {
      console.error('SMS sending failed:', response.error);
      throw new Error(`Failed to send SMS: ${response.error.message}`);
    }

    console.log('Vaccine reminder SMS sent successfully:', response.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Vaccine reminder sent successfully',
        recipients: emergencyContacts.length
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-vaccine-reminder function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);