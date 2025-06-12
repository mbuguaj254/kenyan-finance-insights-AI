import { useState, useRef, useEffect } from "react";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import ChatSuggestions from "@/components/ChatSuggestions";
import ProfilingForm from "@/components/ProfilingForm";
import ImpactDisplay from "@/components/ImpactDisplay";
import EmailDraftModal from "@/components/EmailDraftModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserProfile, ImpactAnalysis, EmailDraft } from "@/types/user";
import { FinanceBillAnalyzer } from "@/services/financeBillAnalyzer";
import { AIChatService } from "@/services/aiChatService";
import { EmailService } from "@/services/emailService";
import { Send, Scale, Info, MessageSquare, ArrowLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DynamicAnalyzer } from "@/services/dynamicAnalyzer";

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
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleProfilingComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setIsLoading(true);
    
    try {
      // Use AI for dynamic analysis instead of static
      const analyzedImpacts = await DynamicAnalyzer.analyzePersonalizedImpact(profile);
      setImpacts(analyzedImpacts);
      
      // Generate AI-powered email draft
      const draft = await DynamicAnalyzer.generateEmailDraft(profile, analyzedImpacts);
      const updatedDraft = {
        ...draft,
        to: EmailService.getDefaultRecipients()
      };
      setEmailDraft(updatedDraft);
      
      toast({
        title: "Analysis Complete",
        description: "AI has generated your personalized impact analysis.",
      });
    } catch (error) {
      console.error('AI Analysis Error:', error);
      toast({
        title: "Analysis Error", 
        description: "Using fallback analysis. AI services may be temporarily unavailable.",
        variant: "destructive",
      });
      
      // Fallback to static analysis
      const fallbackImpacts = FinanceBillAnalyzer.analyzeImpact(profile);
      setImpacts(fallbackImpacts);
      const fallbackDraft = FinanceBillAnalyzer.generateEmailDraft(profile, fallbackImpacts);
      setEmailDraft({
        ...fallbackDraft,
        to: EmailService.getDefaultRecipients()
      });
    } finally {
      setIsLoading(false);
    }
    
    setCurrentStep('analysis');
  };

  const handleStartChat = async () => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      message: `Hello! I'm your AI advisor for Kenya's Finance Bill 2025. 

I'm here to help you understand how this legislation might affect you personally, grounded in our Constitution - particularly Articles 33 (Freedom of Expression), 37 (Right to Petition), 201 (Fair Taxation), and Chapter Six (Leadership & Integrity).

As a constitutionally-minded Kenyan citizen, I can help you:
- **Understand specific impacts** based on your situation
- **Identify your constitutional rights** and protections  
- **Explore legal strategies** and engagement options
- **Find loopholes** and advocacy opportunities

${userProfile ? `I can see you've completed your profile as a ${userProfile.occupation} with ${userProfile.incomeLevel} income. This will help me provide more targeted advice.` : 'Feel free to ask about any aspect of the Finance Bill 2025!'}

How can I assist you today?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString()
    };
    setChatMessages([welcomeMessage]);
    setCurrentStep('chat');
  };

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await AIChatService.sendMessage(message, userProfile || undefined);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: aiResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      toast({
        title: "AI Response Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: "I apologize, but I'm having trouble connecting right now. This might be due to API limits or connectivity issues. Please try your question again in a moment, or contact support if the problem persists.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString()
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([]);
    handleStartChat();
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
    <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex flex-col">
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentStep('welcome')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h2 className="text-xl font-semibold">Finance Bill 2025 AI Advisor</h2>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearChat}
          disabled={isLoading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col min-h-0">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto border border-gray-200 rounded-lg bg-white"
          >
            {chatMessages.length === 0 ? (
              <ChatSuggestions 
                onSelectSuggestion={handleSendMessage} 
                isLoading={isLoading}
              />
            ) : (
              chatMessages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg.message}
                  isUser={msg.isUser}
                  timestamp={msg.timestamp}
                />
              ))
            )}
            {isLoading && (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-kenya-green"></div>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <ChatInput 
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              placeholder="Ask about the Finance Bill 2025..."
            />
          </div>
        </div>

        {/* Sidebar with user profile info */}
        {userProfile && (
          <div className="w-80 space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Your Profile</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>Occupation:</strong> {userProfile.occupation}</div>
                  <div><strong>Income Level:</strong> {userProfile.incomeLevel}</div>
                  <div><strong>Location:</strong> {userProfile.location}</div>
                  <div><strong>Property Owner:</strong> {userProfile.propertyOwner ? 'Yes' : 'No'}</div>
                  <div><strong>Business Owner:</strong> {userProfile.businessOwner ? 'Yes' : 'No'}</div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-3"
                  onClick={() => setCurrentStep('analysis')}
                >
                  View Full Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
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
            {isLoading ? (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kenya-green mx-auto"></div>
                <p className="text-lg text-gray-600">AI is analyzing your personalized impact...</p>
                <p className="text-sm text-gray-500">Using advanced reasoning to provide detailed insights</p>
              </div>
            ) : (
              <>
                <ImpactDisplay impacts={impacts} />
                
                <div className="text-center space-y-4">
                  <Button 
                    onClick={() => setShowEmailModal(true)}
                    className="bg-kenya-red hover:bg-kenya-red/90"
                    size="lg"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Draft AI-Generated Email
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
              </>
            )}
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
