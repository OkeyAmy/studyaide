
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, FileText, Loader2, Check, X, Target, Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { toast } from 'sonner';

interface QuizGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  explanation: string;
  subject: string;
}

interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

const QuizGenerator = ({ isOpen, onClose }: QuizGeneratorProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { quizService } = useAI();

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

  const handleGenerateQuiz = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Generating quiz for file:', selectedFile.name);
      
      const quiz = await quizService.generateQuizFromFile(selectedFile);
      
      // Transform the quiz format to match our needs
      const transformedQuiz: Quiz = {
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          question: q.question,
          correctAnswer: q.options[q.correctAnswer],
          explanation: q.explanation || 'No explanation provided',
          subject: selectedFile.name
        }))
      };
      
      setGeneratedQuiz(transformedQuiz);
      setCurrentQuestionIndex(0);
      setUserAnswer('');
      setShowExplanation(false);
      setIsCorrect(null);
      toast.success(`Generated ${transformedQuiz.questions.length} quiz questions successfully!`);
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!generatedQuiz || !userAnswer.trim()) {
      toast.error('Please provide an answer');
      return;
    }

    const currentQuestion = generatedQuiz.questions[currentQuestionIndex];
    const correct = userAnswer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim();
    
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (correct) {
      toast.success('Correct! Well done!');
    } else {
      toast.error('Incorrect. Check the explanation below.');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < generatedQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setShowExplanation(false);
      setIsCorrect(null);
    } else {
      toast.success('Quiz completed! Great job!');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setGeneratedQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setShowExplanation(false);
    setIsCorrect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const currentQuestion = generatedQuiz?.questions[currentQuestionIndex];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Quiz Generator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          {!generatedQuiz && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Your Study Material</h3>
              
              <div
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50/80' 
                    : selectedFile 
                      ? 'border-green-400 bg-green-50/80' 
                      : 'border-gray-300 bg-gray-50/80 hover:border-blue-300 hover:bg-blue-50/40'
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

              <div className="flex gap-3 mt-6">
                <Button
                  onClick={handleGenerateQuiz}
                  disabled={!selectedFile || isGenerating}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white rounded-2xl py-3 font-medium"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      Generate Quiz
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
          )}

          {/* Quiz Section */}
          {generatedQuiz && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1} of {generatedQuiz.questions.length}
                </h3>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-xl"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  New Quiz
                </Button>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 min-h-[300px] flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Question</h4>
                    <p className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentQuestion?.question}
                    </p>
                  </div>
                  
                  {!showExplanation && (
                    <div className="space-y-3">
                      <Label htmlFor="user-answer" className="text-lg font-medium text-gray-900">
                        Your Answer
                      </Label>
                      <Textarea
                        id="user-answer"
                        placeholder="Type your answer here..."
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        className="bg-white/60 backdrop-blur-sm border-white/20 rounded-2xl py-3 px-4 text-gray-800 placeholder:text-gray-500 min-h-[100px]"
                      />
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!userAnswer.trim()}
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white rounded-2xl py-2 px-6 font-medium"
                      >
                        Submit Answer
                      </Button>
                    </div>
                  )}
                  
                  {showExplanation && (
                    <div className="space-y-4 pt-6 border-t border-gray-200/60">
                      <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-100/80 border border-green-200' : 'bg-red-100/80 border border-red-200'}`}>
                        <h4 className={`text-sm font-medium uppercase tracking-wide mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                          Correct Answer: {currentQuestion?.correctAnswer}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Explanation</h4>
                        <p className="text-gray-800 leading-relaxed">
                          {currentQuestion?.explanation}
                        </p>
                      </div>
                      
                      {currentQuestionIndex < generatedQuiz.questions.length - 1 ? (
                        <Button
                          onClick={handleNextQuestion}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white rounded-2xl py-2 px-6 font-medium"
                        >
                          Continue <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <div className="text-center space-y-3">
                          <p className="text-lg font-medium text-gray-900">Quiz Completed!</p>
                          <Button
                            onClick={handleReset}
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:shadow-lg text-white rounded-2xl py-2 px-6 font-medium"
                          >
                            Start New Quiz
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizGenerator;
