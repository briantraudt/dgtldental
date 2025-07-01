
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

      // Create Stripe checkout session with minimal data structure
      const checkoutData = {
        clinicId,
        accountInfo: {
          firstName: accountInfo.firstName?.trim() || '',
          lastName: accountInfo.lastName?.trim() || '',
          email: accountInfo.email?.trim() || ''
        },
        practiceDetails: {
          practiceName: practiceDetails.practiceName?.trim() || '',
          needInstallHelp: practiceDetails.needInstallHelp || false
        }
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

      if (!data || !data.url) {
        console.error('❌ No checkout URL received:', data);
        throw new Error('No checkout URL received from payment service');
      }

      console.log('✅ Valid Stripe checkout URL received:', data.url);

      toast({
        title: "Redirecting to checkout...",
        description: "Taking you to secure payment page..."
      });

      console.log('🔄 Redirecting to Stripe checkout:', data.url);
      
      // Use a more reliable redirect method - open in same window after a brief delay
      setTimeout(() => {
        window.open(data.url, '_self');
      }, 500);

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
        } else if (error.message.includes('Database error')) {
          errorMessage = "Failed to save practice information. Please try again.";
        } else if (error.message.includes('Checkout error')) {
          errorMessage = `Payment service error: ${error.message.replace('Checkout error: ', '')}`;
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
