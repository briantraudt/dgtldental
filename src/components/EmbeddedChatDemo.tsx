
import { useChatDemo } from '@/hooks/useChatDemo';
import ChatWidget from './ChatWidget';

const EmbeddedChatDemo = () => {
  const {
    messages,
    message,
    isLoading,
    scrollAreaRef,
    inputRef,
    setMessage,
    handleSendMessage,
    handleKeyPress
  } = useChatDemo();

  return (
    <div className="space-y-4">
      <ChatWidget
        messages={messages}
        message={message}
        isLoading={isLoading}
        scrollAreaRef={scrollAreaRef}
        inputRef={inputRef}
        onMessageChange={setMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        onQuestionClick={setMessage}
      />
    </div>
  );
};

export default EmbeddedChatDemo;
