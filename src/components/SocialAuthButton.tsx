import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  LogIn,
  LogOut,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { simulateAuth, disconnectPlatform, getAuthUrl } from '@/lib/social-api';
import { toast } from '@/components/ui/sonner';
import {
  SocialPlatform,
  removeAuthData,
  saveAuthData
} from '@/services/authService';

// Define platform types
export type PlatformType = 'linkedin' | 'instagram' | 'twitter' | 'facebook' | 'youtube';

// Platform icons
const platformIcons = {
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
};

// Platform colors
const platformColors = {
  linkedin: 'text-[#0a66c2]',
  instagram: 'text-[#e4405f]',
  twitter: 'text-[#1DA1F2]',
  facebook: 'text-[#1877f2]',
  youtube: 'text-[#ff0000]',
};

// Platform names
const platformNames = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  twitter: 'Twitter',
  facebook: 'Facebook',
  youtube: 'YouTube',
};

interface SocialAuthButtonProps {
  platform: PlatformType;
  isAuthenticated: boolean;
  profile?: any;
  onAuthChange: (platform: PlatformType, isAuthenticated: boolean, profile?: any) => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showName?: boolean;
}

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  platform,
  isAuthenticated,
  profile,
  onAuthChange,
  className,
  size = 'default',
  showName = true,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const Icon = platformIcons[platform];
  const colorClass = platformColors[platform];
  const name = platformNames[platform];

  const handleAuth = async () => {
    if (isAuthenticated) {
      // Disconnect
      try {
        setIsLoading(true);

        // Get the account ID from props or context
        const accountId = profile?.id;
        if (!accountId) {
          throw new Error('Account ID not found');
        }

        // Remove auth data from localStorage
        removeAuthData(platform as SocialPlatform);

        // For API integration (can be removed if not needed)
        const userId = window.localStorage.getItem('userId') || 'demo-user-123';
        await disconnectPlatform(platform, userId, accountId);

        onAuthChange(platform, false);
        toast.success(`Disconnected from ${name}`);
      } catch (error) {
        console.error(`Error disconnecting from ${platform}:`, error);
        toast.error(`Failed to disconnect from ${name}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);

        // Get the user ID from props or context
        const userId = window.localStorage.getItem('userId') || 'demo-user-123';

        // Get the OAuth URL
        const authUrl = await getAuthUrl(platform, userId);

        if (!authUrl) {
          throw new Error(`Failed to generate OAuth URL for ${platform}`);
        }

        // Open the OAuth URL in a popup window
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const authWindow = window.open(
          authUrl,
          `${platform}-auth`,
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // For demo purposes, simulate successful authentication after a delay
        // In a real app, this would be handled by the OAuth callback
        setTimeout(() => {
          if (authWindow) {
            authWindow.close();
          }

          // Simulate a successful authentication
          simulateAuth(platform, userId).then(result => {
            if (result.success) {
              // Save the auth data to localStorage
              saveAuthData(platform as SocialPlatform, {
                id: result.profile.id,
                name: result.profile.name,
                username: result.profile.username,
                email: result.profile.email,
                picture: result.profile.picture,
                accessToken: `mock-token-${Math.random().toString(36).substring(2)}`,
                refreshToken: `mock-refresh-${Math.random().toString(36).substring(2)}`,
                expiresAt: Date.now() + 3600000, // 1 hour from now
              });

              onAuthChange(platform, true, result.profile);
              toast.success(`Connected to ${name}`);
            } else {
              toast.error(`Failed to connect to ${name}`);
            }
            setIsLoading(false);
          });
        }, 2000);

        return; // Early return to prevent setIsLoading(false) from being called
      } catch (error) {
        console.error(`Error authenticating with ${platform}:`, error);
        toast.error(`Failed to connect to ${name}`);
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      variant={isAuthenticated ? "default" : "outline"}
      size={size}
      onClick={handleAuth}
      disabled={isLoading}
      className={cn(
        "transition-all duration-300 font-medium relative overflow-hidden",
        isAuthenticated
          ? "bg-gradient-to-r from-primary/80 to-primary shadow-md shadow-primary/20"
          : "border-gray-700 hover:border-gray-600 hover:bg-gray-800/50",
        className
      )}
    >
      <div className={cn(
        "absolute inset-0 opacity-20 transition-opacity",
        isAuthenticated ? "opacity-30" : "opacity-0"
      )}>
        {isAuthenticated && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/0 animate-pulse"></div>
        )}
      </div>

      <div className="relative flex items-center">
        {isLoading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Connecting...</span>
          </div>
        ) : isAuthenticated ? (
          <>
            <div className="flex items-center justify-center h-5 w-5 rounded-full bg-white/20 mr-2">
              <Check className="h-3 w-3 text-white" />
            </div>
            <Icon className={cn(
              "h-5 w-5 transition-transform",
              isAuthenticated ? "text-white" : colorClass
            )} />
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4 mr-2" />
            <Icon className={cn(
              "h-5 w-5 transition-transform",
              colorClass
            )} />
          </>
        )}

        {showName && (
          <span className={cn(
            "ml-2 transition-all",
            isAuthenticated ? "text-white" : ""
          )}>
            {isAuthenticated ? `${name} Connected` : `Connect ${name}`}
          </span>
        )}
      </div>
    </Button>
  );
};

export default SocialAuthButton;
