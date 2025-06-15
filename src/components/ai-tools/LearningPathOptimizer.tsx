
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, File as FileIcon, Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import MindMapViewer from '@/components/study-session/MindMapViewer';
import { generateMindmapFromFile } from '@/services/mindmap.service';

interface LearningPathOptimizerProps {
  isOpen: boolean;
  onClose: () => void;
}

const LearningPathOptimizer: React.FC<LearningPathOptimizerProps> = ({ isOpen, onClose }) => {
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
      'image/*': ['.png', '.jpg', '.jpeg']
    }
  });

  const handleGenerate = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    setLearningPath(null);
    
    toast.info('Generating your optimized learning path... This might take a moment.');
    
    try {
      // Generate learning path using mindmap service with special prompt for learning optimization
      const result = await generateMindmapFromFile(file);
      
      // Transform the mindmap into a learning path format
      const optimizedPath = transformToLearningPath(result, file.name);
      setLearningPath(optimizedPath);
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

  const transformToLearningPath = (mindmap: string, fileName: string): string => {
    // Transform the mindmap into an optimized learning path format
    const pathHeader = `# Optimized Learning Path - ${fileName}

## 🎯 Learning Sequence (Recommended Order)

### Phase 1: Foundation Building
- Review core concepts first
- Establish basic understanding
- Build knowledge foundation

### Phase 2: Skill Development  
- Apply concepts through practice
- Develop practical skills
- Connect theory to application

### Phase 3: Mastery & Integration
- Synthesize advanced concepts
- Practice complex scenarios
- Achieve subject mastery

## 📚 Detailed Study Guide

`;
    
    return pathHeader + mindmap;
  };

  const handleReset = () => {
    setFile(null);
    setLearningPath(null);
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-600" />
            Learning Path Optimizer
          </DialogTitle>
          <DialogDescription>
            Upload your study material, and our AI will generate an optimized learning path tailored to your needs.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto pr-2">
          {!learningPath ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div
                {...getRootProps()}
                className={`w-full h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-gray-600">Drop the file here...</p>
                ) : (
                  <p className="text-gray-600">Drag & drop a file here, or click to select a file</p>
                )}
                <p className="text-xs text-gray-500 mt-2">PDF, DOCX, TXT, Images supported</p>
              </div>

              {file && (
                <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 w-full border border-green-200">
                  <FileIcon className="h-8 w-8 text-green-600" />
                  <div className="flex-grow">
                    <p className="font-medium text-green-800">{file.name}</p>
                    <p className="text-sm text-green-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Generate Path
                      </>
                    )}
                  </Button>
                </div>
              )}

              {error && (
                <div className="w-full p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-800">{error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Your Optimized Learning Path</h3>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-gray-50 rounded-xl"
                >
                  Generate New Path
                </Button>
              </div>
              
              <div className="h-[calc(100%-4rem)] bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl border border-green-200 p-4">
                <MindMapViewer 
                  content={learningPath} 
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-gray-50 rounded-xl"
          >
            Close
          </Button>
          {learningPath && (
            <Button
              onClick={() => {
                navigator.clipboard.writeText(learningPath);
                toast.success('Learning path copied to clipboard!');
              }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl"
            >
              Copy to Clipboard
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LearningPathOptimizer;
