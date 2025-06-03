
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 p-4 animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-kenya-green rounded-full flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isUser 
          ? "bg-kenya-red text-white ml-auto" 
          : "bg-gray-100 text-gray-900"
      )}>
        <p className="text-sm leading-relaxed">{message}</p>
        {timestamp && (
          <p className="text-xs opacity-70 mt-1">{timestamp}</p>
        )}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 bg-kenya-red rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
