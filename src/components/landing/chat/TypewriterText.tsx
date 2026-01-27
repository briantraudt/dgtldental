import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

const TypewriterText = ({ text, speed = 60, onComplete }: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      // Add a longer pause after newlines
      const isAfterNewline = currentIndex > 0 && text[currentIndex - 1] === '\n';
      const delay = isAfterNewline ? 600 : speed;
      
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

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
