
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
    <div className="text-center text-gray-500 py-8">
      <p className="text-gray-600 mb-6">Welcome! Ask me about our practice:</p>
      <div className="space-y-3">
        {quickQuestions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-3 rounded-lg border border-blue-200 transition-colors"
          >
            "{question}"
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickQuestions;
