
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="bg-background shadow-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/532b92af-6f86-449b-8e11-56f955adf0e1.png" 
              alt="DGTL Chat Logo" 
              className="h-10 w-auto"
            />
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup-flow">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
