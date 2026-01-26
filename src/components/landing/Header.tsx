import { Button } from '@/components/ui/button';

const Header = () => {
  const scrollToForm = () => {
    const formSection = document.getElementById('intake-form');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Desktop/Tablet Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/e61c9ac3-9f9b-422b-84b1-43301d0a0096.png" 
                alt="DGTL Dental" 
                className="h-10 w-auto"
              />
            </div>
            
            {/* CTA Button - Hidden on mobile, shown on tablet+ */}
            <Button 
              onClick={scrollToForm}
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Request Setup
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-lg p-3">
        <Button 
          onClick={scrollToForm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg text-lg shadow-md"
        >
          Request Setup
        </Button>
      </div>
    </>
  );
};

export default Header;
