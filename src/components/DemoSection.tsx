
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import EmbeddedChatDemo from './EmbeddedChatDemo';

const DemoSection = () => {
  return (
    <div className="relative bg-gradient-to-b from-indigo-100/80 via-blue-50/60 to-slate-100/40 py-16">
      {/* Seamless transition from previous section */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-indigo-100/80 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Demo Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            See How Your AI Dental Assistant Works
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Experience the power of a 24/7 AI assistant trained to answer dental-specific questions for your patients — instantly and accurately.
          </p>

          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <EmbeddedChatDemo />
            </div>
          </div>
        </section>

        {/* Call to Action Section - Updated with stronger copy */}
        <section className="text-center bg-white/30 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-lg">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Let Your Website Handle Patient Questions—Even After Hours
          </h2>
          <p className="text-gray-600 mb-8">
            Join practices using our 24/7 AI chat assistant to reduce phone calls, book more appointments, and never miss a patient again.
          </p>
          <Link to="/signup-flow">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up Now <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </section>
      </div>
      
      {/* Bottom gradient for page completion */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent"></div>
    </div>
  );
};

export default DemoSection;
