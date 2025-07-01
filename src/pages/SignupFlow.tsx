
import { useSignupForm } from '@/hooks/useSignupForm';
import { useSignupPayment } from '@/hooks/useSignupPayment';
import HowItWorksSection from '@/components/signup/HowItWorksSection';
import SignupHeader from '@/components/signup/SignupHeader';
import SignupFormCard from '@/components/signup/SignupFormCard';

const SignupFlow = () => {
  const {
    currentStep,
    accountInfo,
    practiceDetails,
    updateAccountInfo,
    updatePracticeDetails,
    handleNext,
    handleBack
  } = useSignupForm();

  const { handlePayment, isLoading } = useSignupPayment();

  const onPayment = () => {
    handlePayment(accountInfo, practiceDetails);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <SignupHeader currentStep={currentStep} />

        {/* Enhanced How It Works Section - Only show on step 1 */}
        {currentStep === 1 && <HowItWorksSection />}

        {/* Signup Form Section - Single Column Layout */}
        <div id="signup-section" className="max-w-2xl mx-auto">
          <SignupFormCard
            currentStep={currentStep}
            accountInfo={accountInfo}
            practiceDetails={practiceDetails}
            updateAccountInfo={updateAccountInfo}
            updatePracticeDetails={updatePracticeDetails}
            handleNext={handleNext}
            handleBack={handleBack}
            handlePayment={onPayment}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
