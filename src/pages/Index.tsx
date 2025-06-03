
import { useState } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ProfilingForm from "@/components/ProfilingForm";
import ImpactDisplay from "@/components/ImpactDisplay";
import EmailDraftModal from "@/components/EmailDraftModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserProfile, ImpactAnalysis, EmailDraft } from "@/types/user";
import { FinanceBillAnalyzer } from "@/services/financeBillAnalyzer";
import { Send, Scale, Info, MessageSquare } from "lucide-react";

interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'profiling' | 'analysis' | 'chat'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [impacts, setImpacts] = useState<ImpactAnalysis[]>([]);
  const [emailDraft, setEmailDraft] = useState<EmailDraft | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");

  const handleProfilingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    const analyzedImpacts = FinanceBillAnalyzer.analyzeImpact(profile);
    setImpacts(analyzedImpacts);
    const draft = FinanceBillAnalyzer.generateEmailDraft(profile, analyzedImpacts);
    setEmailDraft(draft);
    setCurrentStep('analysis');
  };

  const handleStartChat = () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      message: "Hello! I'm your AI advisor for the Finance Bill 2025. I'm here to help you understand how this legislation might affect you personally. As a morally upright Kenyan citizen, I'll guide you through your constitutional rights and help you engage with this bill constructively. How can I assist you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages([welcomeMessage]);
    setCurrentStep('chat');
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    // Simple AI response logic (in real implementation, this would be more sophisticated)
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      message: generateAIResponse(currentMessage),
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage, aiResponse]);
    setCurrentMessage("");
  };

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('tax') || message.includes('vat')) {
      return "The Finance Bill 2025 introduces several tax changes. Based on your profile, I can see specific impacts. For VAT, digital services will see an increase to 16%, which may affect your costs if you use online services regularly. Remember, Article 201 of our Constitution requires that taxation be fair and reasonable. Would you like me to explain how this specifically applies to your situation?";
    }
    
    if (message.includes('transport') || message.includes('fuel')) {
      return "Transport costs will be significantly affected by the KSh 5 per liter fuel levy increase. This violates the principle of fair taxation under Article 201 if it disproportionately affects low-income citizens. You have the right under Article 37 to petition government about this. Would you like help drafting a petition or understanding your legal options?";
    }
    
    if (message.includes('constitution') || message.includes('rights')) {
      return "Your constitutional rights are protected! Article 33 guarantees your freedom of expression, Article 37 gives you the right to petition, and Article 201 requires fair taxation. Chapter Six demands integrity from our leaders. You can challenge any provision that violates these principles through legal channels. What specific aspect would you like to explore?";
    }
    
    if (message.includes('business') || message.includes('entrepreneur')) {
      return "For businesses, the Finance Bill introduces corporate tax changes and turnover tax adjustments. However, there are potential legal strategies: small business reliefs, capital allowances, and export incentives. Your constitutional right to property (Article 40) protects your business interests. Would you like me to analyze specific business loopholes or exemptions?";
    }
    
    return "Thank you for your question. As your constitutional AI advisor, I'm here to help you understand the Finance Bill 2025 from a perspective of integrity and constitutional rights. Could you be more specific about what aspect of the bill you'd like to discuss? I can help with taxes, transport, property, business impacts, or your constitutional rights and legal options.";
  };

  const renderWelcomeScreen = () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold kenya-text-gradient">
          Finance Bill 2025 AI Advisor
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your constitutional guide to understanding how Kenya's Finance Bill 2025 affects you personally
        </p>
      </div>

      <Alert className="border-kenya-green bg-green-50">
        <Scale className="h-4 w-4" />
        <AlertDescription>
          <strong>Constitutional Protection:</strong> This analysis is grounded in Kenya's Constitution, 
          particularly Articles 33 (Freedom of Expression), 37 (Right to Petition), 201 (Fair Taxation), 
          and Chapter Six (Leadership Integrity).
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentStep('profiling')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-kenya-green rounded-lg flex items-center justify-center">
                <Info className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Get Personalized Analysis</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Answer a few questions about your situation to receive a tailored impact analysis 
              of the Finance Bill 2025.
            </p>
            <Button className="w-full bg-kenya-green hover:bg-kenya-green/90">
              Start Analysis
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleStartChat}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-kenya-red rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Chat with AI Advisor</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Ask specific questions about the Finance Bill and get constitutional guidance 
              from our AI advisor.
            </p>
            <Button className="w-full bg-kenya-red hover:bg-kenya-red/90">
              Start Conversation
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">What This Tool Provides:</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-kenya-green mb-2">Constitutional Analysis</h4>
            <p className="text-gray-600">Grounded in Kenya's Constitution and Chapter Six integrity principles</p>
          </div>
          <div>
            <h4 className="font-medium text-kenya-red mb-2">Personalized Impact</h4>
            <p className="text-gray-600">Tailored analysis based on your occupation, location, and lifestyle</p>
          </div>
          <div>
            <h4 className="font-medium text-kenya-black mb-2">Legal Strategies</h4>
            <p className="text-gray-600">Identify loopholes and lawful engagement opportunities</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderChatInterface = () => (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white">
        {chatMessages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
      
      <div className="flex gap-2 mt-4">
        <Input
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask about the Finance Bill..."
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} className="bg-kenya-green hover:bg-kenya-green/90">
          <Send className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="text-center mt-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep('welcome')}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'welcome' && renderWelcomeScreen()}
        
        {currentStep === 'profiling' && (
          <div className="max-w-4xl mx-auto">
            <ProfilingForm onComplete={handleProfilingComplete} />
          </div>
        )}
        
        {currentStep === 'analysis' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <ImpactDisplay impacts={impacts} />
            
            <div className="text-center space-y-4">
              <Button 
                onClick={() => setShowEmailModal(true)}
                className="bg-kenya-red hover:bg-kenya-red/90"
                size="lg"
              >
                <Send className="w-4 h-4 mr-2" />
                Draft Impact Email
              </Button>
              
              <div className="flex gap-4 justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleStartChat}
                >
                  Ask More Questions
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentStep('welcome')}
                >
                  Start Over
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {currentStep === 'chat' && renderChatInterface()}
      </main>

      {emailDraft && (
        <EmailDraftModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          emailDraft={emailDraft}
        />
      )}
    </div>
  );
};

export default Index;
