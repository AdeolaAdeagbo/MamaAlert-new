
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SMSRequest {
  emergencyContacts: Array<{
    name: string;
    phone: string;
  }>;
  userLocation?: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emergencyContacts, userLocation, userName }: SMSRequest = await req.json();

    const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
    const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");
    const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error("Twilio credentials not configured");
    }

    const message = `🚨 EMERGENCY ALERT 🚨
${userName} has triggered an emergency alert and needs immediate assistance.

${userLocation ? `Location: ${userLocation}` : 'Location: Not available'}

Please check on them immediately or call emergency services if needed.

Time: ${new Date().toLocaleString()}

This is an automated message from MamaAlert.`;

    const results = [];

    // Send SMS to each emergency contact
    for (const contact of emergencyContacts) {
      try {
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              "Authorization": `Basic ${btoa(`${accountSid}:${authToken}`)}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              From: twilioPhoneNumber,
              To: contact.phone,
              Body: message,
            }),
          }
        );

        const result = await response.json();
        
        if (response.ok) {
          console.log(`SMS sent successfully to ${contact.name} (${contact.phone})`);
          results.push({
            contact: contact.name,
            phone: contact.phone,
            success: true,
            messageId: result.sid
          });
        } else {
          console.error(`Failed to send SMS to ${contact.name}:`, result);
          results.push({
            contact: contact.name,
            phone: contact.phone,
            success: false,
            error: result.message
          });
        }
      } catch (error) {
        console.error(`Error sending SMS to ${contact.name}:`, error);
        results.push({
          contact: contact.name,
          phone: contact.phone,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return new Response(
      JSON.stringify({
        success: true,
        messagesSent: successCount,
        totalContacts: emergencyContacts.length,
        results
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-emergency-sms function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
