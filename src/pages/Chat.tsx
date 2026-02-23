import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Mic, MicOff, Bot, User, Loader2, Plus,
  Sprout, Leaf, Bug, CloudSun, Menu, ArrowLeft, AlertCircle
} from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/LanguageSelector";
import { getAgriculturalAdvice } from "@/lib/huggingface"; 

// IMPORTANT: Adjust this path to wherever your translations.ts file lives!
import { getTranslation, LanguageCode } from "@/lib/translations"; 

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

// Kept suggestion cards here since they map React Icons to specific multi-language strings
const suggestionCards = [
  { 
    icon: Leaf, 
    labels: { en: "Yellowing leaves", ha: "Ganyen rawaya", yo: "Ewé pupa", ig: "Akwụkwọ odo odo" },
    prompts: { en: "My cassava leaves are turning yellow", ha: "Ganyen rogo na ya zama rawaya", yo: "Ewé ẹ̀gẹ́ mi di pupa", ig: "Akwụkwọ akpụ m na-acha odo odo" }
  },
  { 
    icon: Bug, 
    labels: { en: "Pest control", ha: "Kula da kwari", yo: "Iṣakoso kokoro", ig: "Nchịkwa ụmụ ahụhụ" },
    prompts: { en: "How to prevent tomato blight?", ha: "Yadda ake hana cutar tumatir?", yo: "Bawo ni lati dena arun tomati?", ig: "Kedụ ka m ga-esi gbochie ọrịa tomato?" }
  },
  { 
    icon: CloudSun, 
    labels: { en: "Planting season", ha: "Lokacin dasa", yo: "Akoko gbingbin", ig: "Oge ịkụ ihe" },
    prompts: { en: "When should I plant maize?", ha: "Yaushe zan dasa masara?", yo: "Nigba wo ni mo yẹ ki n gbin agbado?", ig: "Kedu oge m ga-akụ ọka?" }
  },
  { 
    icon: Sprout, 
    labels: { en: "Best fertilizer", ha: "Mafi kyawun taki", yo: "Ajile ti o dara julọ", ig: "Nchara kacha mma" },
    prompts: { en: "Best fertilizer for plantain", ha: "Mafi kyawun takin ayaba", yo: "Ajile ti o dara julọ fun ọgẹdẹ", ig: "Nchara kacha mma maka unere" }
  },
];

const chatHistory: ChatHistory[] = [
  { id: "1", title: "Cassava leaf yellowing", date: "Today" },
  { id: "2", title: "Maize planting season", date: "Today" },
];

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
  
  // Notice the state is now explicitly typed as LanguageCode
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const hasMessages = messages.length > 0;

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

  const handleGoHome = () => {
    navigate("/");
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50); 
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden"> 
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Area */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex-shrink-0 bg-muted/30 border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:-ml-72"
        }`}
      >
        <div className="h-14 px-3 flex items-center gap-2">
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="p-2 text-muted-foreground bg-card hover:bg-muted border border-border rounded-full transition-colors shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleGoHome} 
            className="font-display font-bold text-lg text-foreground tracking-wide ml-1"
          >
            {getTranslation(selectedLanguage, "headerBrand")}
          </button>
        </div>

        <div className="px-3 py-2">
          <button 
            onClick={() => setMessages([])}
            className="flex items-center gap-3 bg-card hover:bg-muted border border-border px-4 py-2.5 rounded-full text-sm font-medium transition-colors w-max shadow-sm"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
            {getTranslation(selectedLanguage, "chatNewChat")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 mt-4">
          <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">
            {getTranslation(selectedLanguage, "chatRecent")}
          </p>
          {chatHistory.map(chat => (
            <button key={chat.id} className="w-full text-left px-4 py-2.5 rounded-full text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors truncate">
              {chat.title}
            </button>
          ))}
        </div>

        <div className="p-4">
          <LanguageSelector 
            selectedLanguage={selectedLanguage} 
            onLanguageChange={(lang) => setSelectedLanguage(lang as LanguageCode)} 
          />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-14 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            {!sidebarOpen && (
              <>
                <button 
                  onClick={() => setSidebarOpen(true)} 
                  className="p-2 text-muted-foreground bg-muted hover:bg-card border border-border rounded-full transition-colors shadow-sm"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <span className="font-display font-bold text-lg text-foreground tracking-wide ml-1">
                  {getTranslation(selectedLanguage, "headerBrand")}
                </span>
              </>
            )}
          </div>
          
          <button 
            onClick={handleGoHome} 
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" /> Home
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center px-4 md:px-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
                {getTranslation(selectedLanguage, "chatWelcome")}
              </h1>
              <div className="max-w-2xl w-full">
                <div className="relative mb-6 md:mb-8 bg-muted border border-border rounded-3xl p-2 md:p-3 flex items-center shadow-sm">
                   <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={getTranslation(selectedLanguage, "chatPlaceholderAsk")}
                    className="flex-1 bg-transparent outline-none resize-none text-sm md:text-base px-3 py-2 text-foreground"
                    rows={1}
                  />
                  <button onClick={toggleRecording} className={`mx-1 p-2 rounded-full hover:bg-background transition-colors ${isRecording ? "text-destructive animate-pulse" : "text-muted-foreground"}`}>
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} variant="hero" size="icon" className="rounded-full w-10 h-10 flex-shrink-0"><Send className="w-4 h-4" /></Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestionCards.map((card, index) => {
                    const label = card.labels[selectedLanguage as keyof typeof card.labels] || card.labels.en;
                    const prompt = card.prompts[selectedLanguage as keyof typeof card.prompts] || card.prompts.en;
                    
                    return (
                      <button key={index} onClick={() => handleSend(prompt)} className="flex flex-col items-start gap-2 p-4 rounded-2xl border bg-card hover:bg-muted text-left transition-colors">
                        <card.icon className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium text-foreground">{label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${m.role === "user" ? "bg-secondary/20" : "bg-primary/10"}`}>
                    {m.role === "user" ? <User className="w-4 h-4 text-secondary" /> : <Bot className="w-4 h-4 text-primary" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${m.role === "user" ? "bg-secondary text-secondary-foreground rounded-br-md" : "bg-muted rounded-bl-md"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">{getTranslation(selectedLanguage, "chatThinking")}</span>
                    </div>
                  </div>
                </div>
              )}
              {apiError && <div className="text-destructive text-xs flex items-center gap-1 justify-center"><AlertCircle className="w-3 h-3" />{apiError}</div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {hasMessages && (
          <div className="p-3 md:p-4 bg-background">
            <div className="max-w-3xl mx-auto flex items-center gap-2 md:gap-3 bg-muted border border-border rounded-3xl px-3 md:px-4 py-2 md:py-3 shadow-sm">
              <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={handleKeyDown} 
                className="flex-1 bg-transparent outline-none text-sm md:text-base resize-none text-foreground py-1" 
                rows={1} 
                placeholder={getTranslation(selectedLanguage, "chatPlaceholderFollowUp")} 
              />
              <button onClick={toggleRecording} className={`p-2 flex-shrink-0 rounded-full hover:bg-background transition-colors ${isRecording ? "text-destructive" : "text-muted-foreground"}`}>
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} variant="hero" size="icon" className="w-10 h-10 rounded-full flex-shrink-0"><Send className="w-4 h-4" /></Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;