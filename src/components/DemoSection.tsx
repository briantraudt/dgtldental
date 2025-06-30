
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import EmbeddedChatDemo from './EmbeddedChatDemo';

const DemoSection = () => {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/signup-flow');
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative bg-gradient-to-b from-indigo-100/80 via-blue-50/60 to-slate-100/40 py-8 md:py-16">
      {/* Seamless transition from previous section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-100/80 to-transparent"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Demo Section */}
        <section className="mb-8 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3 md:mb-4 text-center leading-tight">
            See How Your AI Dental Assistant Works
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 text-center max-w-3xl mx-auto leading-relaxed px-2">
            Experience the power of a 24/7 AI assistant trained to answer dental-specific questions for your patients — instantly and accurately.
          </p>

          <div className="flex justify-center px-2 md:px-0">
            <div className="w-full max-w-4xl">
              <EmbeddedChatDemo />
            </div>
          </div>
        </section>

        {/* Call to Action Section - Updated with stronger copy and mobile optimization */}
        <section className="text-center bg-white/40 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 md:p-12 border border-white/30 shadow-lg mx-2 md:mx-0">
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-3 md:mb-4 leading-tight">
            Let Your Website Handle Patient Questions—Even After Hours
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto">
            Join practices using our 24/7 AI chat assistant to reduce phone calls, book more appointments, and never miss a patient again.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white text-base md:text-lg px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={handleSignupClick}
          >
            Sign Up Now <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </section>
      </div>
      
      {/* Bottom gradient for page completion */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent"></div>
    </div>
  );
};

export default DemoSection;
