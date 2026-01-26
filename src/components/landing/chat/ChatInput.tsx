import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
  placeholder: string;
  onSubmit: (value: string) => void;
  isSubmitting?: boolean;
  type?: 'text' | 'email' | 'url';
}

const ChatInput = ({ placeholder, onSubmit, isSubmitting = false, type = 'text' }: ChatInputProps) => {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim() || isSubmitting) return;
    onSubmit(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 animate-fade-in">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isSubmitting}
        className="flex-1 px-5 py-3.5 bg-white border border-gray-200 rounded-2xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 focus:ring-4 focus:ring-gray-100 transition-all disabled:opacity-50"
      />
      <Button
        type="submit"
        disabled={!value.trim() || isSubmitting}
        size="icon"
        className="w-12 h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:opacity-100 transition-all shadow-sm"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <ArrowUp className="w-5 h-5 text-white" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;
