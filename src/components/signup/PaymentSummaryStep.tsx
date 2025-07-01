
import { PracticeDetails } from '@/types/signupTypes';

interface PaymentSummaryStepProps {
  practiceDetails: PracticeDetails;
}

const PaymentSummaryStep = ({ practiceDetails }: PaymentSummaryStepProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200">
        <h3 className="text-xl font-semibold mb-4">Subscription Summary</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Monthly Subscription</span>
            <span className="font-semibold">$10.00/month</span>
          </div>
          
          {practiceDetails.needInstallHelp && (
            <div className="flex justify-between">
              <span>One-time Setup Fee</span>
              <span className="font-semibold">$100.00</span>
            </div>
          )}
          
          <hr className="my-2" />
          
          <div className="flex justify-between text-lg font-bold">
            <span>Total Today</span>
            <span>${practiceDetails.needInstallHelp ? '110.00' : '10.00'}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold mb-2">✅ What's Included:</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>24/7 AI assistant to answer patient questions</li>
          <li>Customized responses based on your practice info</li>
          <li>Smart follow-ups to handle multiple patient queries</li>
          <li>Easy, one-line website install (or free setup by us)</li>
          <li>Works after hours, weekends, and holidays</li>
          <li>Real-time updates from your practice dashboard</li>
          <li>Cancel anytime — no long-term contracts</li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Click below to complete your subscription with Stripe's secure checkout.
          You can cancel anytime - no long-term contracts.
        </p>
      </div>
    </div>
  );
};

export default PaymentSummaryStep;
