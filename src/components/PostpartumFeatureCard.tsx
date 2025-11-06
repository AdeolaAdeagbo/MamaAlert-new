import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface PostpartumFeatureCardProps {
  title: string;
  icon: ReactNode;
  description: string;
  children: ReactNode;
  defaultExpanded?: boolean;
}

export const PostpartumFeatureCard = ({ 
  title, 
  icon, 
  description, 
  children, 
  defaultExpanded = false 
}: PostpartumFeatureCardProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className="w-full bg-white/80 overflow-hidden">
      <CardHeader className="p-3 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-accent/20">
              {icon}
            </div>
            <div>
              <CardTitle className="text-sm font-semibold">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-shrink-0 h-8 w-8 p-0 hover:bg-accent/20 rounded-lg"
          >
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="pt-0 p-3 animate-slide-up max-h-[240px] overflow-y-auto">
          {children}
        </CardContent>
      )}
    </Card>
  );
};