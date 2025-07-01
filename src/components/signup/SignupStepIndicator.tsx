
import { Check, User, Building, CreditCard } from 'lucide-react';

interface SignupStepIndicatorProps {
  currentStep: number;
}

const SignupStepIndicator = ({ currentStep }: SignupStepIndicatorProps) => {
  const getStepIcon = (step: number) => {
    if (step === 1) return <User className="h-5 w-5" />;
    if (step === 2) return <Building className="h-5 w-5" />;
    return <CreditCard className="h-5 w-5" />;
  };

  return (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
            currentStep >= step 
              ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
              : 'bg-white border-gray-300 text-gray-500'
          }`}>
            {currentStep > step ? (
              <Check className="h-5 w-5" />
            ) : (
              getStepIcon(step)
            )}
          </div>
          {step < 3 && (
            <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
              currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SignupStepIndicator;
