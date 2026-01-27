import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import toothIcon from '@/assets/tooth-icon.png';
import { triggerHaptic } from './audioFeedback';

interface DemoChatProps {
  onComplete: () => void;
  isCompleted?: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  isComplete?: boolean;
}

const DEMO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/demo-chat`;

// Typewriter component for streaming text
const StreamingTypewriter = ({ text, isComplete, onTextUpdate, onTypingComplete }: { text: string; isComplete: boolean; onTextUpdate?: () => void; onTypingComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasCalledComplete = useRef(false);
  const scrollCounter = useRef(0);
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(prev => prev + 1);
        // Scroll every 3 characters for smoother continuous scrolling
        scrollCounter.current++;
        if (scrollCounter.current % 3 === 0) {
          onTextUpdate?.();
        }
      }, 35);
      return () => clearTimeout(timeout);
    } else if (isComplete && currentIndex === text.length && text.length > 0 && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      onTextUpdate?.(); // Final scroll when complete
      onTypingComplete?.();
    }
  }, [currentIndex, text, onTextUpdate, isComplete, onTypingComplete]);

  const formatDisplayedText = (txt: string, showCursor: boolean, isFullyTyped: boolean) => {
    if (!txt) {
      return showCursor ? <span className="inline-block w-0.5 h-4 bg-primary/60 animate-pulse" /> : null;
    }
    
    const paragraphs = txt.split(/\n\n+/).filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      const isLastParagraph = index === paragraphs.length - 1;
      
      // Only linkify after typing is complete to avoid links appearing before surrounding text
      if (isFullyTyped) {
        // Handle website links
        if (paragraph.includes('dentaloffice.com')) {
          const parts = paragraph.split('dentaloffice.com');
          return (
            <p key={index}>
              {parts[0]}
              <a 
                href="https://dgtldental.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                dentaloffice.com
              </a>
              {parts[1]}
            </p>
          );
        }
        // Handle email links
        const emailMatch = paragraph.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          const email = emailMatch[1];
          const parts = paragraph.split(email);
          return (
            <p key={index}>
              {parts[0]}
              <a 
                href={`mailto:${email}`}
                className="text-primary hover:text-primary/80 underline underline-offset-2"
              >
                {email}
              </a>
              {parts[1]}
            </p>
          );
        }
      }
      
      return (
        <p key={index}>
          {paragraph.trim()}
          {isLastParagraph && showCursor && <span className="inline-block w-0.5 h-4 bg-primary/60 animate-pulse ml-0.5 align-middle" />}
        </p>
      );
    });
  };

  const isTypingDone = isComplete && currentIndex >= text.length;

  return (
    <div className="text-[15px] text-foreground/80 leading-relaxed space-y-3">
      {formatDisplayedText(displayedText, !isTypingDone, isTypingDone)}
    </div>
  );
};

const DemoChat = ({ onComplete, isCompleted = false }: DemoChatProps) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAiResponse, setCurrentAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [streamComplete, setStreamComplete] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    // Immediate scroll without delay for continuous visibility during streaming
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  const handleTypingComplete = useCallback(() => {
    setTypingComplete(true);
    // Ensure Continue button is visible after typing completes
    scrollToBottom();
  }, [scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    // Add user message to history
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
    };
    
    // If there's a current AI response, save it to history first
    if (currentAiResponse && streamComplete) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now() - 1}`,
        type: 'ai',
        content: currentAiResponse,
        isComplete: true,
      };
      setMessages(prev => [...prev, aiMsg]);
    }
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setCurrentAiResponse('');
    setStreamComplete(false);
    setTypingComplete(false);
    setQuestionCount(prev => prev + 1);

    try {
      const resp = await fetch(DEMO_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get response");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              setCurrentAiResponse(fullResponse);
              // Scroll as new content streams in
              scrollToBottom();
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Demo chat error:", error);
      setCurrentAiResponse("I'm having trouble connecting right now. But imagine a helpful response here! 😊");
    } finally {
      setIsLoading(false);
      setStreamComplete(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    triggerHaptic('medium');
    sendMessage(inputValue);
  };

  const showContinue = questionCount >= 1 && typingComplete && !hasCompleted && !isCompleted;
  const showInput = questionCount === 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Message history */}
      {messages.map((msg) => (
        msg.type === 'user' ? (
          <div key={msg.id} className="flex justify-end animate-fade-in">
            <div className="bg-primary text-primary-foreground border border-primary px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%]">
              <p className="text-[15px]">{msg.content}</p>
            </div>
          </div>
        ) : (
          <div key={msg.id} className="flex items-start gap-3 animate-fade-in">
            <div className="w-6 h-6 flex-shrink-0">
              <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
            </div>
            <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
              <div className="text-[15px] text-foreground/80 leading-relaxed space-y-3">
                {msg.content.split(/\n\n+/).filter(p => p.trim()).map((paragraph, idx) => (
                  <p key={idx}>{paragraph.trim()}</p>
                ))}
              </div>
            </div>
          </div>
        )
      ))}

      {/* Current AI Response (streaming) */}
      {(isLoading || currentAiResponse) && (
        <div className="flex items-start gap-3 animate-fade-in">
          <div className="w-6 h-6 flex-shrink-0">
            <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
          </div>
          <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
            {isLoading && !currentAiResponse ? (
              <div className="flex gap-1.5 py-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
              </div>
            ) : (
              <StreamingTypewriter 
                text={currentAiResponse} 
                isComplete={streamComplete} 
                onTextUpdate={scrollToBottom} 
                onTypingComplete={handleTypingComplete} 
              />
            )}
          </div>
        </div>
      )}

      {/* Input field - show initially and after first answer */}
      {showInput && (
        <form onSubmit={handleSubmit} className="flex gap-3 animate-fade-in">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a dental question..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <Button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className={`w-11 h-11 rounded-xl transition-all ${
              inputValue.trim() 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-transparent border-2 border-primary/30 text-primary/50 hover:border-primary/50'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </form>
      )}

      {/* Continue button - only show after second question */}
      {showContinue && (
        <div className="pt-2 animate-fade-in flex justify-end">
          <button
            onClick={() => {
              triggerHaptic('light');
              setHasCompleted(true);
              onComplete();
            }}
            className="px-5 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
          >
            Continue →
          </button>
        </div>
      )}
      
      <div ref={responseEndRef} className="h-16" />
    </div>
  );
};

export default DemoChat;
