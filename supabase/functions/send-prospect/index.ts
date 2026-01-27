import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProspectRequest {
  name: string;
  practice: string;
  contactPreference: 'phone' | 'email';
  contactValue: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, practice, contactPreference, contactValue }: ProspectRequest = await req.json();

    // Validate required fields
    if (!name || !practice || !contactPreference || !contactValue) {
      throw new Error("All fields are required");
    }

    console.log("New prospect submission:", { name, practice, contactPreference, contactValue });

    const emailResponse = await resend.emails.send({
      from: "DGTL Dental <noreply@goodbusinesshq.com>",
      to: ["brian@goodbusinesshq.com"],
      subject: `New Prospect: ${practice}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #323c5a; font-size: 20px; font-weight: 600; margin: 0 0 24px 0; border-bottom: 2px solid #323c5a; padding-bottom: 12px;">
            New Prospect
          </h2>
          
          <div style="color: #323c5a;">
            <div style="margin-bottom: 16px;">
              <span style="font-weight: 600; display: inline-block; width: 80px;">Name</span>
              <span>${name}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-weight: 600; display: inline-block; width: 80px;">Practice</span>
              <span>${practice}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-weight: 600; display: inline-block; width: 80px;">Prefers</span>
              <span>${contactPreference === 'phone' ? 'Phone' : 'Email'}</span>
            </div>
            <div style="margin-bottom: 16px;">
              <span style="font-weight: 600; display: inline-block; width: 80px;">Contact</span>
              ${contactPreference === 'phone' 
                ? `<a href="tel:${contactValue}" style="color: #323c5a;">${contactValue}</a>` 
                : `<a href="mailto:${contactValue}" style="color: #323c5a;">${contactValue}</a>`}
            </div>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            Via DGTL Dental landing page
          </p>
        </div>
      `,
    });

    console.log("Prospect notification email sent:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-prospect function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
