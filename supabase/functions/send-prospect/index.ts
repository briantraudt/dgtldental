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
      from: "DGTL Dental <onboarding@resend.dev>",
      to: ["brian@goodbusinesshq.com"],
      subject: `🦷 New Prospect: ${practice}`,
      html: `
        <h2>New DGTL Dental Prospect!</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Name:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Practice:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${practice}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Prefers:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${contactPreference === 'phone' ? 'Phone' : 'Email'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">${contactPreference === 'phone' ? 'Phone' : 'Email'}:</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">
              ${contactPreference === 'phone' 
                ? `<a href="tel:${contactValue}">${contactValue}</a>` 
                : `<a href="mailto:${contactValue}">${contactValue}</a>`}
            </td>
          </tr>
        </table>
        <p style="margin-top: 20px; color: #666;">This prospect came through the DGTL Dental landing page guided chat.</p>
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
