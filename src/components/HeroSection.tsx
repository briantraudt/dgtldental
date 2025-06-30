
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section 
      className="relative h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center"
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
      
      {/* Elegant gradient overlay that transitions to next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-slate-900/40 z-10"></div>
      
      {/* Hero Content */}
      <div className="relative z-20 flex-1 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          {/* Mobile and Tablet headline layout - stacked vertically */}
          <div className="block lg:hidden">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Missed Calls.
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Missed Patients.
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Missed Revenue.
            </h1>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-blue-400">
              Not Anymore.
            </h1>
            <p className="text-lg md:text-xl font-medium mb-6 opacity-90">
              Handle every question after hours with an AI-powered front desk assistant.
            </p>
          </div>
          
          {/* Desktop headline layout */}
          <div className="hidden lg:block">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Missed Calls. Missed Patients. Missed Revenue.
            </h1>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-blue-400">
              Not Anymore.
            </h1>
            <p className="text-lg md:text-2xl mb-8 opacity-90">
              Handle every question after hours with an AI-powered front desk assistant.
            </p>
          </div>
          
          <Link to="/signup-flow">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4">
              Get Started Today <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Smooth transition element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-15"></div>
    </section>
  );
};

export default HeroSection;
