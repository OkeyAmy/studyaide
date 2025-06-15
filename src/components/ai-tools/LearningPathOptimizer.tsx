
import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, Loader2 } from 'lucide-react';
import { useAI } from '@/contexts/AIContext';
import { toast } from 'sonner';
import MindMapViewer from '@/components/study-session/MindMapViewer';

interface LearningPathOptimizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearningPathOptimizer: React.FC<LearningPathOptimizerProps> = ({ isOpen, onClose }) => {
  const { mindmapService } = useAI();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setLearningPath(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
  });
  
  const handleGenerate = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setLearningPath(null);
    toast.info('Generating your optimized learning path... This might take a moment.');

    try {
      const result = await mindmapService.generateLearningPathFromFile(file);
      setLearningPath(result);
      toast.success('Learning path generated successfully!');
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate learning path: ${errorMessage}`);
      toast.error('Failed to generate learning path.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
      setFile(null);
      setLearningPath(null);
      setError(null);
  }

  const handleClose = () => {
    handleReset();
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Learning Path Optimizer</DialogTitle>
          <DialogDescription>
            Upload your study material, and our AI will generate an optimized learning path for you.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto pr-2">
            {!learningPath ? (
                 <div className="flex flex-col items-center justify-center h-full gap-6">
                    <div
                      {...getRootProps()}
                      className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-pulse-500 bg-pulse-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                      {isDragActive ? (
                        <p className="text-gray-600">Drop the file here...</p>
                      ) : (
                        <p className="text-gray-600">Drag & drop a file here, or click to select a file</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">PDF, DOCX, TXT supported</p>
                    </div>
                    {file && (
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 w-full">
                            <FileIcon className="h-8 w-8 text-gray-500" />
                            <div className="flex-grow">
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                            </div>
                             <Button variant="ghost" size="sm" onClick={() => setFile(null)}>Remove</Button>
                        </div>
                    )}
                 </div>
            ) : (
                <div className="border rounded-lg overflow-hidden bg-white">
                    <MindMapViewer content={learningPath} />
                </div>
            )}
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
        
        <DialogFooter className="mt-4">
            {learningPath ? (
                <Button variant="outline" onClick={handleReset}>Start Over</Button>
            ) : (
                <Button onClick={handleGenerate} disabled={!file || isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Learning Path'
                    )}
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LearningPathOptimizer;
