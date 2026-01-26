import { ClipboardList, Wrench, Code } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    {
      number: "1",
      icon: ClipboardList,
      title: "You tell us about your practice",
      description: "Share your practice details, services, and common patient questions."
    },
    {
      number: "2",
      icon: Wrench,
      title: "We build and customize your dental assistant",
      description: "Our team creates your AI assistant trained on your specific practice information."
    },
    {
      number: "3",
      icon: Code,
      title: "Your web team adds one line of code",
      description: "A simple copy-paste installation that takes just minutes."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-center mt-12 text-xl md:text-2xl font-bold text-blue-600">
            Live on your website within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
