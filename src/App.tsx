import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider } from "@/contexts/AIContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import StudySession from "./pages/StudySession";
import MyWorkflows from "./pages/MyWorkflows";
import KnowledgeBase from "./pages/KnowledgeBase";
import AITools from "./pages/AITools";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AIProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/study-session"
                element={
                  <ProtectedRoute>
                    <StudySession />
                  </ProtectedRoute>
                }
              />
              {/* Workflows routes - both aliases point to the same component */}
              <Route
                path="/workflows"
                element={
                  <ProtectedRoute>
                    <MyWorkflows />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-workflows"
                element={
                  <ProtectedRoute>
                    <MyWorkflows />
                  </ProtectedRoute>
                }
              />
              {/* Knowledge routes - both aliases point to the same component */}
              <Route
                path="/knowledge"
                element={
                  <ProtectedRoute>
                    <KnowledgeBase />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/knowledge-base"
                element={
                  <ProtectedRoute>
                    <KnowledgeBase />
                  </ProtectedRoute>
                }
              />
              {/* AI Tools routes */}
              <Route
                path="/ai-tools"
                element={
                  <ProtectedRoute>
                    <AITools />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tools"
                element={
                  <ProtectedRoute>
                    <AITools />
                  </ProtectedRoute>
                }
              />
              {/* Settings route */}
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AIProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
