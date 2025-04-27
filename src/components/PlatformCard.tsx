
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { MediaUpload } from './MediaUpload';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Wand2,
  Clipboard,
  Send,
  Sparkles,
  MessageSquare,
  Image,
  Video,
  Link as LinkIcon,
  Hash,
  Lightbulb
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type PlatformType = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'youtube';

interface PlatformCardProps {
  platform: PlatformType;
  content: string;
  onContentChange: (content: string) => void;
  onGenerateContent: (prompt?: string) => void;
  onPasteCommon: () => void;
  onPostContent: () => void;
  isGenerating: boolean;
  className?: string;
}

const platformIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
};

const platformColors = {
  linkedin: 'text-linkedin',
  instagram: 'text-instagram',
  twitter: 'text-twitter',
  facebook: 'text-facebook',
  youtube: 'text-youtube',
};

const platformNames = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
};

const platformPlaceholders = {
  linkedin: 'Write a professional post for your LinkedIn network...',
  instagram: 'Create an engaging caption for your Instagram post...',
  twitter: 'Compose a short, impactful tweet...',
  facebook: 'Share an update with your Facebook friends...',
  youtube: 'Write a description for your YouTube video...',
};

const platformMediaSupport: Record<PlatformType, readonly ('image' | 'video')[]> = {
  linkedin: ['image', 'video'] as const,
  instagram: ['image', 'video'] as const,
  twitter: ['image', 'video'] as const,
  facebook: ['image', 'video'] as const,
  youtube: ['video'] as const,
};

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  content,
  onContentChange,
  onGenerateContent,
  onPasteCommon,
  onPostContent,
  isGenerating,
  className,
}) => {
  const Icon = platformIcons[platform];
  const colorClass = platformColors[platform];
  const name = platformNames[platform];
  const placeholder = platformPlaceholders[platform];

  const [uploadedMedia, setUploadedMedia] = useState<{
    image?: File;
    video?: File;
  }>({});

  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');

  const handleImageUpload = (file: File) => {
    console.log(`Uploading image for ${platform}:`, file);
    setUploadedMedia(prev => ({ ...prev, image: file }));
    // Here you would typically upload the file to your backend
  };

  const handleVideoUpload = (file: File) => {
    console.log(`Uploading video for ${platform}:`, file);
    setUploadedMedia(prev => ({ ...prev, video: file }));
    // Here you would typically upload the file to your backend
  };

  const handleGenerateWithPrompt = () => {
    console.log(`Generating content for ${platform} with custom prompt: ${customPrompt}`);
    onGenerateContent(customPrompt);
    setShowPromptInput(false);
  };

  const handleGenerateContent = () => {
    console.log(`Generating content for ${platform} with default prompt`);
    onGenerateContent();
  };

  return (
    <div className={cn(
      'glass-card rounded-2xl p-4 transition-all duration-300 flex flex-col h-full',
      `${platform}-card`,
      'hover:shadow-lg hover:scale-[1.01] transition-all duration-300',
      className
    )}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", colorClass)} />
          <h3 className={cn("font-semibold", colorClass)}>{name}</h3>
        </div>
        <MediaUpload
          platformName={platform}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
          supportedTypes={platformMediaSupport[platform]}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 mb-3">
          <TabsTrigger value="compose" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="post" className="text-xs">
            <Send className="h-3 w-3 mr-1" />
            Post
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="flex-1 flex flex-col space-y-2 mt-0">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[120px] resize-none bg-background/50"
          />

          {showPromptInput ? (
            <div className="flex flex-col space-y-2 animate-in fade-in-50 duration-300">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <span className="text-xs font-medium">Custom Prompt</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`E.g., Create content about our new product launch for ${name}`}
                  className="text-xs"
                />
                <Button
                  size="sm"
                  onClick={handleGenerateWithPrompt}
                  disabled={isGenerating}
                  className="shrink-0"
                >
                  Generate
                </Button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-auto pt-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPromptInput(!showPromptInput)}
              className="group"
            >
              <Sparkles className="h-4 w-4 mr-1 group-hover:text-yellow-500 transition-colors" />
              Custom Prompt
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateContent}
              className="group"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-1">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Wand2 className="h-4 w-4 transition-all group-hover:rotate-12" />
                  Generate
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPasteCommon}
              className="group"
            >
              <Clipboard className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" />
              Paste Common
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="post" className="flex-1 flex flex-col space-y-3 mt-0">
          <div className="bg-background/30 p-3 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Icon className={cn("h-5 w-5", colorClass)} />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">Your {name} Post</div>
                <div className="text-sm mt-1 whitespace-pre-wrap">{content || <span className="text-muted-foreground italic">No content yet. Switch to Compose tab to create content.</span>}</div>

                {uploadedMedia.image && (
                  <div className="mt-2 relative">
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      <Image className="h-6 w-6 text-muted-foreground" />
                      <span className="ml-2 text-xs text-muted-foreground">{uploadedMedia.image.name}</span>
                    </div>
                  </div>
                )}

                {uploadedMedia.video && (
                  <div className="mt-2 relative">
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      <Video className="h-6 w-6 text-muted-foreground" />
                      <span className="ml-2 text-xs text-muted-foreground">{uploadedMedia.video.name}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Image className="h-3 w-3 mr-1" />
                    Add Media
                  </span>
                  <span className="flex items-center">
                    <LinkIcon className="h-3 w-3 mr-1" />
                    Add Link
                  </span>
                  <span className="flex items-center">
                    <Hash className="h-3 w-3 mr-1" />
                    Add Hashtags
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Post Settings</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-background/30 p-2 rounded-lg text-center">
                <span className="text-xs block">Schedule Post</span>
              </div>
              <div className="bg-background/30 p-2 rounded-lg text-center">
                <span className="text-xs block">Audience Settings</span>
              </div>
            </div>
          </div>

          <Button
            onClick={onPostContent}
            className="mt-auto group"
            disabled={!content.trim()}
          >
            <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
            Post to {name}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
