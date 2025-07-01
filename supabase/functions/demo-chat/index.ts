import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { message, messages = [] } = await req.json();
    
    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Received request with message:', message);
    console.log('Conversation history length:', messages.length);

    // Generate system prompt for dental demo
    const systemPrompt = `You are a helpful dental AI assistant for a demo dental practice. 

This is a DEMO to showcase AI chat capabilities for dental websites. You should:

- Provide helpful, accurate information about dental care and oral health
- Answer questions about common dental procedures, treatments, and oral hygiene
- Give general advice about dental health and preventive care
- Be friendly, professional, and supportive
- Always remind users that this is general information and they should consult a qualified dentist for specific medical advice
- For urgent dental issues, advise patients to contact their dentist immediately
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

    console.log('Sending to OpenAI with messages:', apiMessages.length);

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
      console.error('OpenAI API error:', openAIResponse.status, errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const data = await openAIResponse.json();
    const response = data.choices[0].message.content;

    console.log('OpenAI response received, length:', response.length);

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
