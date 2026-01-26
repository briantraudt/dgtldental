const ProcessSection = () => {
  const steps = [
    "You tell us about your practice",
    "We build your dental assistant",
    "Your web team adds one line of code"
  ];

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Headline */}
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 text-center mb-16">
            How It Works
          </h2>
          
          {/* Compact numbered steps */}
          <div className="space-y-8 mb-16">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="flex items-center gap-6"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {index + 1}
                </div>
                <p className="text-xl md:text-2xl text-gray-800">
                  {step}
                </p>
              </div>
            ))}
          </div>
          
          {/* Bold standalone line */}
          <p className="text-2xl md:text-3xl font-bold text-blue-600 text-center">
            Live on your website within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
