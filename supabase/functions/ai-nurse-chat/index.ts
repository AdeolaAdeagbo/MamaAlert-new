
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, pregnancyWeek = 0 } = await req.json();

    const systemPrompt = `You are MamaAlert AI Nurse, a specialized AI assistant for pregnant women in Nigeria. You provide caring, accurate, and culturally sensitive pregnancy advice.

Key guidelines:
- Always be warm, supportive, and reassuring
- Provide practical advice relevant to Nigerian healthcare context
- Use simple, clear language that's easy to understand
- Always recommend consulting healthcare providers for serious concerns
- Be mindful of cultural practices and beliefs in Nigeria
- Include relevant local context when appropriate

Current pregnancy context: Week ${pregnancyWeek} of pregnancy.

If asked about emergency symptoms, always emphasize seeking immediate medical attention.
For routine questions, provide helpful information while encouraging regular prenatal care.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'OpenAI API error');
    }

    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-nurse-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallbackResponse: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact your healthcare provider if you have urgent concerns."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
