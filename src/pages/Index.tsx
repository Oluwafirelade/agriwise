import { useState, useRef } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { ChatInterface } from "@/components/ChatInterface";
import { LanguagesSection } from "@/components/LanguagesSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToChat = () => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        onStartChat={scrollToChat}
      />
      
      <main>
        <HeroSection onStartChat={scrollToChat}  />
        <FeaturesSection selectedLanguage={selectedLanguage} />
        <HowItWorksSection selectedLanguage={selectedLanguage} />
        <div ref={chatRef}>
          <ChatInterface 
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>
        <LanguagesSection selectedLanguage={selectedLanguage} />
      </main>

      <Footer  />
    </div>
  );
};

export default Index;
