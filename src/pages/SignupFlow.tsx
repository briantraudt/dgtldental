
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Check, CreditCard, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { AccountInfo, PracticeDetails } from '@/types/signupTypes';
import { generateClinicId, formatOfficeHours, isStep1Valid, isStep2Valid } from '@/utils/signupUtils';
import SignupStepIndicator from '@/components/signup/SignupStepIndicator';
import HowItWorksSection from '@/components/signup/HowItWorksSection';
import AccountInfoStep from '@/components/signup/AccountInfoStep';
import PracticeDetailsStep from '@/components/signup/PracticeDetailsStep';
import PaymentSummaryStep from '@/components/signup/PaymentSummaryStep';

const SignupFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    practiceWebsite: '',
    password: '',
    howDidYouHear: ''
  });

  const [practiceDetails, setPracticeDetails] = useState<PracticeDetails>({
    practiceName: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    practicePhone: '',
    officeEmail: '',
    officeHours: {},
    servicesOffered: [],
    insuranceAccepted: '',
    emergencyPolicy: '',
    practiceDescription: '',
    needInstallHelp: false
  });

  const updateAccountInfo = (field: keyof AccountInfo, value: string) => {
    setAccountInfo(prev => ({ ...prev, [field]: value }));
  };

  const updatePracticeDetails = (field: keyof PracticeDetails, value: any) => {
    setPracticeDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
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

      toast({
        title: "Practice registered successfully!",
        description: "Redirecting to secure payment..."
      });

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }

    } catch (error) {
      console.error('Error processing signup:', error);
      toast({
        title: "Signup failed",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = (step: number) => {
    if (step === 1) return "Account Information";
    if (step === 2) return "Practice Details";
    return "Payment & Setup";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>

        {/* Enhanced How It Works Section - Only show on step 1 */}
        {currentStep === 1 && <HowItWorksSection />}

        {/* Signup Form Section - Single Column Layout */}
        <div id="signup-section" className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <SignupStepIndicator currentStep={currentStep} />
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Step {currentStep} of 3: {getStepTitle(currentStep)}
            </h1>
            {/* Enhanced subheadline */}
            {currentStep === 1 && (
              <div className="space-y-2">
                <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">
                  Get started in minutes. No tech skills needed, no long-term contracts.
                </p>
              </div>
            )}
            {currentStep === 2 && (
              <p className="text-gray-600 mt-2">
                Tell us about your dental practice
              </p>
            )}
            {currentStep === 3 && (
              <p className="text-gray-600 mt-2">
                Complete your subscription
              </p>
            )}
          </div>

          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                {/* Friendly branding element */}
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span>{getStepTitle(currentStep)}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Account Information */}
              {currentStep === 1 && (
                <AccountInfoStep 
                  accountInfo={accountInfo}
                  updateAccountInfo={updateAccountInfo}
                />
              )}

              {/* Step 2: Practice Details */}
              {currentStep === 2 && (
                <PracticeDetailsStep 
                  practiceDetails={practiceDetails}
                  updatePracticeDetails={updatePracticeDetails}
                />
              )}

              {/* Step 3: Payment Summary */}
              {currentStep === 3 && (
                <PaymentSummaryStep practiceDetails={practiceDetails} />
              )}

              {/* Enhanced Navigation Buttons */}
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline"
                  onClick={currentStep === 1 ? () => navigate('/') : handleBack}
                  className="transition-all duration-200 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {currentStep === 1 ? 'Cancel' : 'Back'}
                </Button>
                
                {currentStep < 3 ? (
                  <Button 
                    onClick={handleNext}
                    disabled={currentStep === 1 ? !isStep1Valid(accountInfo) : !isStep2Valid(practiceDetails)}
                    className={`bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
                      (currentStep === 1 ? isStep1Valid(accountInfo) : isStep2Valid(practiceDetails)) 
                        ? 'hover:scale-105 shadow-lg' 
                        : ''
                    }`}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                    {(currentStep === 1 ? isStep1Valid(accountInfo) : isStep2Valid(practiceDetails)) && (
                      <Check className="h-4 w-4 ml-1" />
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    {isLoading ? 'Processing...' : 'Complete Payment'}
                    <CreditCard className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
