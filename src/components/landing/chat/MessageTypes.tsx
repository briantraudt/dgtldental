import { CheckCircle } from 'lucide-react';
import toothIcon from '@/assets/tooth-icon.png';

interface BaseMessageProps {
  children: React.ReactNode;
  animate?: boolean;
}

// Bot avatar component
const BotAvatar = () => (
  <div className="w-6 h-6 flex-shrink-0">
    <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
  </div>
);

// Bot message bubble - consistent styling for all bot messages
const BotBubble = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`flex items-start gap-3 ${animate ? 'animate-fade-in' : ''}`}>
    <BotAvatar />
    <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
      <div className="text-[15px] text-foreground/80 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

// Greeting - uses bot bubble
export const GreetingMessage = ({ children, animate = true }: BaseMessageProps) => (
  <BotBubble animate={animate}>{children}</BotBubble>
);

// Question - uses bot bubble
export const QuestionMessage = ({ children, animate = true }: BaseMessageProps) => (
  <BotBubble animate={animate}>{children}</BotBubble>
);

// Proof - subtle emphasis, credibility
export const ProofMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
      {children}
    </span>
  </div>
);

// Explanation - uses bot bubble
export const ExplanationMessage = ({ children, animate = true }: BaseMessageProps) => (
  <BotBubble animate={animate}>{children}</BotBubble>
);

// Process card - structured, visual
interface ProcessStep {
  number: number;
  text: string;
}

interface ProcessCardProps {
  steps: ProcessStep[];
  footer?: string;
  animate?: boolean;
}

export const ProcessCard = ({ steps, footer, animate = true }: ProcessCardProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="bg-background rounded-xl border border-primary/30 shadow-sm p-4">
      <div className="space-y-2.5">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-3">
            <span className="w-7 h-7 bg-primary text-primary-foreground rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {step.number}
            </span>
            <span className="text-[14px] text-foreground/80">{step.text}</span>
          </div>
        ))}
      </div>
      {footer && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-[13px] font-medium text-foreground">{footer}</p>
        </div>
      )}
    </div>
  </div>
);

// CTA - prominent action
interface CTAMessageProps {
  text: string;
  animate?: boolean;
}

export const CTAMessage = ({ text, animate = true }: CTAMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="text-[15px] md:text-base text-foreground/80 leading-relaxed font-medium">
      {text}
    </div>
  </div>
);

// User message - distinct bubble
export const UserMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`flex justify-end ${animate ? 'animate-fade-in' : ''}`}>
    <div className="bg-primary text-primary-foreground border border-primary px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%] shadow-sm">
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  </div>
);

// Success message
export const SuccessMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="bg-success/10 rounded-2xl p-5 border border-success/20">
      <div className="text-[15px] text-success leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

// Typing indicator
export const TypingIndicator = () => (
  <div className="flex gap-1.5 py-2">
    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" />
    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
  </div>
);

// Quick reply buttons
interface QuickReplyProps {
  options: { label: string; onClick: () => void; primary?: boolean }[];
}

export const QuickReplyButtons = ({ options }: QuickReplyProps) => (
  <div className="flex flex-wrap gap-3 animate-fade-in mt-4 justify-end">
    {options.map((option, index) => (
      <button
        key={index}
        onClick={option.onClick}
        className={`px-6 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] border shadow-sm ${
          option.primary 
            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' 
            : 'bg-background text-foreground border-primary/30 hover:bg-secondary'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);
