
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, HelpCircle, CheckCircle, XCircle, Loader2, FileText, BrainCircuit, RotateCcw, ArrowRight } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { Quiz } from '@/services/quiz.service';
import { Badge } from '@/components/ui/badge';

interface QuizGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ isOpen, onClose }) => {
  const { quizService } = useAI();
  const [file, setFile] = useState<File | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; explanation: string; correctAnswer: string } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Unsupported file type. Please upload a PDF, DOC, TXT, or image file.');
      }
    }
  };

  const handleGenerateQuiz = useCallback(async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setQuiz(null);
    try {
      const generatedQuiz = await quizService.generateQuizFromFile(file);
      setQuiz(generatedQuiz);
    } catch (err) {
      setError('Failed to generate quiz. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [file, quizService]);

  const handleAnswerSubmit = () => {
    if (!quiz) return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.trim().toLowerCase();
    setFeedback({ isCorrect, explanation: currentQuestion.explanation, correctAnswer: currentQuestion.answer });
  };
  
  const handleNextQuestion = () => {
    setFeedback(null);
    setUserAnswer('');
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleRestart();
    }
  };
  
  const handleTryAgain = () => {
    setFeedback(null);
    setUserAnswer('');
  };

  const resetState = () => {
    setFile(null);
    setQuiz(null);
    setIsLoading(false);
    setError(null);
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setFeedback(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };
  
  const handleRestart = () => {
    resetState();
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 h-64">
          <Loader2 className="h-12 w-12 animate-spin text-pulse-500" />
          <p className="text-lg font-medium text-gray-700">Generating your quiz...</p>
          <p className="text-sm text-gray-500">The AI is analyzing your document. This may take a moment.</p>
        </div>
      );
    }

    if (quiz && quiz.questions.length > 0) {
      const currentQuestion = quiz.questions[currentQuestionIndex];
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800">{quiz.title}</h3>
            <Badge variant="outline" className="font-mono">{currentQuestionIndex + 1} / {quiz.questions.length}</Badge>
          </div>
          <div className="p-6 bg-gray-50 rounded-xl border">
            <p className="text-lg font-semibold text-gray-800">{currentQuestion.question}</p>
          </div>
          
          {!feedback ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="min-h-[120px] text-base"
                rows={5}
              />
              <Button onClick={handleAnswerSubmit} className="w-full bg-pulse-600 hover:bg-pulse-700">Submit Answer</Button>
            </div>
          ) : (
            <div className={`p-4 rounded-xl border ${feedback.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-start space-x-3">
                {feedback.isCorrect ? <CheckCircle className="h-6 w-6 text-green-500" /> : <XCircle className="h-6 w-6 text-red-500" />}
                <div>
                  <h4 className={`text-lg font-semibold ${feedback.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {feedback.isCorrect ? 'Correct!' : 'Incorrect'}
                  </h4>
                  {!feedback.isCorrect && (
                    <div className="mt-2 space-y-2 text-gray-700">
                      <p><strong className="font-semibold">Your answer:</strong> {userAnswer}</p>
                      <p><strong className="font-semibold">Correct answer:</strong> {feedback.correctAnswer}</p>
                    </div>
                  )}
                  <p className="mt-2 text-gray-700">{feedback.explanation}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-4">
                {feedback.isCorrect ? (
                   <Button onClick={handleNextQuestion} className="w-full">
                    {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish Quiz' : 'Continue'} <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                ) : (
                  <>
                    <Button onClick={handleTryAgain} variant="outline" className="w-full">Try Again</Button>
                    <Button onClick={handleNextQuestion} className="w-full">Next Question <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
             <Button variant="ghost" onClick={handleRestart}>
              <RotateCcw className="mr-2 h-4 w-4" /> Start Over with New File
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl bg-gray-50/50">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <input
            type="file"
            id="file-upload-quiz"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload-quiz" className="cursor-pointer">
            <Button asChild variant="outline">
              <span>{file ? 'Change File' : 'Upload File'}</span>
            </Button>
          </label>
          {file && <p className="mt-4 text-sm text-gray-600 flex items-center"><FileText className="h-4 w-4 mr-2" /> {file.name}</p>}
          <p className="mt-2 text-xs text-gray-500">PDF, DOC, TXT, JPG, PNG supported</p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <DialogFooter>
          <Button
            onClick={handleGenerateQuiz}
            disabled={!file || isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
            Generate Quiz
          </Button>
        </DialogFooter>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center">
            <HelpCircle className="mr-3 h-6 w-6 text-blue-500" />
            AI Quiz Generator
          </DialogTitle>
          <DialogDescription>
            Upload a document, and the AI will create an interactive quiz to test your knowledge with open-ended questions.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizGenerator;
