
import React, { useState, useEffect } from 'react';
import { PlatformCard } from '@/components/PlatformCard';
import { YouTubeSection } from '@/components/YouTubeSection';
import { UniversalControls } from '@/components/UniversalControls';
import { ThemeToggle } from '@/components/ThemeToggle';
import { generateContent as apiGenerateContent, postContent } from '@/lib/api';
import { postToSocialMedia, postToMultiplePlatforms } from '@/lib/social-api';
import { toast } from '@/components/ui/sonner';
import { Sparkles, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SocialAuthPanel } from '@/components/SocialAuthPanel';
import { PlatformType } from '@/components/SocialAuthButton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

// Platform names
const platformNames: Record<PlatformType, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
};

const Index = () => {
  // State for platform content
  const [linkedinContent, setLinkedinContent] = useState('');
  const [instagramContent, setInstagramContent] = useState('');
  const [twitterContent, setTwitterContent] = useState('');
  const [facebookContent, setFacebookContent] = useState('');
  const [commonContent, setCommonContent] = useState('');

  // State for YouTube content
  const [youtubeTitle, setYoutubeTitle] = useState('');
  const [youtubeDescription, setYoutubeDescription] = useState('');
  const [youtubeTags, setYoutubeTags] = useState('');

  // State for YouTube section visibility
  const [youtubeOpen, setYoutubeOpen] = useState(false);

  // State for loading animations
  const [isGenerating, setIsGenerating] = useState(false);

  // State for social media authentication
  const [authStatus, setAuthStatus] = useState<Record<PlatformType, boolean>>({
    linkedin: false,
    instagram: false,
    twitter: false,
    facebook: false,
    youtube: false,
  });

  // State for posting
  const [isPosting, setIsPosting] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Check if all platforms are authenticated
  const allAuthenticated = Object.values(authStatus).every(status => status);

  // Check if any platform is authenticated
  const anyAuthenticated = Object.values(authStatus).some(status => status);

  // Function to generate content using the API
  const generateContent = async (platform: string, prompt?: string) => {
    console.log(`Index.tsx: Generating content for ${platform}${prompt ? ' with prompt: ' + prompt : ''}`);
    setIsGenerating(true);

    try {
      const content = await apiGenerateContent(platform, prompt || '');
      console.log(`Received content for ${platform}:`, content);

      if (platform === 'linkedin') {
        setLinkedinContent(content);
      } else if (platform === 'instagram') {
        setInstagramContent(content);
      } else if (platform === 'twitter') {
        setTwitterContent(content);
      } else if (platform === 'facebook') {
        setFacebookContent(content);
      } else if (platform === 'youtube') {
        if (typeof content === 'object' && content.title && content.description) {
          setYoutubeTitle(content.title);
          setYoutubeDescription(content.description);
          setYoutubeTags(content.tags || '');
        } else {
          console.error('Invalid YouTube content format:', content);
          toast.error('Received invalid YouTube content format');
        }
      } else if (platform === 'common') {
        setCommonContent(content);
      } else {
        console.error('Unknown platform:', platform);
      }

      toast.success(`Generated content for ${platform}${prompt ? ' with custom prompt' : ''}`);
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(`Failed to generate content for ${platform}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to handle posting content to all platforms
  const handlePostToAll = async () => {
    // Check if authenticated with any platform
    if (!anyAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    setIsPosting(true);

    try {
      // Create a map of platforms to content
      const platformsContent: Record<string, string | object> = {};

      // Only include platforms that are authenticated
      if (authStatus.linkedin && linkedinContent) {
        platformsContent.linkedin = linkedinContent;
      }

      if (authStatus.instagram && instagramContent) {
        platformsContent.instagram = instagramContent;
      }

      if (authStatus.twitter && twitterContent) {
        platformsContent.twitter = twitterContent;
      }

      if (authStatus.facebook && facebookContent) {
        platformsContent.facebook = facebookContent;
      }

      if (authStatus.youtube && youtubeTitle && youtubeDescription) {
        platformsContent.youtube = {
          title: youtubeTitle,
          description: youtubeDescription,
          tags: youtubeTags
        };
      }

      // Check if there's any content to post
      if (Object.keys(platformsContent).length === 0) {
        toast.error('No content to post. Please generate content and connect to at least one platform.');
        return;
      }

      // Post to all authenticated platforms
      const results = await postToMultiplePlatforms(platformsContent);

      // Count successful posts
      const successCount = Object.values(results).filter(result => result.success).length;

      if (successCount > 0) {
        toast.success(`Content posted to ${successCount} platform${successCount > 1 ? 's' : ''}`);
      } else {
        toast.error('Failed to post to any platform');
      }
    } catch (error) {
      console.error('Error posting to all platforms:', error);
      toast.error('Failed to post to all platforms');
    } finally {
      setIsPosting(false);
    }
  };

  // Function to handle posting YouTube content
  const handlePostToYouTube = async () => {
    // Check if authenticated with YouTube
    if (!authStatus.youtube) {
      setShowAuthDialog(true);
      return;
    }

    setIsPosting(true);

    try {
      // Check if there's content to post
      if (!youtubeTitle || !youtubeDescription) {
        toast.error('Please provide a title and description for your YouTube video');
        return;
      }

      // Post to YouTube
      const result = await postToSocialMedia('youtube', {
        title: youtubeTitle,
        description: youtubeDescription,
        tags: youtubeTags
      });

      if (result.success) {
        toast.success('Content posted to YouTube');
      } else {
        toast.error(`Failed to post to YouTube: ${result.error}`);
      }
    } catch (error) {
      console.error('Error posting to YouTube:', error);
      toast.error('Failed to post to YouTube');
    } finally {
      setIsPosting(false);
    }
  };

  // Handle authentication status change
  const handleAuthStatusChange = (status: Record<PlatformType, boolean>) => {
    setAuthStatus(status);
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Enhanced Header */}
      <header className="glass-card sticky top-0 z-50 backdrop-blur-lg border-b border-white/10 px-4 py-3 mb-6">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient">SocialMuse</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Social Media Content Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>AI Connected</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4">
        {/* Main content */}
        <main className="space-y-6">
          {/* Authentication status indicator */}
          {anyAuthenticated ? (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>
                  Connected to {Object.entries(authStatus)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => platformNames[key as PlatformType])
                    .join(', ')}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAuthDialog(true)}>
                Manage Connections
              </Button>
            </div>
          ) : (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <span>Connect to social media platforms to enable posting</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowAuthDialog(true)}>
                Connect Accounts
              </Button>
            </div>
          )}

          {/* Top bar with universal controls */}
          <UniversalControls
            onGenerateCommonContent={() => generateContent('common')}
            onPasteToAll={() => {
              setLinkedinContent(commonContent);
              setInstagramContent(commonContent);
              setTwitterContent(commonContent);
              setFacebookContent(commonContent);
            }}
            onPostToAll={handlePostToAll}
            isGenerating={isGenerating || isPosting}
            className="sticky top-[72px] z-40"
          />

          {/* Platform cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <PlatformCard
              platform="linkedin"
              content={linkedinContent}
              onContentChange={setLinkedinContent}
              onGenerateContent={(prompt) => generateContent('linkedin', prompt)}
              onPasteCommon={() => setLinkedinContent(commonContent)}
              onPostContent={() => postContent('linkedin', linkedinContent)}
              isGenerating={isGenerating}
            />
            <PlatformCard
              platform="instagram"
              content={instagramContent}
              onContentChange={setInstagramContent}
              onGenerateContent={(prompt) => generateContent('instagram', prompt)}
              onPasteCommon={() => setInstagramContent(commonContent)}
              onPostContent={() => postContent('instagram', instagramContent)}
              isGenerating={isGenerating}
            />
            <PlatformCard
              platform="twitter"
              content={twitterContent}
              onContentChange={setTwitterContent}
              onGenerateContent={(prompt) => generateContent('twitter', prompt)}
              onPasteCommon={() => setTwitterContent(commonContent)}
              onPostContent={() => postContent('twitter', twitterContent)}
              isGenerating={isGenerating}
            />
            <PlatformCard
              platform="facebook"
              content={facebookContent}
              onContentChange={setFacebookContent}
              onGenerateContent={(prompt) => generateContent('facebook', prompt)}
              onPasteCommon={() => setFacebookContent(commonContent)}
              onPostContent={() => postContent('facebook', facebookContent)}
              isGenerating={isGenerating}
            />
          </div>

          {/* YouTube section (collapsible) */}
          <YouTubeSection
            title={youtubeTitle}
            description={youtubeDescription}
            tags={youtubeTags}
            onTitleChange={setYoutubeTitle}
            onDescriptionChange={setYoutubeDescription}
            onTagsChange={setYoutubeTags}
            onGenerateContent={() => generateContent('youtube')}
            onPostToYouTube={handlePostToYouTube}
            isGenerating={isGenerating}
          />
        </main>

        {/* Footer */}
        <footer className="mt-10 text-center text-sm text-muted-foreground">
          <p>SocialMuse © 2025 - The ultimate social media content generator</p>
        </footer>
      </div>

      {/* Authentication Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Social Media Accounts</DialogTitle>
            <DialogDescription>
              Connect your social media accounts to post content directly from SocialMuse.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <SocialAuthPanel onAuthStatusChange={handleAuthStatusChange} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
