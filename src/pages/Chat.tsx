import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send, Mic, MicOff, Bot, User, Loader2, Plus,
  Sprout, Leaf, Bug, CloudSun, Menu, ArrowLeft, AlertCircle, MessageSquare,
  LogIn, LogOut, Trash2, Volume2, VolumeX, Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/shared/LanguageSelector";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

// IMPORTANT: Adjust this path to wherever your translations.ts file lives!
import { getTranslation, LanguageCode } from "@/lib/translations"; 
import { getAgriculturalAdvice } from "@/lib/huggingface"; 

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date | string; 
}

interface ChatSession {
  id: string;
  title: string;
  date: string;
  messages: Message[];
}

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
    labels: { en: "Planting season", ha: "Lokacin dasa", yo: "Akoko gbingbin", ig: "Oge ịkụihe" },
    prompts: { en: "When should I plant maize?", ha: "Yaushe zan dasa masara?", yo: "Nigba wo ni mo yẹ ki n gbin agbado?", ig: "Kedu oge m ga-akụ ọka?" }
  },
  { 
    icon: Sprout, 
    labels: { en: "Best fertilizer", ha: "Mafi kyawun taki", yo: "Ajile ti o dara julọ", ig: "Nchara kacha mma" },
    prompts: { en: "Best fertilizer for plantain", ha: "Mafi kyawun takin ayaba", yo: "Ajile ti o dara julọ fun ọgẹdẹ", ig: "Nchara kacha mma maka unere" }
  },
];

const uiLabels = {
  readAloud: { en: "Read aloud", ha: "Karanta a fili", yo: "Ka soke", ig: "Gụọ ya n'olu" },
  stopReading: { en: "Stop reading", ha: "Daina karantawa", yo: "Duro kika", ig: "Kwụsị ịgụ" },
  stopGenerating: { en: "Stop generating", ha: "Dakatar", yo: "Dáwọ́ dúró", ig: "Kwụsị" }
};

const getLanguageCode = (lang: string) => {
  const map: Record<string, string> = { en: "en-US", ha: "ha-NG", yo: "yo-NG", ig: "ig-NG" };
  return map[lang] || "en-US";
};

const detectLanguage = (text: string): LanguageCode | null => {
  const lowerText = text.toLowerCase();
  
  if (/[ẹọṣ]/i.test(lowerText)) return "yo";
  if (/[ịụñ]/i.test(lowerText)) return "ig";
  if (/[ƙɓɗƴ]/i.test(lowerText)) return "ha";

 const yorubaWords = [
    'bawo', 'kini', 'ese', 'jowo', 'ejo', 'nibo', 'awon', 'eyi', 
    'agbado', 'ewe', 'ẹgẹ', 'ege', 'tomati', 'oko', 'omi', 'ile', 'ilẹ', 'irugbin', 
    'ajile', 'kokoro', 'arun', 'ojo', 'gbin', 'ogede', 'ọgẹdẹ', 'isu', 'iṣu', 
    'igi', 'eruku', 'oorun', 'ikore', 'ewekọ', 'ewa', 'iresi', 'ata', 'alubosa', 
    'eja', 'eran', 'maluu', 'ewure', 'adie', 'gbingbin', 'tutu', 'gbigbe', 'rirun'
  ];

  const igboWords = [
    'kedu', 'biko', 'nno', 'daalu', 'olee', 'maka', 'nke', 'akwukwo', 
    'akwụkwọ', 'ugbo', 'akpu', 'akpụ', 'unere', 'ala', 'mmiri', 'osisi', 'ahuhu', 
    'ahụhụ', 'oria', 'ọrịa', 'ozuzo', 'iku', 'ịkụ', 'ji', 'oka', 'ọka', 
    'anwu', 'ifufe', 'aja', 'mkpuru', 'iwewe', 'ahia', 'ede', 'agwa', 'osikapa', 
    'ose', 'yabasi', 'yabasị', 'azu', 'anu', 'ehi', 'ewu', 'okuko', 'okochi', 
    'ọkọchị', 'udu'
  ];

  const hausaWords = [
    'ina', 'yaya', 'sannu', 'godiya', 'don', 'gaskiya', 'kuma', 'wannan', 'cikin', 
    'ganyen', 'rogo', 'masara', 'kasa', 'ruwa', 'shuka', 'taki', 'kwari', 
    'cuta', 'sama', 'doya', 'tumatur', 'dasa', 'noma', 'amfanin', 'yadda', 
    'rana', 'iska', 'zafi', 'sanyi', 'girbi', 'kasuwa', 'wake', 'shinkafa', 
    'barkono', 'albasa', 'kifi', 'nama', 'saniya', 'akuya', 'kaza', 'rani', 
    'damina', 'iri', 'gona'
  ];

  const englishWords = [
    'how', 'what', 'why', 'when', 'the', 'is', 'are', 'you', 'my', 'i', 'to', 
    'plant', 'soil', 'prevent', 'farm', 'crop', 'fertilizer', 'water', 'rain', 
    'harvest', 'pest', 'disease', 'cassava', 'maize', 'yam', 'leaf', 'leaves', 
    'yellow', 'seed', 'grow', 'it', 'this', 'that', 'have', 'do', 'for', 'with', 
    'on', 'at', 'by', 'from', 'an', 'be', 'can', 'will', 'your', 'we', 'they', 
    'not', 'no', 'tree', 'sun', 'wind', 'market', 'beans', 'rice', 'pepper', 
    'onion', 'fish', 'meat', 'cow', 'goat', 'chicken', 'dry', 'season', 'wet', 
    'weather', 'climate', 'yield', 'weed', 'bug'
  ];

  const words = lowerText.replace(/[^\p{L}\s]/gu, '').split(/\s+/);
  let scores = { en: 0, ha: 0, yo: 0, ig: 0 };
  
  words.forEach(word => {
    if (englishWords.includes(word)) scores.en++;
    if (hausaWords.includes(word)) scores.ha++;
    if (yorubaWords.includes(word)) scores.yo++;
    if (igboWords.includes(word)) scores.ig++;
  });

  const maxScore = Math.max(scores.en, scores.ha, scores.yo, scores.ig);
  if (maxScore === 0) return null; 
  
  if (maxScore === scores.yo) return 'yo';
  if (maxScore === scores.ig) return 'ig';
  if (maxScore === scores.ha) return 'ha';
  return 'en';
};

const Chat = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("agriadvisor_sessions");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("agriadvisor_sessions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) return parsed[0].id; 
      }
    }
    return null;
  });

  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>("en");
  
  const [isAutoDetect, setIsAutoDetect] = useState(true);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];
  const hasMessages = messages.length > 0;

  useEffect(() => {
    localStorage.setItem("agriadvisor_sessions", JSON.stringify(sessions));
  }, [sessions]);

  // Clean up speech synthesis on component unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  };

  // --- NATIVE BROWSER TTS IMPLEMENTATION ---
  const generateAndPlayTTS = (messageContent: string, messageId: string) => {
    if (!('speechSynthesis' in window)) {
      setApiError("Text-to-speech is not supported in this browser.");
      return;
    }

    // If already speaking THIS message, pause/stop it
    if (speakingId === messageId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    // Cancel any current speech before starting a new one
    window.speechSynthesis.cancel();
    setSpeakingId(messageId);
    setApiError(null);

    try {
      const utterance = new SpeechSynthesisUtterance(messageContent);
      utterance.lang = getLanguageCode(selectedLanguage);
      
      utterance.onend = () => {
        setSpeakingId(null);
      };
      
      utterance.onerror = (event) => {
        // Ignore the error if it was manually canceled by the user
        if (event.error !== 'canceled') {
          console.error("TTS Error:", event);
          setApiError("Error playing audio.");
        }
        setSpeakingId(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("TTS Error:", error);
      setApiError("I couldn't generate the audio. Please check your browser settings.");
      setSpeakingId(null);
    }
  };

  const toggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setApiError("Voice recognition is not supported in this browser. Please type your message.");
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    setApiError(null);
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getLanguageCode(selectedLanguage);

    recognition.onstart = () => {
      setIsRecording(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeakingId(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const newText = input ? `${input} ${transcript}` : transcript;
      setInput(newText);
      
      if (isAutoDetect) {
        const detected = detectLanguage(newText);
        if (detected && detected !== selectedLanguage) {
          setSelectedLanguage(detected);
        }
      }
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    recognition.onerror = (event: any) => {
      setIsRecording(false);
      if (event.error === 'not-allowed') {
        setApiError("Microphone permission denied. Please allow mic access in your browser settings.");
      } else if (event.error !== 'aborted') {
        setApiError(`Microphone error: ${event.error}`);
      }
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (err) {
      setIsRecording(false);
      setApiError("Could not start microphone. It might already be in use.");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setApiError(null);
    if (window.innerWidth < 1024) setSidebarOpen(false); 
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setApiError(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, idToDelete: string) => {
    e.stopPropagation(); 
    setSessions((prev) => prev.filter(session => session.id !== idToDelete));
    if (currentSessionId === idToDelete) {
      setCurrentSessionId(null);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    
    if (isAutoDetect) {
      const detected = detectLanguage(val);
      if (detected && detected !== selectedLanguage) {
        setSelectedLanguage(detected);
      }
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingId(null);

    let targetSessionId = currentSessionId;
    let isNewSession = false;

    if (!targetSessionId) {
      targetSessionId = Date.now().toString();
      isNewSession = true;
      setCurrentSessionId(targetSessionId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setSessions((prev) => {
      if (isNewSession) {
        return [{
          id: targetSessionId!,
          title: messageText.length > 30 ? messageText.substring(0, 30) + "..." : messageText,
          date: new Date().toLocaleDateString(),
          messages: [userMessage]
        }, ...prev];
      }
      return prev.map(s => 
        s.id === targetSessionId 
          ? { ...s, messages: [...s.messages, userMessage] } 
          : s
      );
    });

    setInput("");
    setIsLoading(true);
    setApiError(null);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // NOTE: Passing selectedLanguage instead of "auto" to respect the dropdown choice
      const result = await getAgriculturalAdvice(messageText, selectedLanguage, false, controller.signal);
      const aiResponse = result.response;
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };
      
      setSessions((prev) => prev.map(s => 
        s.id === targetSessionId 
          ? { ...s, messages: [...s.messages, aiMessage] } 
          : s
      ));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log("Request aborted by user");
        return; 
      }
      setApiError("I couldn't reach the advisor. Please check your connection.");
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex-shrink-0 bg-background border-r border-border flex flex-col transition-all duration-300 ease-in-out ${
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
            onClick={handleNewChat}
            className="flex items-center gap-3 bg-card hover:bg-muted border border-border px-4 py-2.5 rounded-full text-sm font-medium transition-colors w-max shadow-sm"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
            {getTranslation(selectedLanguage, "chatNewChat")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 mt-4 space-y-1">
          <p className="px-3 text-xs font-semibold text-muted-foreground mb-2">
            {getTranslation(selectedLanguage, "chatRecent")}
          </p>
          
          {sessions.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground/60 italic">
              No recent chats
            </div>
          ) : (
            sessions.map(session => (
              <div key={session.id} className="relative group flex items-center">
                <button 
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-2xl text-sm transition-colors pr-10 ${
                    currentSessionId === session.id 
                      ? "bg-primary/10 text-primary font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{session.title}</span>
                </button>
                
                <button
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="absolute right-2 p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded-full transition-all focus:opacity-100"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* --- LANGUAGE TOGGLE & AUTO-DETECT SWITCH IN SIDEBAR FOOTER --- */}
        <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-medium text-muted-foreground">
              Auto-detect language
            </span>
            <button
              onClick={() => setIsAutoDetect(!isAutoDetect)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
                isAutoDetect ? 'bg-primary' : 'bg-muted-foreground/40'
              }`}
              title="Toggle automatic language detection"
            >
              <span 
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  isAutoDetect ? 'translate-x-4' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
          <LanguageSelector 
            selectedLanguage={selectedLanguage} 
            onLanguageChange={(lang) => setSelectedLanguage(lang as LanguageCode)} 
          />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-background">
        <header className="h-14 flex items-center justify-between px-3 border-b border-border/30">
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
          
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <button 
              onClick={handleGoHome} 
              className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full hover:bg-muted"
            >
              <ArrowLeft className="w-4 h-4" /> Home
            </button>
            <Button
              size="sm"
              className="rounded-full px-4 flex items-center gap-2 font-medium"
              onClick={user ? logout : () => navigate('/login')}
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4 hidden sm:block" />
                  <span className="truncate max-w-[100px]">{user.displayName || user.email}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 hidden sm:block" /> Login
                </>
              )}
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            <div className="h-full flex flex-col items-center justify-center px-4 md:px-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center text-foreground">
                {getTranslation(selectedLanguage, "chatWelcome")}
              </h1>
              <div className="max-w-2xl w-full">
                
                {/* WELCOME SCREEN INPUT */}
                <div className="relative mb-6 md:mb-8 bg-muted border border-border rounded-3xl p-3 md:p-4 flex items-end shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-shadow gap-3">
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={getTranslation(selectedLanguage, "chatPlaceholderAsk")}
                    className="flex-1 bg-transparent outline-none resize-none text-sm md:text-base px-2 py-2.5 text-foreground max-h-32 overflow-y-auto w-full"
                    rows={1}
                  />
                  
                  <div className="flex items-center gap-3 shrink-0">
                    <button 
                      type="button"
                      onClick={toggleRecording} 
                      className={`relative z-10 w-10 h-10 flex items-center justify-center shrink-0 rounded-full transition-all shadow-sm ${
                        isRecording 
                          ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse ring-2 ring-red-500/50" 
                          : "bg-background text-foreground border border-border hover:bg-secondary"
                      }`}
                      title="Voice to text"
                    >
                      {isRecording ? <MicOff className="w-5 h-5 stroke-[2.5]" /> : <Mic className="w-5 h-5 stroke-[2.5]" />}
                    </button>

                    <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} variant="default" size="icon" className="w-10 h-10 rounded-full shrink-0 shadow-sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestionCards.map((card, index) => {
                    const label = card.labels[selectedLanguage as keyof typeof card.labels] || card.labels.en;
                    const prompt = card.prompts[selectedLanguage as keyof typeof card.prompts] || card.prompts.en;
                    
                    return (
                      <button key={index} onClick={() => handleSend(prompt)} className="flex flex-col items-start gap-2 p-4 rounded-2xl border bg-card hover:bg-muted text-left transition-colors group shadow-sm hover:shadow-md">
                        <card.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
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
                  
                  <div className={`max-w-[80%] flex flex-col gap-1.5 min-w-0 ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`rounded-2xl px-4 py-3 shadow-sm max-w-full overflow-hidden ${m.role === "user" ? "bg-secondary text-secondary-foreground rounded-br-2xl rounded-tr-sm" : "bg-muted text-foreground rounded-bl-2xl rounded-tl-sm border border-border/50"}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words break-all">{m.content}</p>
                    </div>
                    
                    {/* TRANSLATED READ ALOUD BUTTON FOR AI MESSAGES */}
                    {m.role === "assistant" && (
                      <button 
                        onClick={() => generateAndPlayTTS(m.content, m.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full transition-colors ${
                          speakingId === m.id 
                            ? "text-primary bg-primary/10 animate-pulse" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {speakingId === m.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" /> 
                            {uiLabels.stopReading[selectedLanguage as keyof typeof uiLabels.stopReading] || uiLabels.stopReading.en}
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" /> 
                            {uiLabels.readAloud[selectedLanguage as keyof typeof uiLabels.readAloud] || uiLabels.readAloud.en}
                          </>
                        )}
                      </button>
                    )}
                  </div>

                </div>
              ))}

              {isLoading && (
                <div className="flex flex-col gap-2 items-start">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-2xl rounded-bl-2xl rounded-tl-sm border border-border/50 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        <span className="text-sm text-muted-foreground">{getTranslation(selectedLanguage, "chatThinking")}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* TRANSLATED STOP GENERATING BUTTON */}
                  <button
                    onClick={stopGenerating}
                    className="ml-11 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full transition-colors border border-border/50"
                  >
                    <Square className="w-3 h-3 fill-current" /> 
                    {uiLabels.stopGenerating[selectedLanguage as keyof typeof uiLabels.stopGenerating] || uiLabels.stopGenerating.en}
                  </button>
                </div>
              )}
              {apiError && <div className="text-destructive text-xs flex items-center gap-1 justify-center bg-destructive/10 p-2 rounded-lg"><AlertCircle className="w-3 h-3" />{apiError}</div>}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {hasMessages && (
          <div className="p-3 md:p-4 bg-background border-t border-border/30">
            
            {/* ACTIVE CHAT INPUT */}
            <div className="max-w-3xl mx-auto flex items-end gap-3 bg-muted border border-border rounded-3xl px-3 md:px-4 py-2 md:py-3 shadow-sm focus-within:ring-1 focus-within:ring-primary/50 transition-shadow">
              <textarea 
                ref={textareaRef}
                value={input} 
                onChange={handleTextareaChange} 
                onKeyDown={handleKeyDown} 
                className="flex-1 bg-transparent outline-none text-sm md:text-base resize-none text-foreground px-2 py-2.5 max-h-32 overflow-y-auto w-full" 
                rows={1} 
                placeholder={getTranslation(selectedLanguage, "chatPlaceholderFollowUp")} 
              />
              
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={toggleRecording} 
                  className={`relative z-10 w-10 h-10 flex items-center justify-center shrink-0 rounded-full transition-all shadow-sm ${
                    isRecording 
                      ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse ring-2 ring-red-500/50" 
                      : "bg-background text-foreground border border-border hover:bg-secondary"
                  }`}
                  title="Voice to text"
                >
                  {isRecording ? <MicOff className="w-5 h-5 stroke-[2.5]" /> : <Mic className="w-5 h-5 stroke-[2.5]" />}
                </button>

                <Button onClick={() => handleSend()} disabled={!input.trim() || isLoading} variant="default" size="icon" className="w-10 h-10 rounded-full shrink-0 shadow-sm">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Chat;