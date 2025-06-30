
interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const QuickQuestions = ({ onQuestionClick }: QuickQuestionsProps) => {
  const quickQuestions = [
    "What dental insurance plans do you accept?",
    "Are you accepting new patients?",
    "How much is a cleaning?",
    "Where are you located?",
    "What are your office hours?"
  ];

  return (
    <div className="text-center py-4">
      <p className="text-gray-600 mb-6 font-medium">Common questions about dental practices:</p>
      <div className="space-y-3">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="block w-full text-left text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50 p-4 rounded-xl border border-blue-200 transition-all duration-200 hover:shadow-md hover:border-blue-300 bg-white"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-full p-1.5">
                <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-medium">"{question}"</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestions;
