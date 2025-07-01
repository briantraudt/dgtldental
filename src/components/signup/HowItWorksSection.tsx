
import { Card, CardContent } from '@/components/ui/card';
import { User, Code, Bot } from 'lucide-react';

const HowItWorksSection = () => {
  return (
    <div className="mb-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">
          Start in 3 Simple Steps
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Launch your 24/7 dental assistant in minutes—no tech skills or long setup required.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-3 gap-6 mb-8 max-w-4xl mx-auto">
        {/* Step 1 */}
        <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:-translate-y-1 md:aspect-square flex flex-col">
          <CardContent className="pt-6 pb-4 px-4 text-center relative flex-1 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
            <div className="absolute top-4 left-4 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sign Up</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Enter your details to personalize your AI assistant. No contract, no setup headaches.
            </p>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-50/50 to-white/90 backdrop-blur-sm hover:-translate-y-1 md:aspect-square flex flex-col">
          <CardContent className="pt-6 pb-4 px-4 text-center relative flex-1 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
            <div className="absolute top-4 left-4 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
              <Code className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Install AI Chatbot</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Just copy/paste one line of code—or we'll do it for you.
            </p>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50/50 to-white/90 backdrop-blur-sm hover:-translate-y-1 md:aspect-square flex flex-col">
          <CardContent className="pt-6 pb-4 px-4 text-center relative flex-1 flex flex-col justify-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
            <div className="absolute top-4 left-4 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform duration-300">
              <Bot className="h-6 w-6 text-purple-600" />
            </div>
            <div className="mb-2">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Go Live</h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Start handling patient questions and FAQs automatically—24/7.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksSection;
