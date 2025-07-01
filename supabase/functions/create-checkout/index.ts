
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

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
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    logStep("🔧 Environment variables check", {
      hasStripeKey: !!stripeKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      stripeKeyPrefix: stripeKey ? stripeKey.substring(0, 8) + "..." : "missing"
    });

    if (!stripeKey) {
      logStep("❌ STRIPE_SECRET_KEY not found in environment");
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      logStep("❌ Supabase credentials missing");
      throw new Error("Missing Supabase environment variables");
    }

    const requestData = await req.json();
    logStep("📥 Request data received", { 
      hasClinicId: !!requestData.clinicId,
      hasAccountInfo: !!requestData.accountInfo,
      hasPracticeDetails: !!requestData.practiceDetails,
      needInstallHelp: requestData.needInstallHelp
    });

    // Extract data from the signup flow structure
    const clinicId = requestData.clinicId;
    const clinicName = requestData.practiceDetails?.practiceName;
    const email = requestData.accountInfo?.email;
    const firstName = requestData.accountInfo?.firstName || '';
    const lastName = requestData.accountInfo?.lastName || '';
    const needInstallHelp = requestData.needInstallHelp || false;

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
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
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
        name: `${firstName} ${lastName}`.trim() || email,
        metadata: {
          clinic_id: clinicId,
          clinic_name: clinicName
        }
      });
      customerId = customer.id;
      logStep("✅ New customer created", { customerId });
    }

    // Prepare line items - monthly subscription ($10/month)
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

    // Add setup fee if needed ($100 installation)
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
      logStep("💰 Installation service added to line items");
    }

    logStep("📋 Line items prepared", { 
      itemCount: lineItems.length, 
      hasInstallation: needInstallHelp,
      monthlyAmount: 1000,
      installationAmount: needInstallHelp ? 10000 : 0
    });

    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("🌐 Origin determined", { origin });
    
    // Create checkout session with enhanced logging
    const sessionConfig = {
      customer: customerId,
      line_items: lineItems,
      mode: "subscription" as const,
      success_url: `${origin}/success?clinic_id=${clinicId}&clinic_name=${encodeURIComponent(clinicName)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup-flow?step=3`,
      metadata: {
        clinic_id: clinicId,
        clinic_name: clinicName,
        needs_install_help: needInstallHelp.toString()
      },
      payment_method_types: ["card"],
      billing_address_collection: "required",
    };

    logStep("⚙️ Creating checkout session", { 
      customerId, 
      mode: sessionConfig.mode,
      successUrl: sessionConfig.success_url,
      cancelUrl: sessionConfig.cancel_url,
      lineItemsCount: lineItems.length
    });

    const session = await stripe.checkout.sessions.create(sessionConfig);

    logStep("🎉 Checkout session created successfully", { 
      sessionId: session.id, 
      hasUrl: !!session.url,
      urlLength: session.url?.length,
      urlPrefix: session.url?.substring(0, 50) + '...',
      sessionMode: session.mode,
      customerId: session.customer
    });

    if (!session.url) {
      logStep("❌ Stripe did not return a checkout URL");
      throw new Error("Stripe did not return a checkout URL");
    }

    // Enhanced URL validation
    const isValidStripeUrl = session.url.startsWith('https://checkout.stripe.com/') || 
                            session.url.startsWith('https://checkout.stripe.com/pay/');
    
    if (!isValidStripeUrl) {
      logStep("⚠️ Unexpected URL format", { url: session.url });
      // Don't throw error for test URLs, just log warning
    }

    logStep("🔗 Returning checkout URL", { 
      sessionId: session.id,
      redirectUrl: session.url,
      isTestMode: stripeKey.startsWith('sk_test_')
    });

    return new Response(JSON.stringify({ 
      url: session.url, 
      sessionId: session.id,
      testMode: stripeKey.startsWith('sk_test_')
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
