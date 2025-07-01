
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AccountInfo, PracticeDetails } from '@/types/signupTypes';
import { generateClinicId, formatOfficeHours } from '@/utils/signupUtils';

export const useSignupPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (accountInfo: AccountInfo, practiceDetails: PracticeDetails) => {
    console.log('=== PAYMENT PROCESS STARTED ===');
    console.log('Account Info:', JSON.stringify(accountInfo, null, 2));
    console.log('Practice Details:', JSON.stringify(practiceDetails, null, 2));
    
    setIsLoading(true);
    
    try {
      // Generate unique clinic ID
      const clinicId = generateClinicId(practiceDetails.practiceName);
      console.log('Generated Clinic ID:', clinicId);
      
      // Format office hours for storage
      const formattedOfficeHours = formatOfficeHours(practiceDetails.officeHours);
      console.log('Formatted Office Hours:', formattedOfficeHours);
      
      // Insert clinic data
      console.log('Inserting clinic data...');
      const { error: clinicError } = await supabase
        .from('clinics')
        .insert({
          clinic_id: clinicId,
          name: practiceDetails.practiceName,
          address: `${practiceDetails.streetAddress}, ${practiceDetails.city}, ${practiceDetails.state} ${practiceDetails.zip}`,
          phone: practiceDetails.practicePhone,
          email: practiceDetails.officeEmail,
          website_url: accountInfo.practiceWebsite,
          office_hours: formattedOfficeHours,
          services_offered: practiceDetails.servicesOffered,
          insurance_accepted: practiceDetails.insuranceAccepted.split(',').map(s => s.trim()),
          emergency_instructions: practiceDetails.emergencyPolicy,
          subscription_status: 'pending'
        });

      if (clinicError) {
        console.error('Clinic insertion error:', clinicError);
        throw new Error(`Database error: ${clinicError.message}`);
      }

      console.log('✅ Clinic data inserted successfully');

      // Create Stripe checkout session with proper data structure
      const checkoutData = {
        clinicId,
        accountInfo: {
          ...accountInfo,
          firstName: accountInfo.firstName?.trim() || '',
          lastName: accountInfo.lastName?.trim() || '',
          email: accountInfo.email?.trim() || ''
        },
        practiceDetails: {
          ...practiceDetails,
          practiceName: practiceDetails.practiceName?.trim() || '',
          officeHours: formattedOfficeHours
        },
        needInstallHelp: practiceDetails.needInstallHelp || false
      };

      console.log('=== CREATING STRIPE CHECKOUT ===');
      console.log('Checkout data being sent:', JSON.stringify(checkoutData, null, 2));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: checkoutData
      });

      console.log('Stripe function response:', { data, error });

      if (error) {
        console.error('❌ Checkout creation error:', error);
        throw new Error(`Checkout error: ${error.message || 'Unknown error'}`);
      }

      if (!data) {
        console.error('❌ No data received from checkout function');
        throw new Error('No response received from payment service');
      }

      console.log('Raw checkout response:', data);

      if (!data.url) {
        console.error('❌ No checkout URL in response:', data);
        throw new Error('No checkout URL received from payment service');
      }

      // Enhanced URL validation and debugging
      const checkoutUrl = data.url;
      console.log('=== CHECKOUT URL ANALYSIS ===');
      console.log('Checkout URL received:', checkoutUrl);
      console.log('URL length:', checkoutUrl.length);
      console.log('Test mode:', data.testMode);
      console.log('Session ID:', data.sessionId);
      
      // More comprehensive URL validation
      const isValidStripeUrl = checkoutUrl.startsWith('https://checkout.stripe.com/');
      const hasSessionId = checkoutUrl.includes('cs_');
      
      console.log('URL validation:', {
        isValidStripeUrl,
        hasSessionId,
        urlType: checkoutUrl.includes('/c/pay/') ? 'checkout_session' : 'unknown'
      });
      
      if (!isValidStripeUrl) {
        console.error('❌ Invalid checkout URL format:', checkoutUrl);
        throw new Error('Invalid checkout URL format received from payment service');
      }

      if (!hasSessionId) {
        console.error('❌ No session ID found in URL:', checkoutUrl);
        throw new Error('Invalid checkout session URL - missing session ID');
      }

      console.log('✅ Valid Stripe checkout URL received');

      toast({
        title: "Practice registered successfully!",
        description: data.testMode ? "Redirecting to test payment..." : "Redirecting to secure payment..."
      });

      // Simple, direct redirect to Stripe checkout
      console.log('=== REDIRECT PROCESS ===');
      console.log('🔄 Redirecting to Stripe checkout:', checkoutUrl);
      
      // Use simple redirect without delays or fallbacks that might cause issues
      window.location.href = checkoutUrl;

    } catch (error) {
      console.error('💥 Error processing signup:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        console.log('Error type:', error.constructor.name);
        console.log('Error message:', error.message);
        
        if (error.message.includes('STRIPE_SECRET_KEY')) {
          errorMessage = "Payment system configuration error. Please contact support.";
        } else if (error.message.includes('No checkout URL')) {
          errorMessage = "Failed to create payment session. Please try again.";
        } else if (error.message.includes('Invalid checkout URL')) {
          errorMessage = "Payment system returned invalid URL. Please contact support.";
        } else if (error.message.includes('Database error')) {
          errorMessage = "Failed to save practice information. Please try again.";
        } else if (error.message.includes('Checkout error')) {
          errorMessage = `Payment service error: ${error.message.replace('Checkout error: ', '')}`;
        } else if (error.message.includes('Missing Supabase environment variables')) {
          errorMessage = "System configuration error. Please contact support.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('=== PAYMENT PROCESS ENDED ===');
    }
  };

  return { handlePayment, isLoading };
};
