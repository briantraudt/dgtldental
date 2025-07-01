
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AccountInfo, PracticeDetails } from '@/types/signupTypes';
import { generateClinicId, formatOfficeHours } from '@/utils/signupUtils';

export const useSignupPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (accountInfo: AccountInfo, practiceDetails: PracticeDetails) => {
    setIsLoading(true);
    
    try {
      // Generate unique clinic ID
      const clinicId = generateClinicId(practiceDetails.practiceName);
      
      // Format office hours for storage
      const formattedOfficeHours = formatOfficeHours(practiceDetails.officeHours);
      
      // Insert clinic data
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
        throw clinicError;
      }

      console.log('Clinic data inserted successfully');

      // Create Stripe checkout session with proper data structure
      const checkoutData = {
        clinicId,
        accountInfo,
        practiceDetails: {
          ...practiceDetails,
          practiceName: practiceDetails.practiceName,
          officeHours: formattedOfficeHours
        },
        needInstallHelp: practiceDetails.needInstallHelp
      };

      console.log('Sending checkout data:', checkoutData);

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: checkoutData
      });

      if (error) {
        console.error('Checkout creation error:', error);
        throw error;
      }

      console.log('Checkout session created:', data);

      if (!data?.url) {
        throw new Error('No checkout URL received from server');
      }

      // Validate the URL format
      if (!data.url.startsWith('https://checkout.stripe.com/')) {
        throw new Error('Invalid checkout URL format received');
      }

      toast({
        title: "Practice registered successfully!",
        description: "Redirecting to secure payment..."
      });

      // Small delay to show the toast, then redirect
      setTimeout(() => {
        console.log('Redirecting to:', data.url);
        // Use window.location.href for a proper redirect
        window.location.href = data.url;
      }, 1500);

    } catch (error) {
      console.error('Error processing signup:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('STRIPE_SECRET_KEY')) {
          errorMessage = "Payment system configuration error. Please contact support.";
        } else if (error.message.includes('No checkout URL')) {
          errorMessage = "Failed to create payment session. Please try again.";
        } else if (error.message.includes('Invalid checkout URL')) {
          errorMessage = "Payment system returned invalid URL. Please contact support.";
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
    }
  };

  return { handlePayment, isLoading };
};
