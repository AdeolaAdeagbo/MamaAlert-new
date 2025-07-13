import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { usePregnancyProgress } from "@/hooks/usePregnancyProgress";
import { 
  MessageCircle, 
  Send, 
  Volume2, 
  Loader2, 
  Heart,
  Stethoscope,
  Wifi,
  WifiOff
} from "lucide-react";

type ChatMessage = Tables<'ai_nurse_chats'>;

interface OfflineMessage {
  id: string;
  message: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What are the signs of labor?",
  "What foods should I avoid during pregnancy?",
  "I feel dizzy, what should I do?",
  "How can I manage morning sickness?",
  "What exercises are safe during pregnancy?",
  "How much weight should I gain?",
  "What are the warning signs I should watch for?",
  "How can I prepare for breastfeeding?"
];

export const AINurse = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentWeek } = usePregnancyProgress(user?.id || '');
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineMessages, setOfflineMessages] = useState<OfflineMessage[]>([]);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load chat history
  useEffect(() => {
    if (user?.id) {
      loadChatHistory();
    }
  }, [user?.id]);

  // Sync offline messages when back online
  useEffect(() => {
    if (isOnline && offlineMessages.length > 0) {
      syncOfflineMessages();
    }
  }, [isOnline, offlineMessages]);

  const loadChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_nurse_chats')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      toast({
        title: "Error",
        description: "Failed to load chat history.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const syncOfflineMessages = async () => {
    for (const offlineMsg of offlineMessages) {
      await handleSendMessage(offlineMsg.message, false);
    }
    setOfflineMessages([]);
    localStorage.removeItem('mama_alert_offline_messages');
  };

  const saveOfflineMessage = (message: string) => {
    const newOfflineMessage: OfflineMessage = {
      id: Date.now().toString(),
      message,
      timestamp: new Date()
    };
    
    const updatedOfflineMessages = [...offlineMessages, newOfflineMessage];
    setOfflineMessages(updatedOfflineMessages);
    localStorage.setItem('mama_alert_offline_messages', JSON.stringify(updatedOfflineMessages));
    
    toast({
      title: "Message Saved",
      description: "Your message will be sent when you're back online.",
    });
  };

  const handleSendMessage = async (messageText?: string, showToast = true) => {
    const message = messageText || currentMessage.trim();
    if (!message || !user?.id) return;

    if (!isOnline) {
      saveOfflineMessage(message);
      setCurrentMessage("");
      return;
    }

    setIsLoading(true);
    setCurrentMessage("");

    try {
      // Call AI nurse function
      const { data, error } = await supabase.functions.invoke('ai-nurse-chat', {
        body: { 
          message,
          pregnancyWeek: currentWeek 
        }
      });

      if (error) throw error;

      const aiResponse = data.response || data.fallbackResponse;

      // Save to database
      const { data: chatData, error: saveError } = await supabase
        .from('ai_nurse_chats')
        .insert({
          user_id: user.id,
          user_message: message,
          ai_response: aiResponse
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setMessages(prev => [...prev, chatData]);
      
      if (showToast) {
        toast({
          title: "Response received",
          description: "MamaAlert AI Nurse has responded to your question.",
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Provide fallback response for offline capability
      const fallbackResponse = getFallbackResponse(message);
      const fallbackChat: ChatMessage = {
        id: Date.now().toString(),
        user_id: user.id,
        user_message: message,
        ai_response: fallbackResponse,
        response_audio_url: null,
        created_at: new Date().toISOString(),
        is_synced: false
      };
      
      setMessages(prev => [...prev, fallbackChat]);
      
      toast({
        title: "Offline Response",
        description: "Using offline guidance. Please consult your healthcare provider.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('labor') || lowerMessage.includes('contractions')) {
      return "Signs of labor include regular contractions, water breaking, and bloody show. If you experience these symptoms, contact your healthcare provider immediately or go to the hospital.";
    }
    
    if (lowerMessage.includes('dizzy') || lowerMessage.includes('faint')) {
      return "Dizziness during pregnancy can be normal but concerning. Sit or lie down, drink water, and eat something. If dizziness persists or is severe, contact your healthcare provider immediately.";
    }
    
    if (lowerMessage.includes('food') || lowerMessage.includes('eat')) {
      return "Avoid raw fish, unpasteurized dairy, raw eggs, and limit caffeine. Eat plenty of fruits, vegetables, whole grains, and lean proteins. Always consult your healthcare provider for personalized advice.";
    }
    
    return "I'm currently offline, but please remember to take your prenatal vitamins, stay hydrated, get regular prenatal care, and contact your healthcare provider with any concerns. For emergencies, go to the nearest hospital immediately.";
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Get all available voices and log them for debugging
      const voices = window.speechSynthesis.getVoices();
      console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
      
      // Prioritize English voices that sound more African/Nigerian
      const preferredVoice = voices.find(voice => 
        // First try specific African English voices
        (voice.name.includes('Nigerian') || 
         voice.name.includes('Nigeria') ||
         voice.lang === 'en-NG' ||
         voice.name.includes('African') ||
         voice.name.includes('Ghana') ||
         voice.name.includes('Kenya') ||
         voice.lang === 'en-GH' ||
         voice.lang === 'en-KE' ||
         voice.lang === 'en-ZA' ||
         voice.name.includes('South Africa')) && 
        voice.lang.startsWith('en')
      ) || voices.find(voice => 
        // Try American English females (closer to African accent than British)
        voice.lang === 'en-US' && 
        voice.name.toLowerCase().includes('female')
      ) || voices.find(voice => 
        // Try any American English voice (better than British)
        voice.lang === 'en-US'
      ) || voices.find(voice => 
        // Fallback to any English voice except British/UK
        voice.lang.startsWith('en') && 
        !voice.name.toLowerCase().includes('british') &&
        !voice.name.toLowerCase().includes('uk') &&
        !voice.lang.includes('GB')
      ) || voices.find(voice => 
        // Final fallback to any English voice
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log('Selected voice:', preferredVoice.name, preferredVoice.lang);
      }
      
      // Enhanced speech parameters to mimic Nigerian English characteristics
      utterance.rate = 0.75; // Slower pace typical of Nigerian English
      utterance.pitch = 1.3; // Higher pitch for feminine Nigerian voice
      utterance.volume = 0.9;
      
      // Add slight pauses for natural Nigerian speech pattern
      const enhancedText = text
        .replace(/\./g, '. ') // Add pause after periods
        .replace(/,/g, ', ') // Add pause after commas
        .replace(/\?/g, '? ') // Add pause after questions
        .replace(/!/g, '! '); // Add pause after exclamations
      
      utterance.text = enhancedText;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        toast({
          title: "Speech Error",
          description: "Unable to play audio. Please check your device settings.",
          variant: "destructive"
        });
      };
      
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported on this device.",
        variant: "destructive"
      });
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <Card className="border-rose-200 bg-gradient-to-r from-rose-50 to-pink-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-rose-500 text-white rounded-full">
                <Stethoscope className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-rose-700">MamaAlert AI Nurse</CardTitle>
                <p className="text-sm text-rose-600">Your 24/7 pregnancy companion</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-xs text-muted-foreground">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-rose-600">
            Ask me anything about your pregnancy journey. I'm here to provide guidance, 
            support, and answers to your questions - specially tailored for expecting mothers in Nigeria.
          </p>
          {currentWeek > 0 && (
            <p className="text-xs text-rose-500 mt-2 flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Currently at week {currentWeek} of your pregnancy
            </p>
          )}
        </CardContent>
      </Card>

      {/* Suggested Questions */}
      {messages.length === 0 && !isLoadingHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Popular Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-left justify-start h-auto p-3 text-xs"
                  onClick={() => handleSendMessage(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Card className="flex flex-col h-96">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            Conversation History
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
          <ScrollArea className="h-full">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="bg-rose-500 text-white p-3 rounded-lg max-w-xs md:max-w-md">
                        <p className="text-sm">{msg.user_message}</p>
                      </div>
                    </div>
                    
                    {/* AI Response */}
                    <div className="flex justify-start">
                      <div className="bg-gray-100 p-3 rounded-lg max-w-xs md:max-w-md">
                        <p className="text-sm text-gray-800">{msg.ai_response}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => isSpeaking ? stopSpeech() : handleTextToSpeech(msg.ai_response)}
                            className="h-6 px-2 text-xs"
                          >
                            <Volume2 className="h-3 w-3 mr-1" />
                            {isSpeaking ? 'Stop' : 'Listen'}
                          </Button>
                          {!msg.is_synced && (
                            <span className="text-xs text-amber-600">Offline</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {offlineMessages.map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className="flex justify-end">
                      <div className="bg-amber-500 text-white p-3 rounded-lg max-w-xs md:max-w-md">
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-75 mt-1">Pending sync...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask MamaAlert AI Nurse anything about your pregnancy..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !currentMessage.trim()}
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>

      {!isOnline && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800">
              You're currently offline. Your messages will be saved and sent when you reconnect to the internet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
