import toothIcon from '@/assets/tooth-icon.png';
import dgtlLogo from '@/assets/dgtl-logo.png';
import { ArrowUp } from 'lucide-react';

const Screenshot = () => {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <img src={dgtlLogo} alt="DGTL Dental" className="h-5 object-contain" />
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">About</span>
          <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">Contact</span>
        </div>
      </header>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Bot greeting */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex-shrink-0 mt-1">
              <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <p className="text-[15px] text-foreground/80 leading-relaxed">
                Hi, thanks for stopping by! We create AI-powered Virtual Front Desks for dental practices to help you save time and money while providing a better patient experience.
              </p>
            </div>
          </div>

          {/* Bot question */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex-shrink-0 mt-1">
              <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <p className="text-[15px] text-foreground/80 leading-relaxed">
                Are you a dentist or do you work in a dental office?
              </p>
            </div>
          </div>

          {/* User reply */}
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground border border-primary px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%]">
              <p className="text-[15px]">Yes</p>
            </div>
          </div>

          {/* Bot demo intro */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex-shrink-0 mt-1">
              <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <div className="text-[15px] text-foreground/80 leading-relaxed space-y-3">
                <p>Great — we're excited to show you this!</p>
                <p>Here's a quick demo of what your patients would experience. In the box below, ask any dental or office-related question.</p>
              </div>
            </div>
          </div>

          {/* User question in demo */}
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground border border-primary px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%]">
              <p className="text-[15px]">Do you accept Delta Dental insurance?</p>
            </div>
          </div>

          {/* AI demo response */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 flex-shrink-0 mt-1">
              <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <div className="text-[15px] text-foreground/80 leading-relaxed space-y-3">
                <p>Yes, we do accept Delta Dental! We also accept Cigna, Aetna, MetLife, Guardian, United Healthcare, BlueCross BlueShield, Humana, and most PPO plans.</p>
                <p>If you'd like, I can help you schedule an appointment. We have openings on Tuesday at 9:00 AM, Wednesday at 2:00 PM, or Thursday at 10:30 AM.</p>
                <p>Give us a call at (512) 774-5010 or book online at <a href="https://dgtldental.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 underline underline-offset-2">dgtldental.com</a> — we'd love to see you!</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Input bar (static, for visual) */}
      <div className="flex-shrink-0 px-4 pb-6 pt-2">
        <div className="max-w-2xl mx-auto flex gap-3">
          <input
            type="text"
            readOnly
            placeholder="Ask a dental question..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            disabled
            className="w-11 h-11 rounded-xl bg-transparent border-2 border-primary/30 text-primary/50 flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screenshot;
