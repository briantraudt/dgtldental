
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const requestData = await req.json();
    logStep("Request data received", requestData);

    // Support both old and new data structures
    let clinicId, clinicName, email, needInstallHelp = false;
    
    if (requestData.accountInfo && requestData.practiceDetails) {
      // New signup flow structure
      clinicId = requestData.clinicId;
      clinicName = requestData.practiceDetails.practiceName;
      email = requestData.accountInfo.email;
      needInstallHelp = requestData.needInstallHelp || false;
    } else {
      // Old structure
      clinicId = requestData.clinicId;
      clinicName = requestData.clinicName;
      email = requestData.email;
    }

    if (!clinicId || !clinicName || !email) {
      throw new Error("Missing required fields: clinicId, clinicName, or email");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // Check if customer already exists
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Existing customer found", { customerId });
    } else {
      // Create new customer
      const customer = await stripe.customers.create({
        email,
        metadata: {
          clinic_id: clinicId,
          clinic_name: clinicName
        }
      });
      customerId = customer.id;
      logStep("New customer created", { customerId });
    }

    // Prepare line items
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: { 
            name: "DGTL Chat Widget - Premium Plan",
            description: "Unlimited AI chat features for your practice"
          },
          unit_amount: 1000, // $10.00 in cents
          recurring: { interval: "month" },
        },
        quantity: 1,
      }
    ];

    // Add setup fee if needed
    if (needInstallHelp) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: "Widget Installation Service",
            description: "Professional setup and installation of your chat widget"
          },
          unit_amount: 10000, // $100.00 in cents
        },
        quantity: 1,
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: lineItems,
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/success?clinic_id=${clinicId}&clinic_name=${encodeURIComponent(clinicName)}`,
      cancel_url: `${req.headers.get("origin")}/signup-flow`,
      metadata: {
        clinic_id: clinicId,
        clinic_name: clinicName,
        needs_install_help: needInstallHelp.toString()
      }
    });

    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-checkout", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
