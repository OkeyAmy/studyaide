
import React from 'react';
import { AIInsight } from '@/data/ai-tools-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface AIInsightsSectionProps {
  insights: AIInsight[];
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({ insights }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Insights & Recommendations</h2>
      <div className="space-y-6">
        {insights.map((insight, index) => (
          <div key={index} className="group bg-gradient-to-r from-white/60 to-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-3 h-3 bg-gradient-to-r ${insight.color} rounded-full`}></div>
                  <h3 className="font-semibold text-gray-900 text-lg">{insight.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">{insight.insight}</p>
                {insight.actionable && (
                  <Button variant="link" className="p-0 h-auto text-pulse-600 hover:text-pulse-700 font-medium">
                    Apply Recommendation →
                  </Button>
                )}
              </div>
              <div className="ml-6 text-right">
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-pulse-50 to-orange-50 text-pulse-700 border-pulse-200 rounded-full px-3 py-1"
                >
                  {insight.confidence}% confidence
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsSection;
