
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
      'hover:shadow-xl hover:scale-[1.01] transition-all duration-300 border border-gray-800/50',
      'bg-gradient-to-br from-gray-900/90 to-gray-950/90 backdrop-blur-md',
      className
    )}>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center justify-center h-9 w-9 rounded-full",
            `bg-${platform}/10 border border-${platform}/20`
          )}>
            <Icon className={cn("h-5 w-5", colorClass)} />
          </div>
          <h3 className={cn(
            "font-bold text-transparent bg-clip-text",
            `bg-gradient-to-r from-${platform} to-${platform}/70`
          )}>
            {name}
          </h3>
        </div>
        <MediaUpload
          platformName={platform}
          onImageUpload={handleImageUpload}
          onVideoUpload={handleVideoUpload}
          supportedTypes={platformMediaSupport[platform]}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className={cn(
          "grid grid-cols-2 mb-4 p-1 bg-gray-900/50 border border-gray-800/50 rounded-lg",
          `hover:border-${platform}/30 transition-colors duration-300`
        )}>
          <TabsTrigger
            value="compose"
            className={cn(
              "text-xs font-medium py-2 rounded-md transition-all duration-300",
              activeTab === 'compose'
                ? `bg-gradient-to-r from-${platform}/20 to-${platform}/10 text-${platform} shadow-sm`
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Compose
          </TabsTrigger>
          <TabsTrigger
            value="post"
            className={cn(
              "text-xs font-medium py-2 rounded-md transition-all duration-300",
              activeTab === 'post'
                ? `bg-gradient-to-r from-${platform}/20 to-${platform}/10 text-${platform} shadow-sm`
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Post
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="flex-1 flex flex-col space-y-3 mt-0">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "flex-1 min-h-[120px] resize-none rounded-xl",
              "bg-gray-900/30 border-gray-800/70 focus:border-gray-700",
              "placeholder:text-gray-600 text-gray-200",
              "transition-all duration-300",
              `focus:ring-1 focus:ring-${platform}/30`
            )}
          />

          {showPromptInput ? (
            <div className={cn(
              "flex flex-col space-y-2 animate-in fade-in-50 duration-300",
              "p-3 rounded-xl bg-gradient-to-r from-amber-950/20 to-amber-900/10",
              "border border-amber-800/20"
            )}>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-5 w-5 rounded-full bg-amber-500/10">
                  <Lightbulb className="h-3 w-3 text-amber-500" />
                </div>
                <span className="text-xs font-medium text-amber-200">Custom AI Prompt</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`E.g., Create content about our new product launch for ${name}`}
                  className="text-xs bg-gray-900/50 border-gray-800 focus:border-amber-700/50 text-gray-300"
                />
                <Button
                  size="sm"
                  onClick={handleGenerateWithPrompt}
                  disabled={isGenerating}
                  className={cn(
                    "shrink-0 bg-gradient-to-r from-amber-600 to-amber-700 text-white",
                    "hover:opacity-90 transition-opacity border-0",
                    isGenerating ? "opacity-70" : ""
                  )}
                >
                  {isGenerating ? (
                    <span className="h-3.5 w-3.5 mr-1.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Generate
                </Button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2 mt-auto pt-3 border-t border-gray-800/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPromptInput(!showPromptInput)}
              className={cn(
                "group relative overflow-hidden",
                "border-gray-800 bg-gray-900/30 hover:bg-amber-950/20 hover:border-amber-700/30",
                "text-gray-400 hover:text-amber-300 transition-all duration-300"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-amber-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center">
                <Sparkles className="h-4 w-4 mr-1.5 text-amber-500 group-hover:animate-pulse" />
                Custom Prompt
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateContent}
              className={cn(
                "group relative overflow-hidden",
                "border-gray-800 bg-gray-900/30",
                isGenerating
                  ? "opacity-70"
                  : `hover:bg-${platform}/10 hover:border-${platform}/30 hover:text-${platform}`,
                "text-gray-400 transition-all duration-300"
              )}
              disabled={isGenerating}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center">
                {isGenerating ? (
                  <span className="flex items-center gap-1.5">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <Wand2 className={cn("h-4 w-4 transition-all group-hover:rotate-12", `group-hover:text-${platform}`)} />
                    Generate
                  </span>
                )}
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={onPasteCommon}
              className={cn(
                "group relative",
                "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50",
                "transition-all duration-300"
              )}
            >
              <Clipboard className="h-4 w-4 mr-1.5 group-hover:scale-110 transition-transform" />
              Paste Common
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="post" className="flex-1 flex flex-col space-y-3 mt-0">
          <div className={cn(
            "bg-gray-900/40 p-4 rounded-xl border border-gray-800/50",
            `hover:border-${platform}/20 transition-colors duration-300`
          )}>
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-md"
              )}>
                <Icon className={cn("h-6 w-6", colorClass)} />
              </div>
              <div className="flex-1">
                <div className={cn(
                  "font-medium text-sm flex items-center",
                  `text-${platform}`
                )}>
                  <span>Your {name} Post</span>
                  <div className="ml-2 px-1.5 py-0.5 rounded-full bg-gray-800 text-gray-400 text-xs">Preview</div>
                </div>

                <div className="text-sm mt-2 whitespace-pre-wrap text-gray-300 bg-gray-900/30 p-3 rounded-lg border border-gray-800/50">
                  {content ? (
                    content
                  ) : (
                    <span className="text-gray-500 italic flex items-center">
                      <MessageSquare className="h-3.5 w-3.5 mr-1.5 opacity-70" />
                      No content yet. Switch to Compose tab to create content.
                    </span>
                  )}
                </div>

                {uploadedMedia.image && (
                  <div className="mt-3 relative">
                    <div className={cn(
                      "w-full h-36 rounded-lg overflow-hidden border border-gray-800",
                      "bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center"
                    )}>
                      <div className="bg-gray-800/50 p-2 rounded-full mb-2">
                        <Image className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-400">{uploadedMedia.image.name}</span>
                      <span className="text-xs text-gray-500 mt-1">Image attached</span>
                    </div>
                  </div>
                )}

                {uploadedMedia.video && (
                  <div className="mt-3 relative">
                    <div className={cn(
                      "w-full h-36 rounded-lg overflow-hidden border border-gray-800",
                      "bg-gradient-to-br from-gray-900 to-gray-950 flex flex-col items-center justify-center"
                    )}>
                      <div className="bg-gray-800/50 p-2 rounded-full mb-2">
                        <Video className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-xs text-gray-400">{uploadedMedia.video.name}</span>
                      <span className="text-xs text-gray-500 mt-1">Video attached</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-4 text-xs">
                  <span className={cn(
                    "flex items-center px-2 py-1 rounded-full",
                    "bg-gray-800/70 text-gray-400 hover:text-gray-300 hover:bg-gray-800",
                    "cursor-pointer transition-colors duration-200"
                  )}>
                    <Image className="h-3.5 w-3.5 mr-1.5" />
                    Add Media
                  </span>
                  <span className={cn(
                    "flex items-center px-2 py-1 rounded-full",
                    "bg-gray-800/70 text-gray-400 hover:text-gray-300 hover:bg-gray-800",
                    "cursor-pointer transition-colors duration-200"
                  )}>
                    <LinkIcon className="h-3.5 w-3.5 mr-1.5" />
                    Add Link
                  </span>
                  <span className={cn(
                    "flex items-center px-2 py-1 rounded-full",
                    "bg-gray-800/70 text-gray-400 hover:text-gray-300 hover:bg-gray-800",
                    "cursor-pointer transition-colors duration-200"
                  )}>
                    <Hash className="h-3.5 w-3.5 mr-1.5" />
                    Add Hashtags
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn(
                "text-xs font-medium flex items-center",
                `text-${platform}/80`
              )}>
                <div className={cn(
                  "w-4 h-4 rounded-full mr-1.5 flex items-center justify-center",
                  `bg-${platform}/10`
                )}>
                  <Icon className={cn("h-2.5 w-2.5", colorClass)} />
                </div>
                Post Settings
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={cn(
                "bg-gray-900/40 p-3 rounded-lg border border-gray-800/50",
                "hover:border-gray-700/50 transition-colors duration-300",
                "flex items-center justify-center cursor-pointer"
              )}>
                <span className="text-xs flex items-center text-gray-400 hover:text-gray-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Schedule Post
                </span>
              </div>
              <div className={cn(
                "bg-gray-900/40 p-3 rounded-lg border border-gray-800/50",
                "hover:border-gray-700/50 transition-colors duration-300",
                "flex items-center justify-center cursor-pointer"
              )}>
                <span className="text-xs flex items-center text-gray-400 hover:text-gray-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Audience Settings
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={onPostContent}
            className={cn(
              "mt-auto group relative overflow-hidden",
              !content.trim()
                ? "opacity-70 bg-gray-800 cursor-not-allowed"
                : `bg-gradient-to-r from-${platform} to-${platform}/80 hover:opacity-90 shadow-md`,
              "transition-all duration-300"
            )}
            disabled={!content.trim()}
          >
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center justify-center">
              <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
              Post to {name}
            </div>
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
