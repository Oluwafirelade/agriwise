import { useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { LanguagesSection } from "@/components/landing/LanguagesSection";
import { Footer } from "@/components/layout/Footer";

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
          
        </div>
        <LanguagesSection selectedLanguage={selectedLanguage} />
      </main>

      <Footer  />
    </div>
  );
};

export default Index;
