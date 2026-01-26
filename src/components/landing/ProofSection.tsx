import { Check } from 'lucide-react';

const ProofSection = () => {
  const capabilities = [
    "Answers patient questions 24/7",
    "Dental-only knowledge (not general AI)",
    "Patient-safe, non-diagnostic language",
    "Designed specifically for dental websites"
  ];

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            Proven in Real Dental Practices
          </h2>
          
          {/* Single column, large text bullets */}
          <div className="space-y-8">
            {capabilities.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-5"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProofSection;
