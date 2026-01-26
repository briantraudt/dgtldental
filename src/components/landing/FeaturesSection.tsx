import { HelpCircle, Clock, Phone, UserPlus, MessageCircle } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: HelpCircle,
      text: "Common patient questions (procedures, pricing ranges, insurance basics)"
    },
    {
      icon: MessageCircle,
      text: "Patient-friendly explanations"
    },
    {
      icon: Clock,
      text: "After-hours inquiries"
    },
    {
      icon: Phone,
      text: "Front-desk interruptions"
    },
    {
      icon: UserPlus,
      text: "New patient lead capture"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            What Your Website Assistant Handles
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Let your AI assistant take care of the routine questions so your team can focus on patient care.
          </p>
          
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-lg text-gray-700">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
