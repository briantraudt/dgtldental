
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
    
    logStep("🔧 Environment variables check", {
      hasStripeKey: !!stripeKey,
      stripeKeyPrefix: stripeKey ? stripeKey.substring(0, 8) + "..." : "missing"
    });

    if (!stripeKey) {
      logStep("❌ STRIPE_SECRET_KEY not found in environment");
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    const requestData = await req.json();
    logStep("📥 Request data received", { 
      hasClinicId: !!requestData.clinicId,
      hasAccountInfo: !!requestData.accountInfo,
      hasPracticeDetails: !!requestData.practiceDetails
    });

    // Extract data from the signup flow structure
    const clinicId = requestData.clinicId;
    const clinicName = requestData.practiceDetails?.practiceName;
    const email = requestData.accountInfo?.email;
    const firstName = requestData.accountInfo?.firstName || '';
    const lastName = requestData.accountInfo?.lastName || '';
    const needInstallHelp = requestData.practiceDetails?.needInstallHelp || false;

    logStep("📋 Extracted data", { 
      clinicId, 
      clinicName, 
      email, 
      firstName,
      lastName,
      needInstallHelp 
    });

    if (!clinicId || !clinicName || !email) {
      logStep("❌ Missing required fields", { clinicId, clinicName, email });
      throw new Error("Missing required fields: clinicId, clinicName, or email");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logStep("❌ Invalid email format", { email });
      throw new Error("Invalid email format provided");
    }

    // Initialize Stripe with enhanced logging
    logStep("🔄 Initializing Stripe client");
    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16"
    });
    logStep("✅ Stripe client initialized successfully");
    
    // Check if customer already exists
    logStep("🔍 Checking for existing customer", { email });
    const customers = await stripe.customers.list({ 
      email: email.toLowerCase().trim(), 
      limit: 1 
    });
    
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("👤 Existing customer found", { customerId });
    } else {
      // Create new customer
      logStep("👤 Creating new customer", { email, firstName, lastName });
      const customer = await stripe.customers.create({
        email: email.toLowerCase().trim(),
        name: `${firstName} ${lastName}`.trim() || email
      });
      customerId = customer.id;
      logStep("✅ New customer created", { customerId });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("🌐 Origin determined", { origin });
    
    // Create the most basic checkout session possible
    const sessionConfig = {
      customer: customerId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "DGTL Chat Widget - Premium Plan"
            },
            unit_amount: 1000, // $10.00 in cents
            recurring: { interval: "month" },
          },
          quantity: 1,
        }
      ],
      mode: "subscription" as const,
      success_url: `${origin}/success?clinic_id=${clinicId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup-flow?step=3`
    };

    // Add setup fee if needed ($100 installation)
    if (needInstallHelp) {
      sessionConfig.line_items.push({
        price_data: {
          currency: "usd",
          product_data: { 
            name: "Widget Installation Service"
          },
          unit_amount: 10000, // $100.00 in cents
        },
        quantity: 1,
      });
      logStep("💰 Installation service added to line items");
    }

    logStep("⚙️ Creating checkout session", { 
      customerId, 
      mode: sessionConfig.mode,
      successUrl: sessionConfig.success_url,
      cancelUrl: sessionConfig.cancel_url,
      lineItemsCount: sessionConfig.line_items.length
    });

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("🎉 Checkout session created successfully", { 
      sessionId: session.id, 
      hasUrl: !!session.url,
      url: session.url,
      sessionMode: session.mode,
      customerId: session.customer,
      paymentStatus: session.payment_status,
      status: session.status
    });

    if (!session.url) {
      logStep("❌ Stripe did not return a checkout URL");
      throw new Error("Stripe did not return a checkout URL");
    }

    logStep("🔗 Returning checkout URL", { 
      sessionId: session.id,
      redirectUrl: session.url,
      isTestMode: stripeKey.startsWith('sk_test_'),
      paymentStatus: session.payment_status
    });

    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      testMode: stripeKey.startsWith('sk_test_'),
      paymentStatus: session.payment_status,
      status: session.status
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    logStep("💥 ERROR in create-checkout", { 
      message: errorMessage, 
      stack: errorStack,
      errorType: error?.constructor?.name 
    });
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: errorStack,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
