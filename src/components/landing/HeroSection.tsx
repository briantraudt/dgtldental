import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('intake-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative min-h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center pt-16"
      style={{
        backgroundImage: `url('/lovable-uploads/942be64c-570e-4ba1-9e24-e46fd5478324.png')`,
      }}
    >
      {/* Desktop background override */}
      <div 
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/lovable-uploads/4696588c-59c3-46d6-8d8b-c6e580f53b9f.png')`,
        }}
      ></div>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/50 z-10"></div>
      
      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          {/* Main Headline */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            A Dental-Trained AI Assistant for Your Website
          </h1>
          
          {/* Authority + Proof Subheadline */}
          <p className="text-lg md:text-2xl font-medium mb-4 text-blue-200">
            Over 50,000 real dental questions answered.
          </p>
          <p className="text-lg md:text-2xl font-medium mb-6 text-blue-200">
            We build and install your custom assistant in 24 hours.
          </p>
          
          {/* Supporting Line */}
          <p className="text-base md:text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Answer patient questions 24/7 using safe, dental-specific language — without adding staff or software.
          </p>
          
          {/* Single CTA */}
          <Button 
            onClick={scrollToForm}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg md:text-xl px-10 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 font-semibold"
          >
            Request Setup <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Smooth transition element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-15"></div>
    </section>
  );
};

export default HeroSection;
