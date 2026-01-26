import { ShieldCheck, AlertCircle, MessageSquare, PhoneCall } from 'lucide-react';

const SafetySection = () => {
  const safetyPoints = [
    {
      icon: AlertCircle,
      text: "No diagnosis or treatment decisions"
    },
    {
      icon: ShieldCheck,
      text: "Clear medical disclaimers"
    },
    {
      icon: MessageSquare,
      text: "Conservative, patient-safe language"
    },
    {
      icon: PhoneCall,
      text: "Always encourages contacting the office"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <ShieldCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Patient Safety
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Your patients' well-being is our top priority. Our AI is built with safety guardrails at every level.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {safetyPoints.map((point, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-5 bg-white rounded-xl border border-green-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <point.icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-lg text-gray-700 font-medium">
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

export default SafetySection;
