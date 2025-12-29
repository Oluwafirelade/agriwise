import { Globe, MessageSquareText, Zap, Brain, Mic, Shield } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Multilingual Support",
    description: "Ask questions in Hausa, Yoruba, Igbo, or English. Our NLP system understands and responds in your preferred language.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: MessageSquareText,
    title: "Natural Conversations",
    description: "Describe your farming problems naturally. No technical jargon needed — just explain what you see on your farm.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Zap,
    title: "Instant Responses",
    description: "Get real-time advice on pest control, crop diseases, planting schedules, and soil management.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Leveraging advanced NLP models trained on agricultural knowledge specific to Nigerian farming conditions.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Mic,
    title: "Voice Input Support",
    description: "Speak your questions if you prefer. Perfect for farmers who find typing challenging.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Shield,
    title: "Trusted Guidance",
    description: "Advice based on proven agricultural practices and local farming expertise from extension services.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-32 bg-gradient-subtle relative">
      <div className="absolute inset-0 pattern-lines" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-sm font-semibold text-secondary uppercase tracking-wider mb-4">
            Platform Features
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Everything You Need for{" "}
            <span className="text-primary">Smarter Farming</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform combines advanced language processing with agricultural expertise 
            to deliver personalized guidance right when you need it.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-card rounded-2xl p-6 md:p-8 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
