import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector, languages } from "./LanguageSelector";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Type definitions for Web Speech API
type SpeechRecognitionErrorEvent = Event & { error: string };
type SpeechRecognitionEvent = Event & { 
  results: SpeechRecognitionResultList;
  isFinal: boolean;
};

const sampleQueries = [
  { en: "My cassava leaves are turning yellow", ha: "Ganyen rogo na ya zama rawaya", yo: "Ewé ẹ̀gẹ́ mi di pupa", ig: "Akwụkwọ akpụ m na-acha odo odo" },
  { en: "When should I plant maize?", ha: "Yaushe zan dasa masara?", yo: "Nigba wo ni mo yẹ ki n gbin agbado?", ig: "Kedu oge m ga-akụ ọka?" },
  { en: "How to prevent tomato blight?", ha: "Yadda ake hana cutar tumatir?", yo: "Bawo ni lati dena arun tomati?", ig: "Kedụ ka m ga-esi gbochie ọrịa tomato?" },
  { en: "Best fertilizer for plantain", ha: "Mafi kyawun takin ayaba", yo: "Ajile ti o dara julọ fun ọgẹdẹ", ig: "Nchara kacha mma maka unere" },
];

interface ChatInterfaceProps {
  selectedLanguage: string;
  onLanguageChange: (code: string) => void;
}

export function ChatInterface({ selectedLanguage, onLanguageChange }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage(selectedLanguage),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition ||
      (window as any).mozSpeechRecognition ||
      (window as any).msSpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      // Set recognition properties
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(selectedLanguage);

      // Handle recognition results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";

        for (let i = event.results.length - 1; i >= 0; --i) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            transcriptRef.current += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(transcriptRef.current + interimTranscript);
      };

      // Handle recognition errors
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        const errorMap: Record<string, string> = {
          "no-speech": "No speech detected. Please try again.",
          "audio-capture": "No microphone found. Please check permissions.",
          "network": "Network error. Please check your connection.",
          "permission-denied":
            "Microphone permission denied. Please enable it in settings.",
          "not-allowed": "Microphone access not allowed.",
        };

        const errorMessage =
          errorMap[event.error] ||
          `Speech recognition error: ${event.error}`;
        setRecordingError(errorMessage);
        setIsRecording(false);
      };

      // Handle recognition end
      recognition.onend = () => {
        if (transcriptRef.current.trim()) {
          setInput(transcriptRef.current.trim());
        }
        setIsRecording(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Update welcome message when language changes
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage(selectedLanguage),
      timestamp: new Date(),
    }]);
  }, [selectedLanguage]);

  function getWelcomeMessage(lang: string): string {
    const messages: Record<string, string> = {
      en: "Welcome to AgriAdvisor! I'm here to help you with farming questions. Ask me anything about crops, pests, soil, or farming practices. How can I assist you today?",
      ha: "Barka da zuwa AgriAdvisor! Ina nan don taimaka muku da tambayoyin noma. Tambaye ni komai game da amfanin gona, kwari, ƙasa, ko ayyukan noma. Yaya zan iya taimaka muku yau?",
      yo: "Kaabo si AgriAdvisor! Mo wa nibi lati ran ọ lọwọ pẹlu awọn ibeere ogbin. Beere lọwọ mi ohunkohun nipa awọn irugbin, awọn kokoro, ilẹ, tabi awọn iṣe ogbin. Bawo ni mo le ran ọ lọwọ loni?",
      ig: "Nnọọ na AgriAdvisor! Anọ m ebe a iji nyere gị aka na ajụjụ ọrụ ugbo. Jụọ m ihe ọ bụla gbasara ihe ọkụkụ, ụmụ ahụhụ, ala, ma ọ bụ omume ọrụ ugbo. Kedu ka m ga-esi nyere gị aka taa?",
    };
    return messages[lang] || messages.en;
  }

  // Map UI language codes to Web Speech API language codes
  function getLanguageCode(lang: string): string {
    const languageMap: Record<string, string> = {
      en: "en-US",
      ha: "ha-NG", // Hausa - Nigeria
      yo: "yo-NG", // Yoruba - Nigeria
      ig: "ig-NG", // Igbo - Nigeria
    };
    return languageMap[lang] || "en-US";
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        en: "Based on your description, this could be a sign of nutrient deficiency or early-stage disease. I recommend: 1) Check the soil moisture levels, 2) Apply balanced NPK fertilizer, 3) Ensure proper drainage. If symptoms persist, consider consulting your local agricultural extension officer.",
        ha: "Dangane da bayaninku, wannan na iya zama alamar rashin abinci mai gina jiki ko cutar farko. Ina ba da shawara: 1) Duba matakan danshi na ƙasa, 2) Yi amfani da taki na NPK mai daidaituwa, 3) Tabbatar da kyakkyawan magudanar ruwa. Idan alamun sun ci gaba, yi la'akari da tuntuɓar jami'in fadada aikin gona na yankinku.",
        yo: "Da lori apejuwe rẹ, eyi le jẹ ami ti aipe ounjẹ tabi arun ipele ibẹrẹ. Mo ṣeduro: 1) Ṣayẹwo awọn ipele ọrinrin ile, 2) Lo ajile NPK ti o ni iwọntunwọnsi, 3) Rii daju isọ daradara. Ti awọn aami aisan ba tẹsiwaju, ronu ijumọsọrọ oṣiṣẹ ifaagun iṣẹ-ogbin agbegbe rẹ.",
        ig: "Dabere na nkọwa gị, nke a nwere ike ịbụ ihe ngosi nke enweghị nri ma ọ bụ ọrịa n'oge mbido. Ana m atụ aro: 1) Lelee ọkwa mmiri ala, 2) Tinye takin NPK ziri ezi, 3) Hụ na mmiri na-asọpụ nke ọma. Ọ bụrụ na ihe mgbaàmà na-aga n'ihu, tụlee ịgbaso ndị ọrụ mgbasawanye ọrụ ugbo gị.",
      };

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[selectedLanguage] || responses.en,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSampleQuery = (query: typeof sampleQueries[0]) => {
    const text = query[selectedLanguage as keyof typeof query] || query.en;
    setInput(text);
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setRecordingError("Speech recognition not supported in your browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setTranscript("");
      transcriptRef.current = "";
    } else {
      try {
        setRecordingError(null);
        transcriptRef.current = "";
        setTranscript("");
        recognitionRef.current.lang = getLanguageCode(selectedLanguage);
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (error) {
        setRecordingError("Failed to start recording. Please try again.");
        setIsRecording(false);
      }
    }
  };

  return (
    <section id="chat" className="py-20 md:py-32 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Try It Now
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ask Your <span className="text-primary">Farming Questions</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the power of multilingual agricultural advice. Select your language and start asking!
          </p>
        </div>

        {/* Chat Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-card rounded-3xl shadow-elevated border border-border/50 overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gradient-hero px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-foreground">AgriAdvisor AI</h3>
                  <p className="text-xs text-primary-foreground/70">Always here to help</p>
                </div>
              </div>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={onLanguageChange}
                variant="glass"
              />
            </div>

            {/* Messages */}
            <div className="h-[400px] overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === "user" 
                      ? "bg-secondary/20" 
                      : "bg-primary/10"
                  }`}>
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-secondary" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-secondary text-secondary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
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
                      <span className="text-sm text-muted-foreground">Analyzing your question...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Sample Queries */}
            <div className="px-6 py-3 border-t border-border/50 bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium text-muted-foreground">Try asking:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleQuery(query)}
                    className="text-xs bg-background hover:bg-muted px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {query[selectedLanguage as keyof typeof query] || query.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="px-6 py-4 border-t border-border/50 bg-background">
              {/* Error Message */}
              {recordingError && (
                <div className="mb-3 flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                  <p className="text-xs text-destructive">{recordingError}</p>
                </div>
              )}

              {/* Recording Transcript */}
              {transcript && (
                <div className="mb-3 bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                  <p className="text-xs text-muted-foreground mb-1">
                    {isRecording ? "Listening..." : "Recognized text:"}
                  </p>
                  <p className="text-sm text-foreground italic">{transcript}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={toggleRecording}
                  className="flex-shrink-0"
                  title={isRecording ? "Stop recording" : "Start recording"}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={
                    selectedLanguage === "ha" ? "Rubuta tambayar ku a nan..." :
                    selectedLanguage === "yo" ? "Tẹ ibeere rẹ sii nibi..." :
                    selectedLanguage === "ig" ? "Dee ajụjụ gị ebe a..." :
                    "Type your question here..."
                  }
                  className="flex-1 bg-muted rounded-xl px-4 py-3 text-sm border-0 focus:ring-2 focus:ring-primary/50 outline-none"
                />
                <Button
                  variant="hero"
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
