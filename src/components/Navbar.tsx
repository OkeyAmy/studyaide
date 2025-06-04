
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import AuthModal from "./auth/AuthModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent background scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : '';
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleSignIn = () => {
    setAuthMode("signin");
    setIsAuthModalOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 transition-all duration-300",
          isScrolled 
            ? "bg-white/80 backdrop-blur-md shadow-sm" 
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <a 
            href="#" 
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
            aria-label="StudyAIde"
          >
            <img 
              src="/logo.svg" 
              alt="StudyAIde Logo" 
              className="h-7 sm:h-8" 
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
            >
              Home
            </a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#testimonials" className="nav-link">Success Stories</a>
            
            {/* Auth buttons for desktop */}
            <div className="flex items-center space-x-3 ml-4">
              <button 
                onClick={handleSignIn}
                className="flex items-center space-x-1 px-4 py-2 text-gray-700 hover:text-pulse-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button 
                onClick={handleSignUp}
                className="flex items-center space-x-1 px-4 py-2 bg-pulse-500 text-white rounded-full hover:bg-pulse-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700 p-3 focus:outline-none" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "fixed inset-0 z-40 bg-white flex flex-col pt-16 px-6 md:hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
        )}>
          <nav className="flex flex-col space-y-8 items-center mt-8">
            <a 
              href="#" 
              className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
                setIsMenuOpen(false);
                document.body.style.overflow = '';
              }}
            >
              Home
            </a>
            <a 
              href="#features" 
              className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
              onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = '';
              }}
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-xl font-medium py-3 px-6 w-full text-center rounded-lg hover:bg-gray-100" 
              onClick={() => {
                setIsMenuOpen(false);
                document.body.style.overflow = '';
              }}
            >
              Success Stories
            </a>
            
            {/* Mobile auth buttons */}
            <div className="flex flex-col space-y-4 w-full mt-8">
              <button 
                onClick={() => {
                  handleSignIn();
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
                className="flex items-center justify-center space-x-2 py-3 px-6 border-2 border-pulse-500 text-pulse-500 rounded-lg hover:bg-pulse-50 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button 
                onClick={() => {
                  handleSignUp();
                  setIsMenuOpen(false);
                  document.body.style.overflow = '';
                }}
                className="flex items-center justify-center space-x-2 py-3 px-6 bg-pulse-500 text-white rounded-lg hover:bg-pulse-600 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Get Started</span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
