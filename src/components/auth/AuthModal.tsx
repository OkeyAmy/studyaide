
import React, { useState } from "react";
import { X } from "lucide-react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
}

const AuthModal = ({ isOpen, onClose, initialMode = "signin" }: AuthModalProps) => {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-2xl shadow-elegant max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold mb-2">
              {mode === "signin" ? "Welcome Back" : "Get Started"}
            </h2>
            <p className="text-gray-600">
              {mode === "signin" 
                ? "Sign in to continue your learning journey" 
                : "Create your account and start learning smarter"}
            </p>
          </div>
          
          {mode === "signin" ? (
            <SignInForm onSwitchToSignUp={() => setMode("signup")} />
          ) : (
            <SignUpForm onSwitchToSignIn={() => setMode("signin")} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
