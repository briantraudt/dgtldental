
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to trim conversation history to fit within token limits
const trimConversationHistory = (messages: Array<{role: string, content: string}>, maxMessages = 10) => {
  // Keep system message if it exists, and trim user/assistant pairs from the beginning
  const systemMessages = messages.filter(msg => msg.role === 'system');
  const conversationMessages = messages.filter(msg => msg.role !== 'system');
  
  // Keep the most recent messages, ensuring we don't exceed the limit
  const trimmedConversation = conversationMessages.slice(-maxMessages);
  
  return [...systemMessages, ...trimmedConversation];
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, messages = [], clinicId = 'demo-clinic-123' } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('DEMO: Received request with message:', message);
    console.log('DEMO: Conversation history length:', messages.length);

    // Initialize Supabase client to get clinic config
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get clinic configuration
    let clinicConfig;
    try {
      const { data: clinic } = await supabase
        .from('clinics')
        .select('*')
        .eq('clinic_id', clinicId)
        .single();
      
      clinicConfig = clinic;
    } catch (error) {
      console.log('Using fallback demo config');
      // Use fallback config if not found in database
      clinicConfig = {
        clinic_id: 'demo-clinic-123',
        name: 'Demo Dental Practice',
        address: '123 Demo Street, Demo City, DC 12345',
        phone: '(555) 123-DEMO',
        office_hours: 'Monday-Friday: 8:00 AM - 5:00 PM, Saturday: 9:00 AM - 1:00 PM',
        services_offered: ['General Dentistry', 'Cleanings', 'Fillings', 'Crowns', 'Root Canals', 'Teeth Whitening'],
        insurance_accepted: ['Most Major Insurance Plans', 'Delta Dental', 'Aetna', 'Cigna', 'MetLife'],
        emergency_instructions: 'For dental emergencies after hours, please call our main number and follow the prompts for emergency care.'
      };
    }

    // Generate system prompt based on clinic configuration
    const systemPrompt = `You are a helpful dental AI assistant for ${clinicConfig.name}.

Practice Information:
- Name: ${clinicConfig.name}
- Address: ${clinicConfig.address}
- Phone: ${clinicConfig.phone}
- Office Hours: ${clinicConfig.office_hours}
- Services: ${clinicConfig.services_offered?.join(', ') || 'General dental services'}
- Insurance: ${clinicConfig.insurance_accepted?.join(', ') || 'Please call to verify insurance'}
- Emergency Instructions: ${clinicConfig.emergency_instructions}

This is a DEMO to showcase AI chat capabilities for dental websites. You should:

- Provide helpful, accurate information about dental care and oral health specific to this practice
- Answer questions about appointments, services, office hours, insurance, and location
- Give general advice about dental health and preventive care
- Be friendly, professional, and supportive
- Always remind users that this is general information and they should consult a qualified dentist for specific medical advice
- For urgent dental issues, advise patients to contact the dentist immediately
- Keep responses concise but informative
- Focus on education and general dental health topics
- Reference previous parts of the conversation when relevant to provide continuity

IMPORTANT: ALWAYS end every response with this exact disclaimer: "Please remember that this is for informational purposes only and not a substitute for professional dental advice. For specific concerns, consult with a qualified dentist."

Do not provide specific medical diagnoses or treatment recommendations. Focus on general dental education and oral health information.`;

    // Build the messages array for OpenAI API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...trimConversationHistory(messages, 8) // Limit to recent 8 messages to stay within token limits
    ];

    console.log('DEMO: Sending to OpenAI with messages:', apiMessages.length);

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('DEMO: OpenAI API error:', openAIResponse.status, errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const data = await openAIResponse.json();
    const response = data.choices[0].message.content;

    console.log('DEMO: OpenAI response received, length:', response.length);

    // Store the chat message in the database for tracking
    try {
      await supabase
        .from('chat_messages')
        .insert({
          clinic_id: clinicId,
          message_content: message,
          response_content: response
        });
    } catch (error) {
      console.error('DEMO: Error storing chat message:', error);
      // Don't fail the request if we can't store the message
    }

    return new Response(
      JSON.stringify({ response }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in demo-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
