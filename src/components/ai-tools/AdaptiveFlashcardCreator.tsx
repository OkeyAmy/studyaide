
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Plus, Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Flashcard } from '@/types/flashcard';

interface AdaptiveFlashcardCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdaptiveFlashcardCreator: React.FC<AdaptiveFlashcardCreatorProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('');
  const [context, setContext] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFlashcards: Flashcard[] = [
        {
          id: '1',
          front: `What is ${topic}?`,
          back: `${topic} is a fundamental concept that...`,
          difficulty: 'medium'
        },
        {
          id: '2', 
          front: `Key characteristics of ${topic}`,
          back: 'The main characteristics include...',
          difficulty: 'easy'
        }
      ];
      
      setFlashcards(newFlashcards);
      toast.success('Flashcards generated successfully!');
    } catch (error) {
      toast.error('Failed to generate flashcards');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTopic('');
    setContext('');
    setFlashcards([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-pink-600" />
            Adaptive Flashcard Creator
          </DialogTitle>
          <DialogDescription>
            Create personalized flashcards tailored to your learning style and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Topic</label>
              <Input
                placeholder="Enter the topic you want to study"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Context (Optional)</label>
              <Textarea
                placeholder="Provide additional context or specific areas to focus on"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="w-full h-20"
              />
            </div>
          </div>

          <Button
            onClick={generateFlashcards}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Flashcards...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate Adaptive Flashcards
              </>
            )}
          </Button>

          {flashcards.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Generated Flashcards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {flashcards.map((card) => (
                  <Card key={card.id} className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-pink-800">Front</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-900 mb-4">{card.front}</p>
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium text-pink-800 mb-2">Back</p>
                        <p className="text-gray-700">{card.back}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={handleClose}
            variant="outline"
            className="bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-gray-50 rounded-xl"
          >
            Close
          </Button>
          {flashcards.length > 0 && (
            <Button className="bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" />
              Save Flashcards
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdaptiveFlashcardCreator;
