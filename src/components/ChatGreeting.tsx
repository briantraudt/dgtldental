
const ChatGreeting = () => {
  return (
    <div className="flex justify-start mb-6">
      <div className="bg-white rounded-2xl px-5 py-4 max-w-[85%] shadow-sm border border-gray-100">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 rounded-full p-2 mt-1">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p className="text-gray-800 font-medium">Hi there! I'm a demo AI assistant for dental practices.</p>
            <p className="text-gray-600 text-sm mt-1">Ask me anything about your dental practice—services, insurance, hours, or location. I'm available 24/7.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGreeting;
