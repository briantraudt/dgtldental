import { useState } from 'react';
import { X, Info, DollarSign, Mail } from 'lucide-react';
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
            <img src={toothIcon} alt="Menu" className="w-5 h-5 object-contain" />
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <img src={toothIcon} alt="DGTL" className="h-6 w-6" />
              About DGTL Dental
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-foreground/80">
            <p>
              We create AI-powered chatbots for dental practices to help you save time and money while providing a better patient experience.
            </p>
            <p>
              Our AI assistants answer patient questions 24/7, reducing front desk interruptions and ensuring patients always get the help they need.
            </p>
            <p className="text-sm text-muted-foreground">
              Over 50,000+ questions answered for dental practices nationwide.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <Dialog open={activeModal === 'pricing'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Simple Pricing</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="text-center py-6 bg-secondary/50 rounded-xl">
              <div className="text-4xl font-bold text-foreground">$99</div>
              <div className="text-muted-foreground">/month</div>
            </div>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                No setup fee
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Cancel anytime
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Live within 24 hours
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                Unlimited patient conversations
              </li>
            </ul>
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
