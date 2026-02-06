import { useState } from 'react';
import { Menu, Info, DollarSign, Mail, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import toothIcon from '@/assets/tooth-icon.png';

type ModalType = 'about' | 'pricing' | 'contact' | 'success' | null;

const CONTACT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact`;

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactQuestion, setContactQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuItems = [
    { id: 'about' as const, label: 'About', icon: Info },
    { id: 'pricing' as const, label: 'Pricing', icon: DollarSign },
    { id: 'contact' as const, label: 'Contact', icon: Mail },
  ];

  const handleMenuClick = (modalType: ModalType) => {
    setIsOpen(false);
    setTimeout(() => setActiveModal(modalType), 150);
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[280px] bg-background">
          <SheetHeader className="text-left pb-6">
            <SheetTitle className="flex items-center gap-2 font-normal">
              <img src={toothIcon} alt="DGTL" className="h-6 w-6" />
              <span>DGTL Dental</span>
            </SheetTitle>
          </SheetHeader>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-foreground hover:bg-secondary transition-colors text-left"
              >
                <item.icon className="w-5 h-5 text-primary" />
                <span className="font-normal">{item.label}</span>
              </button>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* About Modal */}
      <Dialog open={activeModal === 'about'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <img src={toothIcon} alt="DGTL" className="h-12 w-12" />
            </div>
            <DialogTitle className="text-center font-normal text-lg text-muted-foreground">About Us</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <p className="text-[15px] text-foreground/80 leading-relaxed text-center">
              We build AI-powered Virtual Front Desks that answer patient questions around the clock. With <span className="text-foreground font-medium">over 50,000 questions answered</span> for practices nationwide, we help reduce phone interruptions while giving your patients instant, helpful responses.
            </p>
            <div className="pt-4 text-center text-xs text-muted-foreground/60">
              DGTL Dental is <a href="https://goodbusinesshq.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">a Good Business</a>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <Dialog open={activeModal === 'pricing'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <img src={toothIcon} alt="DGTL" className="h-12 w-12" />
            </div>
            <DialogTitle className="text-center font-normal text-lg text-muted-foreground">Standard Pricing</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-2">
            <div className="text-center">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-5xl font-light tracking-tight text-foreground">$99</span>
                <span className="text-muted-foreground text-lg">/mo</span>
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <ul className="space-y-4">
                {[
                  'No setup fee',
                  'Customizations and Integrations Available',
                  'Cancel anytime'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-[15px] text-foreground/80">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={activeModal === 'contact'} onOpenChange={(open) => {
        setActiveModal(open ? 'contact' : null);
        if (!open) {
          setContactEmail('');
          setContactQuestion('');
        }
      }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <img src={toothIcon} alt="DGTL" className="h-12 w-12" />
            </div>
            <DialogTitle className="text-center font-normal text-lg text-muted-foreground">Get in Touch</DialogTitle>
          </DialogHeader>
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              if (!contactEmail || !contactQuestion) return;
              
              setIsSubmitting(true);
              try {
                const resp = await fetch(CONTACT_URL, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                  },
                  body: JSON.stringify({ email: contactEmail, question: contactQuestion }),
                });
                
                if (!resp.ok) throw new Error('Failed to send');
                
                setContactEmail('');
                setContactQuestion('');
                setActiveModal('success');
              } catch (error) {
                toast.error('Failed to send message. Please try again.');
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="space-y-4 pt-2"
          >
            <div>
              <input
                type="email"
                placeholder="Your email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <textarea
                placeholder="Your question..."
                value={contactQuestion}
                onChange={(e) => setContactQuestion(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !contactEmail || !contactQuestion}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={activeModal === 'success'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-xs">
          <div className="flex flex-col items-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-center text-foreground text-[15px]">
              Message sent! We'll get back to you soon.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileMenu;
