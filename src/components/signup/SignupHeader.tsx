
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SignupStepIndicator from './SignupStepIndicator';

interface SignupHeaderProps {
  currentStep: number;
}

const SignupHeader = ({ currentStep }: SignupHeaderProps) => {
  const navigate = useNavigate();

  const getStepTitle = (step: number) => {
    if (step === 1) return "Account Information";
    if (step === 2) return "Practice Details";
    return "Payment & Setup";
  };

  return (
    <div className="max-w-2xl mx-auto">
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
    </div>
  );
};

export default SignupHeader;
