import { Mail } from 'lucide-react';

const QuestionSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-6">
          Question?
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Email us
        </p>
        <a 
          href="mailto:hello@dgtldental.com" 
          className="inline-flex items-center space-x-2 text-lg font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Mail className="h-5 w-5" />
          <span>hello@dgtldental.com</span>
        </a>
      </div>
    </section>
  );
};

export default QuestionSection;