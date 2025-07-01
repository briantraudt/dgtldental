
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
      const clinicId = generateClinicId(practiceDetails.practiceName);
      console.log('Generated Clinic ID:', clinicId);
      
      const formattedOfficeHours = formatOfficeHours(practiceDetails.officeHours);
      console.log('Formatted Office Hours:', formattedOfficeHours);
      
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

      // Use a proper email address for testing - if the email field is just "test", use a test email
      const checkoutEmail = accountInfo.email.includes('@') ? accountInfo.email : 'test@example.com';

      const checkoutData = {
        email: checkoutEmail,
        clinicName: practiceDetails.practiceName.trim(),
        clinicId: clinicId,
        needInstallation: practiceDetails.needInstallHelp || false
      };

      console.log('=== CREATING STRIPE CHECKOUT ===');
      console.log('Checkout data being sent:', JSON.stringify(checkoutData, null, 2));

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: checkoutData
      });

      console.log('Raw Stripe function response:', { data, error });

      if (error) {
        console.error('❌ Checkout creation error details:', error);
        throw new Error(`Checkout error: ${error.message || JSON.stringify(error)}`);
      }

      if (!data) {
        console.error('❌ No data received from function');
        throw new Error('No response received from payment service');
      }

      console.log('Stripe response data:', JSON.stringify(data, null, 2));

      if (!data.url) {
        console.error('❌ No checkout URL in response:', data);
        throw new Error('No checkout URL received from payment service');
      }

      // Validate the URL format
      try {
        const url = new URL(data.url);
        console.log('✅ Valid URL format:', url.toString());
        
        if (!url.hostname.includes('checkout.stripe.com')) {
          console.error('❌ Invalid Stripe URL:', url.hostname);
          throw new Error('Received invalid Stripe checkout URL');
        }
      } catch (urlError) {
        console.error('❌ Invalid URL format:', data.url, urlError);
        throw new Error('Received malformed checkout URL');
      }

      console.log('✅ Valid Stripe checkout URL received:', data.url);

      toast({
        title: "Redirecting to checkout...",
        description: "Taking you to secure payment page..."
      });

      console.log('🔄 Redirecting to Stripe checkout...');
      console.log('Current window location:', window.location.href);
      console.log('Target URL:', data.url);
      
      // Direct redirect - most reliable method
      window.location.href = data.url;

    } catch (error) {
      console.error('💥 Error processing signup:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        console.log('Error type:', error.constructor.name);
        console.log('Error message:', error.message);
        console.log('Error stack:', error.stack);
        
        if (error.message.includes('STRIPE_SECRET_KEY')) {
          errorMessage = "Payment system configuration error. Please contact support.";
        } else if (error.message.includes('No checkout URL')) {
          errorMessage = "Failed to create payment session. Please try again.";
        } else if (error.message.includes('Database error')) {
          errorMessage = "Failed to save practice information. Please try again.";
        } else if (error.message.includes('Checkout error')) {
          errorMessage = `Payment service error: ${error.message.replace('Checkout error: ', '')}`;
        } else if (error.message.includes('Invalid') || error.message.includes('malformed')) {
          errorMessage = "Payment service returned invalid response. Please try again.";
        } else if (error.message.includes('Please enter a valid email')) {
          errorMessage = "Please enter a valid email address in the account information step.";
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
