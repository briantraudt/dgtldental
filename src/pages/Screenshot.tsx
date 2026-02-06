import toothIcon from '@/assets/tooth-icon.png';
import heroImage from '@/assets/screenshot-hero.jpg';
import { ArrowUp, Phone, Mail, MapPin, Clock, Star, ChevronDown, MessageCircle } from 'lucide-react';

const Screenshot = () => {
  return (
    <div className="h-full overflow-y-auto bg-white relative" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* ===== DENTAL WEBSITE ===== */}
      
      {/* Top bar */}
      <div className="bg-[hsl(225,47%,25%)] text-white text-xs py-2 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> (512) 774-5010</span>
            <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> hello@brightsmileaustin.com</span>
          </div>
          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> Mon-Fri 8am-5pm | Sat 9am-2pm</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[hsl(225,47%,30%)] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold text-[hsl(225,47%,25%)]">Bright Smile Dental</span>
          </div>
          <div className="flex items-center gap-8 text-sm font-medium text-gray-600">
            <span className="hover:text-[hsl(225,47%,30%)] cursor-pointer">Home</span>
            <span className="hover:text-[hsl(225,47%,30%)] cursor-pointer flex items-center gap-1">Services <ChevronDown className="w-3 h-3" /></span>
            <span className="hover:text-[hsl(225,47%,30%)] cursor-pointer">Our Team</span>
            <span className="hover:text-[hsl(225,47%,30%)] cursor-pointer">Insurance</span>
            <span className="hover:text-[hsl(225,47%,30%)] cursor-pointer">Contact</span>
            <button className="bg-[hsl(225,47%,30%)] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[hsl(225,47%,25%)] transition-colors">
              Book Appointment
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[480px] overflow-hidden">
        <img src={heroImage} alt="Dental Office" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(225,47%,20%)/0.85] via-[hsl(225,47%,25%)/0.6] to-transparent" />
        <div className="absolute inset-0 flex items-center px-6">
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-xl">
              <div className="flex items-center gap-1.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-white/90 text-sm ml-2">4.9 • 240+ Reviews</span>
              </div>
              <h1 className="text-5xl font-bold text-white leading-tight mb-4">
                Your Family's Smile,<br />Our Priority
              </h1>
              <p className="text-lg text-white/85 mb-8 leading-relaxed">
                Comprehensive dental care for the whole family in a warm, modern environment. 
                Serving Austin for over 18 years.
              </p>
              <div className="flex gap-3">
                <button className="bg-white text-[hsl(225,47%,25%)] px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Schedule a Visit
                </button>
                <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                  Our Services
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services strip */}
      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[hsl(225,47%,25%)] text-center mb-3">Our Services</h2>
          <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">From routine cleanings to advanced cosmetic procedures, we offer comprehensive dental care for every need.</p>
          <div className="grid grid-cols-4 gap-6">
            {[
              { title: 'General Dentistry', desc: 'Cleanings, exams, fillings, and preventive care', icon: '🦷' },
              { title: 'Cosmetic Dentistry', desc: 'Whitening, veneers, bonding, and smile makeovers', icon: '✨' },
              { title: 'Orthodontics', desc: 'Invisalign and clear aligners for a perfect smile', icon: '😁' },
              { title: 'Emergency Care', desc: 'Same-day appointments for urgent dental needs', icon: '🏥' },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <span className="text-3xl mb-4 block">{service.icon}</span>
                <h3 className="font-semibold text-[hsl(225,47%,25%)] mb-2">{service.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[hsl(225,47%,30%)] mb-1">18+</div>
              <div className="text-gray-500 text-sm">Years Serving Austin</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[hsl(225,47%,30%)] mb-1">15,000+</div>
              <div className="text-gray-500 text-sm">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[hsl(225,47%,30%)] mb-1">4.9★</div>
              <div className="text-gray-500 text-sm">Google Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance bar */}
      <section className="bg-[hsl(225,47%,25%)] py-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-white font-semibold text-lg mb-4">We Accept Most Major Insurance Plans</h3>
          <div className="flex justify-center gap-8 text-white/70 text-sm flex-wrap">
            {['Delta Dental', 'Cigna', 'Aetna', 'MetLife', 'Guardian', 'BCBS', 'United Healthcare', 'Humana'].map(ins => (
              <span key={ins} className="bg-white/10 px-4 py-2 rounded-full">{ins}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-[hsl(225,47%,40%)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">B</span>
              </div>
              <span className="font-bold">Bright Smile Dental</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">Comprehensive dental care for the whole family in Austin, TX.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>About Us</p><p>Services</p><p>New Patients</p><p>Blog</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> (512) 774-5010</p>
              <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> hello@brightsmileaustin.com</p>
              <p className="flex items-center gap-2"><MapPin className="w-3 h-3" /> 601 Congress Ave, Austin, TX</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Office Hours</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Mon-Fri: 8:00am - 5:00pm</p>
              <p>Saturday: 9:00am - 2:00pm</p>
              <p>Sunday: Closed</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2026 Bright Smile Dental. All rights reserved.
        </div>
      </footer>


      {/* ===== CHAT WIDGET (floating) ===== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        
        {/* Chat window */}
        <div className="w-[400px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden" style={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25)' }}>
          
          {/* Chat header */}
          <div className="bg-[hsl(225,47%,30%)] px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <img src={toothIcon} alt="Bot" className="w-5 h-5 object-contain brightness-0 invert" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Virtual Front Desk</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-white/70 text-xs">Online now</span>
              </div>
            </div>
          </div>

          {/* Chat messages */}
          <div className="px-4 py-4 space-y-3 max-h-[380px] overflow-y-auto bg-gray-50/50">
            
            {/* Bot greeting */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
                <p className="text-[13px] text-gray-700 leading-relaxed">
                  Hi there! 👋 Welcome to Bright Smile Dental. How can I help you today?
                </p>
              </div>
            </div>

            {/* User question */}
            <div className="flex justify-end">
              <div className="bg-[hsl(225,47%,30%)] text-white px-3.5 py-2.5 rounded-2xl rounded-br-sm max-w-[85%] shadow-sm">
                <p className="text-[13px]">Do you accept Delta Dental insurance?</p>
              </div>
            </div>

            {/* Bot response */}
            <div className="flex items-start gap-2.5">
              <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 max-w-[85%] shadow-sm">
                <div className="text-[13px] text-gray-700 leading-relaxed space-y-2">
                  <p>Yes, we do accept Delta Dental! We also accept Cigna, Aetna, MetLife, Guardian, United Healthcare, BlueCross BlueShield, Humana, and most PPO plans.</p>
                  <p>I can help you schedule an appointment! We have openings on Tuesday at 9:00 AM, Wednesday at 2:00 PM, or Thursday at 10:30 AM.</p>
                  <p>Give us a call at <span className="font-medium text-[hsl(225,47%,30%)]">(512) 774-5010</span> or book online — we'd love to see you! 😊</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat input */}
          <div className="px-3 pb-3 pt-1 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="Type a message..."
                className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-[13px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
              />
              <button className="w-9 h-9 rounded-xl bg-[hsl(225,47%,30%)] text-white flex items-center justify-center flex-shrink-0">
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              Powered by <span className="font-semibold text-[hsl(225,47%,30%)]">DGTL</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Screenshot;
