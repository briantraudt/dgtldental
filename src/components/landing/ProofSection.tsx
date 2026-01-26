import { MessageSquare, Stethoscope, Shield, Globe } from 'lucide-react';

const ProofSection = () => {
  const proofPoints = [
    {
      icon: MessageSquare,
      text: "50,000+ dental Q&A interactions"
    },
    {
      icon: Stethoscope,
      text: "Dental-only knowledge (not general AI)"
    },
    {
      icon: Shield,
      text: "Patient-safe, non-diagnostic language"
    },
    {
      icon: Globe,
      text: "Designed specifically for dental practice websites"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            Proven in Real Dental Conversations
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {proofPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <point.icon className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-lg text-gray-700 font-medium pt-2">
                  {point.text}
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
