
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Youtube, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YouTubeSectionProps {
  title: string;
  description: string;
  tags: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onTagsChange: (tags: string) => void;
  onGenerateContent: () => void;
  onPostToYouTube: () => void;
  isGenerating: boolean;
  className?: string;
}

export const YouTubeSection: React.FC<YouTubeSectionProps> = ({
  title,
  description,
  tags,
  onTitleChange,
  onDescriptionChange,
  onTagsChange,
  onGenerateContent,
  onPostToYouTube,
  isGenerating,
  className,
}) => {
  return (
    <div className={cn(
      'glass-card rounded-2xl p-5 transition-all duration-300',
      'youtube-card',
      className
    )}>
      <div className="flex items-center gap-2 mb-4">
        <Youtube className="h-5 w-5 text-youtube" />
        <h3 className="font-semibold text-youtube">YouTube</h3>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="thumbnails">Thumbnail Ideas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="animate-fade-in">
          <div className="space-y-4">
            <div>
              <label htmlFor="youtube-title" className="text-sm font-medium mb-1 block">Title</label>
              <Input
                id="youtube-title"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div>
              <label htmlFor="youtube-description" className="text-sm font-medium mb-1 block">Description</label>
              <Textarea
                id="youtube-description"
                placeholder="Enter video description"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
                className="resize-none min-h-[100px] bg-background/50"
              />
            </div>
            <div>
              <label htmlFor="youtube-tags" className="text-sm font-medium mb-1 block">Tags</label>
              <Input
                id="youtube-tags"
                placeholder="Enter comma separated tags"
                value={tags}
                onChange={(e) => onTagsChange(e.target.value)}
                className="bg-background/50"
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="metadata" className="animate-fade-in space-y-4">
          <p className="text-sm text-muted-foreground">
            Optimize your video's metadata for better visibility. Include relevant keywords, a compelling description, 
            and tags that align with your content. This helps YouTube understand what your video is about.
          </p>
          <div className="bg-secondary/30 p-3 rounded-lg">
            <h4 className="font-medium mb-2">Metadata Tips:</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Use your primary keyword in the title</li>
              <li>Write a detailed description (300+ words)</li>
              <li>Include timestamps for longer videos</li>
              <li>Add 5-8 relevant tags</li>
              <li>Link to related content or website</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="thumbnails" className="animate-fade-in space-y-4">
          <p className="text-sm text-muted-foreground">
            Create eye-catching thumbnails that stand out. Your thumbnail should accurately represent your video content
            while being visually appealing to potential viewers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-secondary/30 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Design Ideas:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Use contrasting colors</li>
                <li>Include a close-up of your face</li>
                <li>Add clear, large text (3-5 words)</li>
                <li>Use high-quality images</li>
                <li>Create a consistent brand style</li>
              </ul>
            </div>
            <div className="bg-secondary/30 p-3 rounded-lg">
              <h4 className="font-medium mb-2">Avoid These Mistakes:</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Cluttered designs with too many elements</li>
                <li>Clickbait that doesn't match content</li>
                <li>Poor image quality or resolution</li>
                <li>Text that's too small to read</li>
                <li>Using copyrighted images</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button 
          variant="outline" 
          onClick={onGenerateContent}
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
              <Wand2 className="h-4 w-4 mr-1 transition-all group-hover:rotate-12" />
              Generate YouTube Content
            </span>
          )}
        </Button>
        <Button 
          onClick={onPostToYouTube}
          className="group"
        >
          <Send className="h-4 w-4 mr-1 group-hover:translate-x-1 transition-transform" />
          Post to YouTube
        </Button>
      </div>
    </div>
  );
};
