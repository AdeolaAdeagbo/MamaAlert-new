
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
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { message, pregnancyWeek = 0, hasDelivered = false, babyCount = 0, babyAges = [] } = await req.json();

    if (!message) {
      throw new Error('No message provided');
    }

    const careContext = hasDelivered || babyCount > 0 ? 'postpartum mother and infant care' : 'pregnancy care';
    const babyInfo = babyAges.length > 0 ? 
      `Current babies: ${babyAges.map((baby: any) => `${baby.name} (${baby.ageInDays} days old)`).join(', ')}.` : '';

    const systemPrompt = `You are MamaAlert AI Nurse, a specialized AI assistant for pregnant women and new mothers in Nigeria. You provide caring, accurate, and culturally sensitive pregnancy and postpartum advice.

Key guidelines:
- Always be warm, supportive, and reassuring
- Provide practical advice relevant to Nigerian healthcare context
- Use simple, clear language that's easy to understand
- Always recommend consulting healthcare providers for serious concerns
- Be mindful of cultural practices and beliefs in Nigeria
- Include relevant local context when appropriate
- Keep responses concise but helpful (max 150 words)

Current context: ${careContext}
${pregnancyWeek > 0 ? `Pregnancy week: ${pregnancyWeek}` : ''}
${babyInfo}

You can help with:
- Pregnancy symptoms and concerns
- Breastfeeding support and techniques
- Infant health, development, and milestones
- Postpartum recovery and mental health
- Baby care basics (feeding, sleep, diaper changes)
- Emergency warning signs for mother and baby
- Nigerian cultural practices around childbirth and child-rearing
- Nigerian immunization schedule and vaccines

If asked about emergency symptoms (for mother or baby), always emphasize seeking immediate medical attention.
For routine questions, provide helpful information while encouraging regular prenatal/pediatric care.
When discussing baby symptoms or development, always consider the baby's age in your response.

Always end with a caring note and remind them you're here 24/7 for support.`;

    console.log('Processing AI nurse chat request...');

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
        max_tokens: 400,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI nurse response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-nurse-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      fallbackResponse: "I'm sorry, I'm having trouble connecting right now. Please try again later or contact your healthcare provider if you have urgent concerns. Remember to take care of yourself and your baby."
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
