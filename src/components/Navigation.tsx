
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

const Navigation = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-end items-center h-16">
          <div className="flex items-center space-x-4">
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-white text-white hover:bg-white hover:text-gray-900 bg-black/20 backdrop-blur-sm">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/signup-flow">
              <Button size="sm" className="bg-brand-blue hover:bg-brand-blue-hover text-white">
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
