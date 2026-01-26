import { useState } from 'react';
import { MoreVertical, Info, DollarSign, Mail, Send } from 'lucide-react';
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

type ModalType = 'about' | 'pricing' | 'contact' | null;

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
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
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
            <DialogTitle className="text-center font-normal text-lg text-muted-foreground">About Us</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            <div className="text-center">
              <img src={toothIcon} alt="DGTL" className="h-12 w-12 mx-auto mb-4" />
            </div>
            <p className="text-[15px] text-foreground/80 leading-relaxed text-center">
              We create AI assistants for dental practices that answer patient questions 24/7 — with over <span className="text-foreground font-medium">50,000+ questions answered</span> for practices nationwide.
            </p>
            <p className="text-[15px] text-foreground/80 leading-relaxed text-center">
              Less phone interruptions for your front desk. Better experience for your patients.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <Dialog open={activeModal === 'pricing'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center font-normal text-lg text-muted-foreground">Really Simple Pricing</DialogTitle>
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
                  'Completely customized for your office',
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
                
                toast.success('Message sent! We\'ll get back to you soon.');
                setActiveModal(null);
                setContactEmail('');
                setContactQuestion('');
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
    </>
  );
};

export default MobileMenu;
