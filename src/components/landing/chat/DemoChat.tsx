import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';
import toothIcon from '@/assets/tooth-icon.png';

interface DemoChatProps {
  onComplete: () => void;
}

const DEMO_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/demo-chat`;

const DemoChat = ({ onComplete }: DemoChatProps) => {
  const [userMessage, setUserMessage] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAsked, setHasAsked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;
    
    setUserMessage(message);
    setHasAsked(true);
    setIsLoading(true);
    setAiResponse('');

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
              setAiResponse(fullResponse);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }
    } catch (error) {
      console.error("Demo chat error:", error);
      setAiResponse("I'm having trouble connecting right now. But imagine a helpful response here! 😊");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    sendMessage(userMessage);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Prompt */}
      <div className="text-foreground/70">
        <span className="text-[15px]">Try it — ask any dental question:</span>
      </div>

      {/* Input */}
      {!hasAsked && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Type a question..."
            className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <Button
            type="submit"
            disabled={!userMessage.trim() || isLoading}
            size="icon"
            className="w-11 h-11 rounded-xl bg-primary hover:bg-primary/90 disabled:bg-secondary"
          >
            <ArrowUp className="w-5 h-5 text-primary-foreground" />
          </Button>
        </form>
      )}

      {/* User message bubble */}
      {hasAsked && userMessage && (
        <div className="flex justify-end animate-fade-in">
          <div className="bg-primary text-primary-foreground border border-primary px-4 py-3 rounded-2xl rounded-br-sm max-w-[85%]">
            <p className="text-[15px]">{userMessage}</p>
          </div>
        </div>
      )}

      {/* AI Response */}
      {hasAsked && (
        <div className="flex items-start gap-3 animate-fade-in">
          <div className="w-6 h-6 flex-shrink-0">
            <img src={toothIcon} alt="Bot" className="w-full h-full object-contain" />
          </div>
          <div className="bg-background border border-primary/30 rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
            {isLoading && !aiResponse ? (
              <div className="flex gap-1.5 py-1">
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }} />
                <span className="w-2 h-2 bg-primary/40 rounded-full animate-[pulse_1.4s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }} />
              </div>
            ) : (
              <p className="text-[15px] text-foreground/80 leading-relaxed">{aiResponse}</p>
            )}
          </div>
        </div>
      )}

      {/* Continue button after response */}
      {hasAsked && aiResponse && !isLoading && (
        <div className="pt-2 animate-fade-in">
          <button
            onClick={onComplete}
            className="px-5 py-3 rounded-xl text-sm font-medium bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default DemoChat;
