
import { MessageSquare, Clock, Users, BarChart3 } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-indigo-100/80">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Problem Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            The Reality of Running a Dental Practice
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Constant Interruptions</h3>
              <p className="text-gray-600">Staff constantly interrupted by basic patient questions during busy hours.</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">After-Hours Silence</h3>
              <p className="text-gray-600">Patients can't get answers to simple questions when your office is closed.</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Overworked Staff</h3>
              <p className="text-gray-600">Your team spends valuable time answering the same questions repeatedly.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Lost Opportunities</h3>
              <p className="text-gray-600">Potential patients leave when they can't get immediate answers to their questions.</p>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              How Does It Work?
            </h2>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-gray-700 leading-relaxed">
                At the end of signup, you'll receive a line of code customized for your practice. Just paste it into your website—no tech experience needed. Once it's live, your assistant starts answering patient questions immediately—saving time and freeing up your staff, even after hours.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-blue-600">1</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">Instant Setup</h3>
              <p className="text-gray-600">Get your custom code and paste it into your website. No technical skills required.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-green-600">2</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Takes Over</h3>
              <p className="text-gray-600">Your assistant immediately starts answering patient questions with your practice information.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl font-bold text-purple-600">3</div>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">You Save Time</h3>
              <p className="text-gray-600">Staff freed up for patient care while the AI handles routine inquiries 24/7.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
