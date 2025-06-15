
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, FileText, Loader2, Check, X, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { toast } from 'sonner';

interface AdaptiveFlashcardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Flashcard {
  question: string;
  answer: string;
  source: string;
}

const AdaptiveFlashcardCreator = ({ isOpen, onClose }: AdaptiveFlashcardCreatorProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [focusArea, setFocusArea] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { flashcardService } = useAI();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating flashcards for file:', selectedFile.name);
      console.log('Focus area:', focusArea);
      
      const flashcardSet = await flashcardService.generateFlashcardsFromFile(selectedFile);
      setGeneratedFlashcards(flashcardSet.cards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
      toast.success(`Generated ${flashcardSet.cards.length} flashcards successfully!`);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      toast.error('Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setFocusArea('');
    setGeneratedFlashcards([]);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const nextCard = () => {
    if (currentCardIndex < generatedFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const currentCard = generatedFlashcards[currentCardIndex];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Adaptive Flashcard Creator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Study Material</h3>
            
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-pink-400 bg-pink-50/80' 
                  : selectedFile 
                    ? 'border-green-400 bg-green-50/80' 
                    : 'border-gray-300 bg-gray-50/80 hover:border-pink-300 hover:bg-pink-50/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                {selectedFile ? (
                  <>
                    <Check className="h-12 w-12 text-green-600 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-green-700">{selectedFile.name}</p>
                      <p className="text-sm text-green-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">
                        Drop your file here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports PDF, DOC, TXT, and image files
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Focus Area Input */}
            <div className="mt-6 space-y-3">
              <Label htmlFor="focus-area" className="text-lg font-medium text-gray-900">
                What should the AI focus on? (Optional)
              </Label>
              <Input
                id="focus-area"
                type="text"
                placeholder="e.g., key definitions, important formulas, main concepts..."
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="bg-white/60 backdrop-blur-sm border-white/20 rounded-2xl py-3 px-4 text-gray-800 placeholder:text-gray-500"
              />
              <p className="text-sm text-gray-600">
                Help the AI create more targeted flashcards by specifying what you want to study
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleGenerateFlashcards}
                disabled={!selectedFile || isGenerating}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 hover:shadow-lg text-white rounded-2xl py-3 font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Flashcards...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Flashcards
                  </>
                )}
              </Button>
              
              {selectedFile && (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-2xl px-6"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Generated Flashcards Section */}
          {generatedFlashcards.length > 0 && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Flashcard {currentCardIndex + 1} of {generatedFlashcards.length}
                </h3>
                <Button
                  onClick={() => setShowAnswer(!showAnswer)}
                  variant="outline"
                  size="sm"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl"
                >
                  {showAnswer ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-8 min-h-[200px] flex flex-col justify-center">
                <div className="text-center space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Question</h4>
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentCard?.question}
                    </p>
                  </div>
                  
                  {showAnswer && (
                    <div className="space-y-3 pt-6 border-t border-gray-200/60">
                      <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Answer</h4>
                      <p className="text-lg text-gray-800 leading-relaxed">
                        {currentCard?.answer}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  onClick={prevCard}
                  disabled={currentCardIndex === 0}
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-2xl"
                >
                  ← Previous
                </Button>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => setCurrentCardIndex(0)}
                    variant="outline"
                    size="sm"
                    className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={nextCard}
                  disabled={currentCardIndex === generatedFlashcards.length - 1}
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-2xl"
                >
                  Next →
                </Button>
              </div>

              {/* Download/Export Options */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200/60">
                <Button
                  onClick={() => {
                    const flashcardText = generatedFlashcards.map((card, index) => 
                      `Card ${index + 1}:\nQ: ${card.question}\nA: ${card.answer}\n\n`
                    ).join('');
                    navigator.clipboard.writeText(flashcardText);
                    toast.success('Flashcards copied to clipboard!');
                  }}
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-2xl"
                >
                  Copy All Flashcards
                </Button>
                
                <Button
                  onClick={() => {
                    const flashcardText = generatedFlashcards.map((card, index) => 
                      `Card ${index + 1}:\nQ: ${card.question}\nA: ${card.answer}\n\n`
                    ).join('');
                    const blob = new Blob([flashcardText], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `flashcards-${selectedFile?.name || 'document'}.txt`;
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success('Flashcards downloaded!');
                  }}
                  variant="outline"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-2xl"
                >
                  Download Flashcards
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdaptiveFlashcardCreator;
