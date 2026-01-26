import { CheckCircle } from 'lucide-react';

interface BaseMessageProps {
  children: React.ReactNode;
  animate?: boolean;
}

// Greeting - warm, welcoming
export const GreetingMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="text-[17px] md:text-lg text-gray-800 leading-relaxed">
      {children}
    </div>
  </div>
);

// Question - clear, actionable
export const QuestionMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="text-[15px] md:text-base text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);

// Proof - subtle emphasis, credibility
export const ProofMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="text-[15px] md:text-base text-gray-600 leading-relaxed">
      <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
        {children}
      </span>
    </div>
  </div>
);

// Explanation - informative, supportive
export const ExplanationMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="text-[15px] md:text-base text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
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
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="space-y-2.5">
        {steps.map((step) => (
          <div key={step.number} className="flex items-center gap-3">
            <span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {step.number}
            </span>
            <span className="text-[14px] text-gray-700">{step.text}</span>
          </div>
        ))}
      </div>
      {footer && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[13px] font-medium text-gray-900">{footer}</p>
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
    <div className="text-[15px] md:text-base text-gray-700 leading-relaxed font-medium">
      {text}
    </div>
  </div>
);

// User message - distinct bubble
export const UserMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`flex justify-end ${animate ? 'animate-fade-in' : ''}`}>
    <div className="bg-gray-900 text-white px-5 py-3 rounded-2xl rounded-br-sm max-w-[80%] shadow-sm">
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  </div>
);

// Success message
export const SuccessMessage = ({ children, animate = true }: BaseMessageProps) => (
  <div className={`${animate ? 'animate-fade-in' : ''}`}>
    <div className="flex items-start gap-4 bg-green-50 rounded-2xl p-5 border border-green-100">
      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>
      <div className="text-[15px] text-green-800 leading-relaxed pt-2">
        {children}
      </div>
    </div>
  </div>
);

// Typing indicator
export const TypingIndicator = () => (
  <div className="flex gap-1.5 py-2">
    <span className="w-2 h-2 bg-gray-300 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" />
    <span className="w-2 h-2 bg-gray-300 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
    <span className="w-2 h-2 bg-gray-300 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
  </div>
);

// Quick reply buttons
interface QuickReplyProps {
  options: { label: string; onClick: () => void; primary?: boolean }[];
}

export const QuickReplyButtons = ({ options }: QuickReplyProps) => (
  <div className="flex flex-wrap gap-3 animate-fade-in mt-2">
    {options.map((option, index) => (
      <button
        key={index}
        onClick={option.onClick}
        className="px-6 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
      >
        {option.label}
      </button>
    ))}
  </div>
);
