import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    if (!message) {
      throw new Error("Message is required");
    }

    console.log("Demo chat request received:", message);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are a friendly, helpful dental office assistant chatbot for Smile Dental Care. You help answer patient questions about dental care, appointments, and office info.

OFFICE INFO:
- Phone: (555) 555-5555
- Address: 123 Main Street, Suite 100, Anytown, USA
- Website: dentaloffice.com
- Hours: Monday-Friday 8am-5pm, Saturday 9am-2pm

RULES:
- Be warm, professional, and thorough (2-4 sentences for the main answer)
- Provide helpful information and context
- Never diagnose - encourage scheduling a visit for specific concerns
- DO NOT mention this is a demo or that it would be customized - respond naturally as the real office assistant

RESPONSE FORMAT (MUST FOLLOW EXACTLY):
1. Answer their question in 2-4 sentences
2. ALWAYS end with a personalized call-to-action paragraph that relates to their specific question. Make it feel natural and relevant to what they asked about.

EXAMPLES OF PERSONALIZED CLOSINGS:
- If they ask about cavities: "If you think you might have a cavity or would like to get it checked out, give us a call at (555) 555-5555 or book online at dentaloffice.com."
- If they ask about pain: "If you're experiencing dental pain, we'd love to help you feel better. Call us at (555) 555-5555 or schedule online at dentaloffice.com."
- If they ask about cleanings: "Ready to schedule your next cleaning? Call us at (555) 555-5555 or book online at dentaloffice.com."
- If they ask about whitening: "If you'd like to explore teeth whitening options, we'd be happy to discuss them with you. Call (555) 555-5555 or visit dentaloffice.com."

Always include the phone number and website in the closing. Make the closing a separate paragraph.`
          },
          { role: "user", content: message }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "Failed to get AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Streaming response back to client");
    
    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Demo chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
