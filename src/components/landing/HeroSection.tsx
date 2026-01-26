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
      className="relative min-h-[90vh] bg-cover bg-center bg-no-repeat flex flex-col justify-center pt-16"
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/55 z-10"></div>
      
      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-5xl">
          {/* Main Headline - Much larger */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
            A Dental-Trained AI Assistant for Your Website
          </h1>
          
          {/* Short supporting copy - max 2 lines */}
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
            We build and install your custom assistant in 24 hours. No tech skills needed.
          </p>
          
          {/* Single CTA */}
          <Button 
            onClick={scrollToForm}
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-xl md:text-2xl px-12 py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-200 font-semibold"
          >
            Request Setup <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Smooth transition element */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-15"></div>
    </section>
  );
};

export default HeroSection;
