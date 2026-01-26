import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PricingSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('intake-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-8">
            Simple, Transparent Pricing
          </h2>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12 border border-blue-100 shadow-lg">
            <div className="mb-6">
              <span className="text-5xl md:text-6xl font-bold text-gray-900">$99</span>
              <span className="text-xl md:text-2xl text-gray-600"> / month</span>
            </div>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-600" />
                <span>No setup fee</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-600" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Check className="w-5 h-5 text-green-600" />
                <span>Done-for-you setup included</span>
              </div>
            </div>
            
            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-10 py-6 rounded-xl shadow-md hover:shadow-lg transition-all font-semibold"
            >
              Request Setup
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
