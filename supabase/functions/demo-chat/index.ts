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
- Address: 1010 Main St., City, State, Zip (let patients know we're happy to provide directions if needed)
- Website: dentaloffice.com
- Hours: Monday-Friday 8am-5pm, Saturday 9am-2pm
- Insurance: Delta Dental, Cigna, Aetna, MetLife, Guardian, United Healthcare, BlueCross BlueShield, Humana, and most PPO plans
- Parking: Free parking in building lot
- New Patients: Forms available at dentaloffice.com/new-patients
- Established: 2008 (over 18 years serving the community)

DENTISTS & TEAM:
- Dr. Sarah Mitchell, DDS (Lead Dentist & Owner): Graduated from UCLA School of Dentistry in 2005. Specializes in cosmetic dentistry and Invisalign. Over 21 years of experience. Known for her gentle approach and passion for patient education.
- Dr. James Park, DMD: Graduated from Tufts University School of Dental Medicine in 2012. Focuses on restorative dentistry and implants. Fluent in Korean and English.
- Dr. Emily Chen, DDS: Graduated from University of the Pacific in 2018. Specializes in pediatric dentistry and is great with kids and nervous patients.
- The team also includes 4 registered dental hygienists and friendly front office staff.

SERVICES:
- General: Cleanings, exams, fillings, extractions, root canals
- Cosmetic: Teeth whitening, veneers, bonding, smile makeovers
- Restorative: Crowns, bridges, dental implants, dentures
- Orthodontics: Invisalign, clear aligners
- Emergency: Same-day appointments available for dental emergencies
- Sedation: Nitrous oxide (laughing gas) and oral sedation available for anxious patients

SCHEDULING BEHAVIOR - CRITICAL:
When a patient asks about scheduling or availability, ALWAYS proactively suggest 2-3 specific time slots. For example:
- "We have openings on Tuesday at 9:00 AM, 11:30 AM, or 2:00 PM."
- "I can see availability tomorrow at 10:00 AM or Thursday at 3:30 PM."
Make up realistic times based on office hours (Mon-Fri 8am-5pm, Sat 9am-2pm). Be specific and helpful.

Medical guidance rules:
- You may mention common possibilities or general causes.
- Use soft language such as "can sometimes be caused by" or "one possibility is".
- Do NOT diagnose, prescribe, or recommend treatments.
- Always encourage an exam for confirmation.

Style rules:
- Limit the main answer to 2–3 short sentences.
- Be friendly, reassuring, and professional.
- Do not use dental jargon unless unavoidable.
- If a question requires certainty, defer to the dental team.

CRITICAL - EVERY response MUST end with this contact block on new lines:
"Give us a call at (555) 555-5555 or book online at dentaloffice.com — we'd love to see you!"

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
