
interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void;
}

const QuickQuestions = ({ onQuestionClick }: QuickQuestionsProps) => {
  const quickQuestions = [
    "What are your office hours?",
    "Where are you located?",
    "What services do you offer?",
    "Do you accept my insurance?",
    "How do I schedule an appointment?"
  ];

  return (
    <div className="text-center py-4">
      <p className="text-gray-600 mb-6 font-medium">Common questions about our practice:</p>
      <div className="space-y-3">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="block w-full text-left text-sm text-teal-700 hover:text-teal-800 hover:bg-teal-50 p-4 rounded-xl border border-teal-200 transition-all duration-200 hover:shadow-md hover:border-teal-300 bg-white"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-teal-100 rounded-full p-1.5">
                <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
