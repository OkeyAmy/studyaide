import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  FileText, 
  Network, 
  MessageSquare, 
  Eye, 
  Clock, 
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Zap,
  Play,
  CheckCircle,
  Users,
  Calendar,
  BarChart3,
  Target,
  ChevronRight,
  Layers
} from 'lucide-react';
import { useMaterialsData } from '@/hooks/useDatabase';
import { cn } from '@/lib/utils';

interface WorkflowContentViewerProps {
  workflow: any;
  onBack: () => void;
}

const WorkflowContentViewer = ({ workflow, onBack }: WorkflowContentViewerProps) => {
  const navigate = useNavigate();
  const { data: materials } = useMaterialsData();
  
  // Filter materials that belong to this workflow
  const workflowMaterials = materials?.materials?.filter(material => 
    workflow.materials?.includes(material.id)
  ) || [];

  const handleMaterialClick = (materialId: string) => {
    navigate(`/knowledge?material=${materialId}`);
  };

  const StudyToolButton = ({ 
    icon: Icon, 
    label, 
    color, 
    onClick 
  }: { 
    icon: any; 
    label: string; 
    color: string; 
    onClick: () => void; 
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex-1 h-auto py-3 px-2 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors",
        color
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );

  const MaterialCard = ({ material }: { material: any }) => (
    <Card className="group hover:shadow-md transition-all duration-200 border border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">
                {material.title}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {material.type} • {material.pages || 0} pages
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleMaterialClick(material.id)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="grid grid-cols-4 gap-2">
          <StudyToolButton
            icon={FileText}
            label="Summary"
            color="text-blue-600 hover:text-blue-700"
            onClick={() => navigate(`/knowledge?material=${material.id}&tab=summary`)}
          />
          <StudyToolButton
            icon={MessageSquare}
            label="Quiz"
            color="text-green-600 hover:text-green-700"
            onClick={() => navigate(`/knowledge?material=${material.id}&tab=quiz`)}
          />
          <StudyToolButton
            icon={Network}
            label="Mind Map"
            color="text-purple-600 hover:text-purple-700"
            onClick={() => navigate(`/knowledge?material=${material.id}&tab=mindmap`)}
          />
          <StudyToolButton
            icon={Brain}
            label="Flashcards"
            color="text-orange-600 hover:text-orange-700"
            onClick={() => navigate(`/knowledge?material=${material.id}&tab=flashcards`)}
          />
        </div>
      </CardContent>
    </Card>
  );

  const OverviewCard = ({ icon: Icon, title, value, color }: { 
    icon: any; 
    title: string; 
    value: string | number; 
    color: string; 
  }) => (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-3 rounded-lg", color)}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="p-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{workflow.title}</h1>
          <p className="text-gray-600 mt-1">{workflow.description}</p>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <OverviewCard
          icon={BookOpen}
          title="Materials"
          value={workflowMaterials.length}
          color="bg-blue-500"
        />
        <OverviewCard
          icon={Clock}
          title="Est. Duration"
          value={`${workflow.estimatedDuration || 'N/A'} min`}
          color="bg-green-500"
        />
        <OverviewCard
          icon={Target}
          title="Difficulty"
          value={workflow.difficulty || 'Medium'}
          color="bg-purple-500"
        />
        <OverviewCard
          icon={Users}
          title="Progress"
          value={`${workflow.progress || 0}%`}
          color="bg-orange-500"
        />
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Materials ({workflowMaterials.length})
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="materials" className="space-y-4">
          {workflowMaterials.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No Materials Found</h3>
                  <p className="text-gray-600 mt-1">
                    This workflow doesn't have any materials assigned yet.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate('/workflows/edit/' + workflow.id)}
                  className="mt-2"
                >
                  Add Materials
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {workflowMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Workflow Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{workflow.description || 'No description available.'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="space-y-2">
                  {workflow.objectives?.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  )) || (
                    <li className="text-gray-500 italic">No learning objectives defined.</li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Study Tools Available</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Summaries</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Quizzes</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Network className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Mind Maps</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Brain className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">Flashcards</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => navigate(`/study-session?workflow=${workflow.id}`)}
                >
                  <Play className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Start Study Session</div>
                    <div className="text-xs opacity-90">Begin studying this workflow</div>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => navigate(`/workflows/edit/${workflow.id}`)}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">Edit Workflow</div>
                    <div className="text-xs opacity-70">Modify materials and settings</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowContentViewer; 