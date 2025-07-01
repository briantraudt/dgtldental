
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

    const { email, clinicName, clinicId, needInstallation } = requestData;

    if (!email || !clinicName || !clinicId) {
      logStep("❌ Missing required fields", { email: !!email, clinicName: !!clinicName, clinicId: !!clinicId });
      throw new Error("Missing required fields: email, clinicName, or clinicId");
    }

    logStep("✅ Input validation passed", { email, clinicName, clinicId, needInstallation });

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2023-10-16",
      typescript: true
    });
    logStep("✅ Stripe initialized");
    
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
        name: clinicName,
        metadata: {
          clinic_id: clinicId
        }
      });
      logStep("✅ Created new customer", { id: customer.id });
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    logStep("🌐 Origin determined", { origin });
    
    // Use your actual Stripe price IDs
    const MONTHLY_SUBSCRIPTION_PRICE_ID = "price_1Rg8UYD11m5HbaW36vDyhbco"; // $10/month subscription
    const SETUP_FEE_PRICE_ID = "price_1Rg8XXD11m5HbaW3XPUdef7y"; // $100 setup fee
    
    logStep("💰 Building line items", { needInstallation });
    const line_items = [
      {
        price: MONTHLY_SUBSCRIPTION_PRICE_ID,
        quantity: 1,
      },
    ];

    if (needInstallation) {
      logStep("💰 Adding setup fee to line items");
      line_items.push({
        price: SETUP_FEE_PRICE_ID,
        quantity: 1,
      });
    }

    // Verify prices exist in Stripe
    try {
      const monthlyPrice = await stripe.prices.retrieve(MONTHLY_SUBSCRIPTION_PRICE_ID);
      logStep("✅ Monthly price verified", { 
        id: monthlyPrice.id, 
        amount: monthlyPrice.unit_amount,
        active: monthlyPrice.active 
      });
      
      if (needInstallation) {
        const setupPrice = await stripe.prices.retrieve(SETUP_FEE_PRICE_ID);
        logStep("✅ Setup price verified", { 
          id: setupPrice.id, 
          amount: setupPrice.unit_amount,
          active: setupPrice.active 
        });
      }
    } catch (priceError) {
      logStep("❌ Price verification failed", { error: priceError });
      throw new Error(`Invalid price configuration: ${priceError}`);
    }

    const sessionData = {
      customer: customer.id,
      mode: "subscription" as const,
      line_items: line_items,
      success_url: `${origin}/success?clinic_id=${clinicId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup-flow?step=3&error=payment_cancelled`,
      allow_promotion_codes: false,
      billing_address_collection: "auto" as const,
      payment_method_collection: "always" as const,
      customer_update: {
        address: "auto" as const,
        name: "auto" as const
      },
      payment_method_types: ["card"],
      subscription_data: {
        description: `${clinicName} - DGTL Chat Widget Subscription`,
        metadata: {
          clinic_id: clinicId,
          clinic_name: clinicName
        }
      },
      metadata: {
        clinic_id: clinicId,
        clinic_name: clinicName
      }
    };

    logStep("⚙️ Creating checkout session", { 
      customerId: customer.id, 
      lineItemsCount: line_items.length,
      successUrl: sessionData.success_url,
      cancelUrl: sessionData.cancel_url,
      lineItems: line_items,
      paymentMethodCollection: sessionData.payment_method_collection
    });

    const session = await stripe.checkout.sessions.create(sessionData);

    logStep("🎉 Checkout session created", { 
      sessionId: session.id, 
      url: session.url,
      mode: session.mode,
      status: session.status,
      paymentStatus: session.payment_status,
      customer: session.customer
    });

    if (!session.url) {
      logStep("❌ No URL in session response", { sessionData: session });
      throw new Error("Stripe checkout session created but no URL returned");
    }

    // Test URL validity
    try {
      const urlTest = new URL(session.url);
      logStep("✅ URL validation passed", { protocol: urlTest.protocol, host: urlTest.host });
    } catch (urlError) {
      logStep("❌ Invalid URL format", { url: session.url, error: urlError });
      throw new Error(`Invalid checkout URL format: ${session.url}`);
    }

    const response = { 
      url: session.url, 
      sessionId: session.id,
      testMode: stripeKey.startsWith('sk_test_'),
      status: session.status,
      paymentStatus: session.payment_status,
      customerId: customer.id
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
      stack: errorStack
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
