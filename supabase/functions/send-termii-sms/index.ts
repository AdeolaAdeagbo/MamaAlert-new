
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface TermiiSMSRequest {
  emergencyContacts?: Array<{
    name: string;
    phone: string;
  }>;
  phoneNumber?: string;
  message: string;
  userLocation?: string;
  userName: string;
  messageType?: "emergency" | "health_tip" | "appointment" | "general";
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      emergencyContacts, 
      phoneNumber, 
      message, 
      userLocation, 
      userName,
      messageType = "general"
    }: TermiiSMSRequest = await req.json();

    const termiiApiKey = Deno.env.get("TERMII_API_KEY");

    if (!termiiApiKey) {
      throw new Error("Termii API key not configured");
    }

    let finalMessage = message;

    // Format emergency message if it's an emergency alert
    if (messageType === "emergency" && userLocation) {
      finalMessage = `EMERGENCY ALERT
${userName} has triggered an emergency alert and needs immediate assistance.

Location: ${userLocation}

Please check on them immediately or call emergency services if needed.

Time: ${new Date().toLocaleString()}

This is an automated message from MamaAlert.`;
    }

    const results = [];

    // Function to send SMS to a single number
    const sendSMS = async (phoneNumber: string, recipientName?: string) => {
      try {
        console.log(`Sending SMS to ${phoneNumber} (${recipientName || 'Unknown'})`);
        
        const response = await fetch("https://api.ng.termii.com/api/sms/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: phoneNumber,
            from: "MamaAlert",
            sms: finalMessage,
            type: "plain",
            channel: "generic",
            api_key: termiiApiKey,
          }),
        });

        const result = await response.json();
        
        if (response.ok && result.message === "Successfully Sent") {
          console.log(`SMS sent successfully to ${phoneNumber}`);
          return {
            contact: recipientName || phoneNumber,
            phone: phoneNumber,
            success: true,
            messageId: result.message_id
          };
        } else {
          console.error(`Failed to send SMS to ${phoneNumber}:`, result);
          return {
            contact: recipientName || phoneNumber,
            phone: phoneNumber,
            success: false,
            error: result.message || "Unknown error"
          };
        }
      } catch (error) {
        console.error(`Error sending SMS to ${phoneNumber}:`, error);
        return {
          contact: recipientName || phoneNumber,
          phone: phoneNumber,
          success: false,
          error: error.message
        };
      }
    };

    // Send to emergency contacts if provided
    if (emergencyContacts && emergencyContacts.length > 0) {
      for (const contact of emergencyContacts) {
        const result = await sendSMS(contact.phone, contact.name);
        results.push(result);
      }
    }

    // Send to single phone number if provided
    if (phoneNumber) {
      const result = await sendSMS(phoneNumber, userName);
      results.push(result);
    }

    const successCount = results.filter(r => r.success).length;
    const totalContacts = results.length;
    
    return new Response(
      JSON.stringify({
        success: true,
        messagesSent: successCount,
        totalContacts,
        results,
        provider: "Termii"
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
    console.error("Error in send-termii-sms function:", error);
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
