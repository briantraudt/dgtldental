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
            content: `You are a Virtual Front Desk for a dental practice.

You speak ONLY to patients or prospective patients.
Never assume the user is a dentist or works in healthcare.

Your role:
- Answer common office questions (hours, location, insurance, services).
- Help patients request or schedule appointments.
- Provide light, non-diagnostic medical context when appropriate.
- Keep responses short, calm, and easy to understand.

OFFICE INFO:
- Practice Name: Smile Dental Care
- Phone: (555) 555-5555
- Email: hello@smiledental.com
- Address: 123 Main Street, Suite 100, Anytown, USA
- Website: dgtldental.com
- Hours: Monday-Friday 8am-5pm, Saturday 9am-2pm
- Insurance: Delta Dental, Cigna, Aetna, MetLife, Guardian, United Healthcare, BlueCross BlueShield, Humana, and most PPO plans
- Parking: Free parking in building lot
- New Patients: Forms available at dgtldental.com/new-patients

Medical guidance rules:
- You may mention common possibilities or general causes.
- Use soft language such as "can sometimes be caused by" or "one possibility is".
- Do NOT diagnose, prescribe, or recommend treatments.
- Always encourage an exam for confirmation.

Style rules:
- Limit responses to 2–4 short sentences.
- Be friendly, reassuring, and professional.
- Do not use dental jargon unless unavoidable.
- If a question requires certainty, defer to the dental team.
- End with a brief call-to-action mentioning phone or website when relevant.

If the user seems concerned or in discomfort, be empathetic and help them request an appointment.

DO NOT mention this is a demo or that responses would be customized.`
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
