
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, clinicId } = await req.json();
    
    if (!message || !clinicId) {
      throw new Error('Message and clinicId are required');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch clinic configuration
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('*')
      .eq('clinic_id', clinicId)
      .single();

    if (clinicError || !clinic) {
      throw new Error('Clinic not found');
    }

    // Generate system prompt
    const systemPrompt = `You are a helpful dental assistant for ${clinic.name} located at ${clinic.address}. 

Our office hours are: ${clinic.office_hours}
Phone: ${clinic.phone}

Services we offer: ${clinic.services_offered.join(', ')}
Insurance we accept: ${clinic.insurance_accepted.join(', ')}

Emergency instructions: ${clinic.emergency_instructions}

Guidelines for responses:
- Be friendly, professional, and helpful
- Do not provide medical diagnoses or treatment advice
- For urgent dental issues, advise patients to call our office
- Help with appointment scheduling by directing them to call our office
- Answer questions about services, hours, insurance, and general dental care
- Keep responses concise but informative
- If asked about pricing, explain that costs vary and they should call for a consultation

Always end responses about emergencies or urgent issues by reminding patients to call our office phone number.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const data = await openAIResponse.json();
    const response = data.choices[0].message.content;

    // Store chat message in database
    await supabase
      .from('chat_messages')
      .insert({
        clinic_id: clinicId,
        message_content: message,
        response_content: response
      });

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
