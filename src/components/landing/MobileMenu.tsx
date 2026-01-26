import { useState } from 'react';
import { MoreVertical, Info, DollarSign, Mail } from 'lucide-react';
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

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);

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
      <Dialog open={activeModal === 'contact'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Get in Touch</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <p className="text-foreground/80">
              Have questions? We'd love to hear from you.
            </p>
            <a
              href="mailto:hello@dgtldental.com"
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              <Mail className="w-5 h-5" />
              hello@dgtldental.com
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileMenu;
