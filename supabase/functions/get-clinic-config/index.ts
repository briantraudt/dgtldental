
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const clinicId = url.searchParams.get('clientId') || url.searchParams.get('clinic');
    
    if (!clinicId) {
      throw new Error('Client ID is required');
    }

    console.log('Fetching config for clinic:', clinicId);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Handle demo clinic with fallback config
    if (clinicId === 'demo-clinic-123') {
      const demoConfig = {
        clinic_id: 'demo-clinic-123',
        name: 'Demo Dental Practice',
        address: '123 Main St, Anytown, USA 12345',
        phone: '(555) 123-4567',
        office_hours: 'Monday-Friday: 8AM-6PM, Saturday: 9AM-2PM',
        services_offered: ['General Dentistry', 'Cosmetic Dentistry', 'Orthodontics', 'Oral Surgery'],
        insurance_accepted: ['Delta Dental', 'BlueCross BlueShield', 'Cigna', 'Aetna'],
        emergency_instructions: 'For dental emergencies after hours, please call our main number and follow the prompts.',
        widget_config: {
          primaryColor: '#2563eb',
          theme: 'light',
          position: 'bottom-right',
          greeting: 'Hi! How can I help you with your dental care today?'
        }
      };

      console.log('Returning demo config');
      return new Response(
        JSON.stringify(demoConfig),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch clinic configuration from database
    const { data: clinic, error: clinicError } = await supabase
      .from('clinics')
      .select('*')
      .eq('clinic_id', clinicId)
      .single();

    if (clinicError) {
      console.error('Error fetching clinic:', clinicError);
      
      // Return fallback config if clinic not found
      if (clinicError.code === 'PGRST116') {
        const fallbackConfig = {
          clinic_id: clinicId,
          name: 'Dental Practice',
          address: 'Please contact us for location details',
          phone: 'Please call for appointments',
          office_hours: 'Please contact us for hours',
          services_offered: ['General Dentistry'],
          insurance_accepted: ['Please call to verify insurance'],
          emergency_instructions: 'Please call our main number for emergencies.',
          widget_config: {
            primaryColor: '#2563eb',
            theme: 'light',
            position: 'bottom-right',
            greeting: 'Hi! How can I help you today?'
          }
        };

        return new Response(
          JSON.stringify(fallbackConfig),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }
      
      throw clinicError;
    }

    if (!clinic) {
      throw new Error('Clinic not found');
    }

    // Add default widget config if not present
    const clinicConfig = {
      ...clinic,
      widget_config: {
        primaryColor: '#2563eb',
        theme: 'light',
        position: 'bottom-right',
        greeting: `Hi! How can I help you with your visit to ${clinic.name}?`,
        ...clinic.widget_config
      }
    };

    console.log('Returning clinic config for:', clinic.name);

    return new Response(
      JSON.stringify(clinicConfig),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in get-clinic-config function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
