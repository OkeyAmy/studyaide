
import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Brain, Lightbulb } from "lucide-react";
import AuthModal from "./auth/AuthModal";

const AuthCTA = () => {
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signup");
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (ctaRef.current) {
      observer.observe(ctaRef.current);
    }
    
    return () => {
      if (ctaRef.current) {
        observer.unobserve(ctaRef.current);
      }
    };
  }, []);

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  const handleSignIn = () => {
    setAuthMode("signin");
    setIsAuthModalOpen(true);
  };
  
  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 bg-white relative" id="get-started" ref={ctaRef}>
        <div className="section-container relative z-10 opacity-0 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto glass-card p-6 sm:p-8 md:p-10 lg:p-14 text-center overflow-hidden relative">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-pulse-100/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gray-100/50 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
            
            <div className="pulse-chip mx-auto mb-4 sm:mb-6">
              <span>Join StudyAIde</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform <br className="hidden sm:inline" />
              <span className="text-pulse-500">Your Learning?</span>
            </h2>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already learning smarter with StudyAIde. Transform any content into personalized study materials in seconds.
            </p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                <div className="w-8 h-8 rounded-full bg-pulse-100 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-pulse-600" />
                </div>
                <span className="text-sm font-medium">AI Transcription</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                <div className="w-8 h-8 rounded-full bg-pulse-100 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-pulse-600" />
                </div>
                <span className="text-sm font-medium">Smart Summaries</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                <div className="w-8 h-8 rounded-full bg-pulse-100 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-pulse-600" />
                </div>
                <span className="text-sm font-medium">Interactive Quizzes</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={handleSignUp}
                className="button-primary group flex items-center justify-center w-full sm:w-auto"
              >
                Start Free Account
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button 
                onClick={handleSignIn}
                className="button-secondary w-full sm:w-auto text-center"
              >
                Sign In
              </button>
            </div>
            
            <div className="mt-6 text-xs text-gray-500">
              Free forever • No credit card required • Start learning in 60 seconds
            </div>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default AuthCTA;
