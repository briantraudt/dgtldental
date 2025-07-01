
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const timestamp = new Date().toISOString();
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[${timestamp}] [CREATE-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("🚀 Function started");

    // Verify environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    
    logStep("🔧 Environment check", {
      hasStripeKey: !!stripeKey,
      stripeKeyLength: stripeKey ? stripeKey.length : 0,
      stripeKeyPrefix: stripeKey ? stripeKey.substring(0, 7) + "..." : "missing"
    });

    if (!stripeKey) {
      logStep("❌ STRIPE_SECRET_KEY missing");
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const requestData = await req.json();
    logStep("📥 Request received", requestData);

    // Extract and validate required fields
    const { email, clinicName, clinicId, needInstallation } = requestData;

    if (!email || !clinicName || !clinicId) {
      logStep("❌ Missing required fields", { email: !!email, clinicName: !!clinicName, clinicId: !!clinicId });
      throw new Error("Missing required fields: email, clinicName, or clinicId");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logStep("❌ Invalid email format", { email });
      throw new Error("Invalid email format");
    }

    logStep("✅ Input validation passed", { email, clinicName, clinicId, needInstallation });

    // Initialize Stripe
    logStep("🔄 Initializing Stripe");
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16",
      typescript: true
    });
    logStep("✅ Stripe initialized");
    
    // Create or find customer
    logStep("👤 Checking for existing customer", { email });
    const customers = await stripe.customers.list({ 
      email: email.toLowerCase().trim(), 
      limit: 1 
    });
    
    let customer;
    if (customers.data.length > 0) {
      customer = customers.data[0];
      logStep("👤 Found existing customer", { id: customer.id });
    } else {
      logStep("👤 Creating new customer");
      customer = await stripe.customers.create({
        email: email.toLowerCase().trim(),
        name: clinicName
      });
      logStep("✅ Created new customer", { id: customer.id });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("🌐 Origin determined", { origin });
    
    // Create the most basic checkout session
    const lineItems = [
      {
        price_data: {
          currency: "usd",
          product_data: { 
            name: "DGTL Chat Widget - Monthly Subscription",
            description: "AI-powered chat widget for your practice"
          },
          unit_amount: 1000, // $10.00
          recurring: { 
            interval: "month" as const
          },
        },
        quantity: 1,
      }
    ];

    // Add installation service if requested
    if (needInstallation) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: "Professional Installation Service",
            description: "One-time setup and installation assistance"
          },
          unit_amount: 10000, // $100.00
        },
        quantity: 1,
      });
      logStep("💰 Added installation service");
    }

    const sessionData = {
      customer: customer.id,
      line_items: lineItems,
      mode: "subscription" as const,
      success_url: `${origin}/success?clinic_id=${clinicId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup-flow?step=3&error=payment_cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto" as const,
      customer_update: {
        address: "auto" as const,
        name: "auto" as const
      }
    };

    logStep("⚙️ Creating checkout session", { 
      customerId: customer.id, 
      lineItemsCount: lineItems.length,
      successUrl: sessionData.success_url,
      cancelUrl: sessionData.cancel_url
    });

    const session = await stripe.checkout.sessions.create(sessionData);

    logStep("🎉 Checkout session created", { 
      sessionId: session.id, 
      url: session.url,
      mode: session.mode,
      status: session.status,
      paymentStatus: session.payment_status
    });

    if (!session.url) {
      logStep("❌ No URL in session response");
      throw new Error("Stripe checkout session created but no URL returned");
    }

    // Validate the URL
    try {
      const url = new URL(session.url);
      if (!url.hostname.includes('checkout.stripe.com')) {
        throw new Error(`Invalid Stripe URL: ${url.hostname}`);
      }
      logStep("✅ URL validation passed", { hostname: url.hostname });
    } catch (urlError) {
      logStep("❌ URL validation failed", { url: session.url, error: urlError });
      throw new Error("Invalid checkout URL format");
    }

    const response = { 
      url: session.url, 
      sessionId: session.id,
      testMode: stripeKey.startsWith('sk_test_'),
      status: session.status,
      paymentStatus: session.payment_status
    };

    logStep("🚀 Returning successful response", response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logStep("💥 ERROR", { 
      message: errorMessage, 
      stack: errorStack,
      type: error?.constructor?.name 
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? errorStack : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
