
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SessionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  progress?: number;
  status?: 'active' | 'paused' | 'completed';
  lastActivity?: string;
  studyTime?: string;
  onClick?: () => void;
  onContinue?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const SessionCard = ({
  title,
  description,
  icon: Icon,
  progress,
  status = 'active',
  lastActivity,
  studyTime,
  onClick,
  onContinue,
  className,
  children
}: SessionCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card 
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer group",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-pulse-100 rounded-lg flex items-center justify-center group-hover:bg-pulse-200 transition-colors">
              <Icon className="h-5 w-5 text-pulse-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
          {status && (
            <Badge className={cn("text-xs", getStatusColor(status))}>
              {status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {progress !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {(lastActivity || studyTime) && (
          <div className="flex justify-between text-sm text-gray-500">
            {lastActivity && <span>Last activity: {lastActivity}</span>}
            {studyTime && <span>Study time: {studyTime}</span>}
          </div>
        )}

        {children}

        {onContinue && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onContinue();
            }}
            className="w-full bg-pulse-500 hover:bg-pulse-600 text-white"
            size="sm"
          >
            Continue Session
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SessionCard;
