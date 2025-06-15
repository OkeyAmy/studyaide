
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCloud, Loader2 } from 'lucide-react';
import MindMapViewer from '@/components/study-session/MindMapViewer';
import { useAI } from '@/contexts/AIContext';
import { toast } from 'sonner';

interface LearningPathOptimizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearningPathOptimizer: React.FC<LearningPathOptimizerProps> = ({ isOpen, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [learningPath, setLearningPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { mindmapService } = useAI();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLearningPath('');
    }
  };

  const handleGeneratePath = useCallback(async () => {
    if (!file) {
      toast.error('Please upload a file first.');
      return;
    }
    setIsLoading(true);
    setLearningPath('');
    try {
      const result = await mindmapService.generateLearningPathFromFile(file);
      setLearningPath(result);
      toast.success('Learning path generated successfully!');
    } catch (error) {
      console.error('Error generating learning path:', error);
      toast.error('An error occurred while generating the learning path.');
    } finally {
      setIsLoading(false);
    }
  }, [file, mindmapService]);
  
  const resetState = () => {
    setFile(null);
    setLearningPath('');
    setIsLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-white/80 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Learning Path Optimizer</DialogTitle>
          <DialogDescription>
            Upload your study material, and our AI will generate an optimized learning path for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow flex flex-col gap-4 overflow-hidden">
          {!learningPath ? (
            <div className="flex-grow flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.txt,.md"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center text-center">
                <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                <span className="text-lg font-semibold text-gray-700">
                  {file ? file.name : 'Click to upload a file'}
                </span>
                <p className="text-sm text-gray-500">PDF, TXT, or Markdown</p>
              </label>

              {file && (
                <Button onClick={handleGeneratePath} disabled={isLoading} className="mt-6">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Path...
                    </>
                  ) : (
                    'Generate Learning Path'
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="flex-grow overflow-auto rounded-lg border bg-white">
              <MindMapViewer content={learningPath} />
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          {learningPath && (
             <Button variant="outline" onClick={resetState}>Start Over</Button>
          )}
          <Button variant="secondary" onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LearningPathOptimizer;
