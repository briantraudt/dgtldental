import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  renderText?: (displayedText: string, isComplete: boolean) => React.ReactNode;
}

const TypewriterText = ({ text, speed = 60, onComplete, renderText }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const emitUpdate = () => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('dgtl:typewriter:update'));
  };

  useEffect(() => {
    if (currentIndex < text.length) {
      // Add a longer pause after newlines
      const isAfterNewline = currentIndex > 0 && text[currentIndex - 1] === '\n';
      const delay = isAfterNewline ? 600 : speed;
      
      const timeout = setTimeout(() => {
        const shouldEmit = isAfterNewline || currentIndex % 3 === 0;
        setDisplayedText(prev => {
          const next = prev + text[currentIndex];
          if (shouldEmit) emitUpdate();
          return next;
        });
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !isComplete) {
      setIsComplete(true);
      emitUpdate();
      onComplete?.();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // If custom render function provided, use it
  if (renderText) {
    return (
      <span>
        {renderText(displayedText, isComplete)}
        {currentIndex < text.length && (
          <span className="inline-block w-0.5 h-5 bg-muted-foreground/50 ml-0.5 animate-pulse" />
        )}
      </span>
    );
  }

  return (
    <span>
      {displayedText.split('\n').map((line, index, arr) => (
        <span key={index}>
          {line}
          {index < arr.length - 1 && <br />}
        </span>
      ))}
      {currentIndex < text.length && (
        <span className="inline-block w-0.5 h-5 bg-muted-foreground/50 ml-0.5 animate-pulse" />
      )}
    </span>
  );
};

export default TypewriterText;
