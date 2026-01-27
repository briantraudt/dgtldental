import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  email: string;
  question: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, question }: ContactRequest = await req.json();

    // Validate required fields
    if (!email || !question) {
      throw new Error("Email and question are required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }

    console.log("Sending contact form email from:", email);

    const emailResponse = await resend.emails.send({
      from: "DGTL Dental <noreply@goodbusinesshq.com>",
      to: ["brian@goodbusinesshq.com"],
      subject: `Contact Form: ${email}`,
      reply_to: email,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 24px;">
          <h2 style="color: #323c5a; font-size: 20px; font-weight: 600; margin: 0 0 24px 0; border-bottom: 2px solid #323c5a; padding-bottom: 12px;">
            Contact Form
          </h2>
          
          <div style="color: #323c5a; margin-bottom: 24px;">
            <div style="margin-bottom: 16px;">
              <span style="font-weight: 600; display: inline-block; width: 60px;">From</span>
              <a href="mailto:${email}" style="color: #323c5a;">${email}</a>
            </div>
          </div>
          
          <div style="background: #f8f9fa; border-radius: 8px; padding: 16px; color: #323c5a;">
            <p style="margin: 0; white-space: pre-wrap;">${question.replace(/\n/g, '<br />')}</p>
          </div>
          
          <p style="color: #6b7280; font-size: 13px; margin-top: 32px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            Via DGTL Dental contact form
          </p>
        </div>
      `,
    });

    console.log("Contact email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-contact function:", error);
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
