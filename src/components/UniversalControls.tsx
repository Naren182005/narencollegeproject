
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Wand2,
  ClipboardCopy,
  Send,
  Check,
  Sparkles,
  Zap,
  Lightbulb,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UniversalControlsProps {
  onGenerateCommonContent: () => void;
  onPasteToAll: () => void;
  onPostToAll: () => void;
  isGenerating: boolean;
  className?: string;
}

export const UniversalControls: React.FC<UniversalControlsProps> = ({
  onGenerateCommonContent,
  onPasteToAll,
  onPostToAll,
  isGenerating,
  className,
}) => {
  const { toast } = useToast();

  const handlePostToAll = () => {
    onPostToAll();
    toast({
      title: "Content posted successfully!",
      description: "Your content has been posted to all selected platforms.",
      action: (
        <div className="h-8 w-8 bg-green-500/20 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-green-500" />
        </div>
      ),
    });
  };

  return (
    <div className={cn(
      'glass-card rounded-2xl p-4 flex flex-wrap gap-3 justify-center md:justify-between items-center',
      className
    )}>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-medium">AI Controls</h3>
            <p className="text-xs text-muted-foreground">Generate and distribute content</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={onGenerateCommonContent}
                  className="group"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <span className="flex items-center gap-1">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-1" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-4 w-4 mr-1 transition-all group-hover:text-yellow-500" />
                      Generate Common
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate content that can be used across all platforms</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary"
                  onClick={onPasteToAll}
                  className="group"
                >
                  <ClipboardCopy className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
                  Paste to All
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy the common content to all platforms</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handlePostToAll}
              className="group bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all"
            >
              <Zap className="h-4 w-4 mr-1 group-hover:text-yellow-300 transition-colors" />
              Post to All Platforms
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Post your content to all platforms at once</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
