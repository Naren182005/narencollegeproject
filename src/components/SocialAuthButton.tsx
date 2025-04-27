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
import { simulateAuth, logout } from '@/lib/social-api';
import { toast } from '@/components/ui/sonner';

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
  onAuthChange: (platform: PlatformType, isAuthenticated: boolean, profile?: any) => void;
  className?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showName?: boolean;
}

export const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({
  platform,
  isAuthenticated,
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
      // Logout
      try {
        setIsLoading(true);
        await logout(platform);
        onAuthChange(platform, false);
        toast.success(`Logged out from ${name}`);
      } catch (error) {
        console.error(`Error logging out from ${platform}:`, error);
        toast.error(`Failed to logout from ${name}`);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Login (using simulation for demo)
      try {
        setIsLoading(true);
        const result = await simulateAuth(platform);
        if (result.success) {
          onAuthChange(platform, true, result.profile);
          toast.success(`Connected to ${name}`);
        } else {
          toast.error(`Failed to connect to ${name}`);
        }
      } catch (error) {
        console.error(`Error authenticating with ${platform}:`, error);
        toast.error(`Failed to connect to ${name}`);
      } finally {
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
        "transition-all duration-300",
        isAuthenticated ? "bg-gradient-to-r from-primary/80 to-primary" : "",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isAuthenticated ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          <Icon className={cn("h-4 w-4", isAuthenticated ? "text-white" : colorClass)} />
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4 mr-2" />
          <Icon className={cn("h-4 w-4", colorClass)} />
        </>
      )}
      
      {showName && (
        <span className="ml-2">
          {isAuthenticated ? `${name} Connected` : `Connect ${name}`}
        </span>
      )}
    </Button>
  );
};

export default SocialAuthButton;
