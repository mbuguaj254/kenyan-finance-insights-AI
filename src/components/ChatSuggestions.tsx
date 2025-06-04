
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ChatSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
  isLoading: boolean;
}

const ChatSuggestions = ({ onSelectSuggestion, isLoading }: ChatSuggestionsProps) => {
  const suggestions = [
    "How does the Finance Bill 2025 affect students?",
    "What are the new digital taxes for IT professionals?",
    "How will parents be impacted by the new VAT changes?",
    "What constitutional rights protect me from unfair taxation?",
    "How can I legally challenge aspects of this bill?",
    "What are the tax benefits for employed persons?",
    "How does this bill affect small business owners?",
    "What loopholes exist in the current draft?"
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
      <div className="md:col-span-2 text-center mb-2">
        <h3 className="text-sm font-medium text-gray-600 flex items-center justify-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Suggested Questions
        </h3>
      </div>
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="p-3 hover:bg-gray-50 cursor-pointer transition-colors border-gray-200"
          onClick={() => !isLoading && onSelectSuggestion(suggestion)}
        >
          <p className="text-sm text-gray-700">{suggestion}</p>
        </Card>
      ))}
    </div>
  );
};

export default ChatSuggestions;
