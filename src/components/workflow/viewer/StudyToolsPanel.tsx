
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, FileText, Network, CheckCircle, ExternalLink, Target } from 'lucide-react';
import { MaterialDisplay } from '@/types/api';
import StudyToolContent from './StudyToolContent';

interface StudyToolsPanelProps {
  selectedMaterial: MaterialDisplay | null;
}

interface Tool {
  id: 'summary' | 'quiz' | 'flashcards' | 'mindmap';
  label: string;
  icon: React.ElementType;
  color: string;
}

const tools: Tool[] = [
  { id: 'summary', label: 'Summary', icon: FileText, color: 'text-blue-600' },
  { id: 'quiz', label: 'Quiz', icon: CheckCircle, color: 'text-green-600' },
  { id: 'flashcards', label: 'Flashcards', icon: Brain, color: 'text-orange-600' },
  { id: 'mindmap', label: 'Mind Map', icon: Network, color: 'text-purple-600' },
];

const StudyToolsPanel = ({ selectedMaterial }: StudyToolsPanelProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  return (
    <div className="lg:col-span-3">
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg h-full flex flex-col">
        {selectedMaterial ? (
          <>
            <div className="p-6 border-b border-gray-200/60">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMaterial.title}</h3>
                  <p className="text-gray-600">{selectedMaterial.file_type} • Study Tools</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/knowledge?material=${selectedMaterial.id}`)}
                  className="bg-white/60 backdrop-blur-sm border-white/20 hover:bg-white/80 rounded-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Full View
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="p-4">
                  <TabsList className="grid w-full grid-cols-4 gap-2 bg-orange-100/50 p-2 rounded-2xl">
                    {tools.map((tool) => (
                      <TabsTrigger 
                        key={tool.id} 
                        value={tool.id} 
                        className="text-sm font-semibold text-orange-900/70 data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-lg rounded-xl flex items-center gap-2 py-3 transition-all duration-300"
                      >
                        <tool.icon className="h-4 w-4" />
                        {tool.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  {tools.map((tool) => (
                    <TabsContent key={tool.id} value={tool.id} className="m-0 h-full">
                      <StudyToolContent tool={tool} selectedMaterial={selectedMaterial} />
                    </TabsContent>
                  ))}
                </div>
              </Tabs>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Material</h3>
              <p className="text-gray-600">Choose a material from the left panel to access study tools</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyToolsPanel;
