
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Check, CreditCard, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AccountInfo, PracticeDetails } from '@/types/signupTypes';
import { isStep1Valid, isStep2Valid } from '@/utils/signupUtils';
import AccountInfoStep from './AccountInfoStep';
import PracticeDetailsStep from './PracticeDetailsStep';
import PaymentSummaryStep from './PaymentSummaryStep';

interface SignupFormCardProps {
  currentStep: number;
  accountInfo: AccountInfo;
  practiceDetails: PracticeDetails;
  updateAccountInfo: (field: keyof AccountInfo, value: string) => void;
  updatePracticeDetails: (field: keyof PracticeDetails, value: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handlePayment: () => void;
  isLoading: boolean;
}

const SignupFormCard = ({
  currentStep,
  accountInfo,
  practiceDetails,
  updateAccountInfo,
  updatePracticeDetails,
  handleNext,
  handleBack,
  handlePayment,
  isLoading
}: SignupFormCardProps) => {
  const navigate = useNavigate();

  const getStepTitle = (step: number) => {
    if (step === 1) return "Account Information";
    if (step === 2) return "Practice Details";
    return "Payment & Setup";
  };

  return (
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
            disabled={isLoading}
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
  );
};

export default SignupFormCard;
