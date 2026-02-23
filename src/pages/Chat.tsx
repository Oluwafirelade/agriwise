import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Mic, MicOff, Bot, User, Loader2, Plus, Search,
  Sprout, Leaf, Bug, CloudSun, Menu, X, ArrowLeft, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getAgriculturalAdvice } from "@/lib/huggingface"; // Ported logic

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatHistory {
  id: string;
  title: string;
  date: string;
}

const suggestionCards = [
  { icon: Leaf, label: "Crop advice", prompt: "What crops grow best in Northern Nigeria during rainy season?" },
  { icon: Bug, label: "Pest control", prompt: "How do I prevent fall armyworm in my maize farm?" },
  { icon: CloudSun, label: "Weather tips", prompt: "When is the best time to plant cassava?" },
  { icon: Sprout, label: "Soil health", prompt: "How can I improve my soil fertility naturally?" },
];

const chatHistory: ChatHistory[] = [
  { id: "1", title: "Cassava leaf yellowing", date: "Today" },
  { id: "2", title: "Maize planting season", date: "Today" },
];

// Helper for Web Speech API language codes
const getLanguageCode = (lang: string) => {
  const map: Record<string, string> = { en: "en-US", ha: "ha-NG", yo: "yo-NG", ig: "ig-NG" };
  return map[lang] || "en-US";
};

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasMessages = messages.length > 0;

  // 1. Voice Recognition Setup (Ported)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setApiError(null);
      recognitionRef.current.lang = getLanguageCode(selectedLanguage);
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Real AI Integration (Ported)
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setApiError(null);

    try {
      // Calling your Hugging Face logic
      const aiResponse = await getAgriculturalAdvice(messageText, selectedLanguage);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setApiError("I couldn't reach the advisor. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar logic remains same */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="p-4 border-b border-border flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Sprout className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">AgriAdvisor</span>
          </button>
        </div>
        <div className="p-3"><Button variant="outline" className="w-full justify-start gap-2" onClick={() => setMessages([])}><Plus className="w-4 h-4" />New Chat</Button></div>
        <div className="flex-1 overflow-y-auto px-3">
          {chatHistory.map(chat => (
            <button key={chat.id} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted truncate">{chat.title}</button>
          ))}
        </div>
        <div className="p-3 border-t"><LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} /></div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden"><Menu className="w-5 h-5" /></button>
          <h2 className="font-semibold text-sm">{hasMessages ? "AgriAdvisor Chat" : ""}</h2>
          <button onClick={() => navigate("/")} className="flex items-center gap-1 text-sm"><ArrowLeft className="w-4 h-4" /> Home</button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center px-4">
              <h1 className="text-3xl font-bold mb-10">What can I help you with?</h1>
              <div className="max-w-2xl w-full">
                <div className="relative mb-8 bg-muted border border-border rounded-2xl p-3 flex items-center">
                   <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about farming..."
                    className="flex-1 bg-transparent outline-none resize-none text-sm"
                    rows={1}
                  />
                  <button onClick={toggleRecording} className={`mx-2 ${isRecording ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} variant="hero" size="icon" className="rounded-xl"><Send className="w-4 h-4" /></Button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {suggestionCards.map((card) => (
                    <button key={card.label} onClick={() => handleSend(card.prompt)} className="flex flex-col items-start gap-2 p-4 rounded-xl border bg-card hover:bg-muted text-left">
                      <card.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{card.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${m.role === "user" ? "bg-secondary/20" : "bg-primary/10"}`}>
                    {m.role === "user" ? <User className="w-4 h-4 text-secondary" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>
                    <p className="text-sm">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />}
              {apiError && <div className="text-destructive text-xs flex items-center gap-1 justify-center"><AlertCircle className="w-3 h-3" />{apiError}</div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {hasMessages && (
          <div className="p-4 border-t">
            <div className="max-w-3xl mx-auto flex items-center gap-3 bg-muted rounded-2xl px-4 py-3">
              <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent outline-none text-sm resize-none" rows={1} placeholder="Follow-up question..." />
              <button onClick={toggleRecording} className={isRecording ? "text-destructive" : "text-muted-foreground"}>
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} variant="hero" size="icon" className="w-9 h-9"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;