import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  LogIn,
  LogOut,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import SocialAuthButton, { PlatformType } from './SocialAuthButton';
import { getAuthStatus, disconnectAll } from '@/lib/social-api';
import { toast } from '@/components/ui/sonner';
import {
  SocialPlatform,
  getAuthData,
  getConnectedPlatforms,
  clearAllAuthData
} from '@/services/authService';

interface SocialAuthPanelProps {
  onAuthStatusChange: (status: Record<PlatformType, boolean>) => void;
  className?: string;
}

export const SocialAuthPanel: React.FC<SocialAuthPanelProps> = ({
  onAuthStatusChange,
  className,
}) => {
  const [authStatus, setAuthStatus] = useState<Record<PlatformType, boolean>>({
    linkedin: false,
    instagram: false,
    twitter: false,
    facebook: false,
    youtube: false,
  });

  const [profiles, setProfiles] = useState<Record<PlatformType, any>>({
    linkedin: null,
    instagram: null,
    twitter: null,
    facebook: null,
    youtube: null,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const platforms: PlatformType[] = ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'];

  // Fetch initial auth status
  useEffect(() => {
    fetchAuthStatus();
  }, []);

  // Notify parent component when auth status changes
  useEffect(() => {
    onAuthStatusChange(authStatus);
  }, [authStatus, onAuthStatusChange]);

  const fetchAuthStatus = async () => {
    try {
      setIsRefreshing(true);

      // Get connected platforms from localStorage
      const connectedPlatforms = getConnectedPlatforms();

      const newAuthStatus: Record<PlatformType, boolean> = {
        linkedin: false,
        instagram: false,
        twitter: false,
        facebook: false,
        youtube: false,
      };

      const newProfiles: Record<PlatformType, any> = {
        linkedin: null,
        instagram: null,
        twitter: null,
        facebook: null,
        youtube: null,
      };

      // Check each platform's authentication status
      platforms.forEach(platform => {
        const authData = getAuthData(platform as SocialPlatform);
        newAuthStatus[platform] = authData !== null;

        if (authData) {
          newProfiles[platform] = {
            id: authData.id,
            name: authData.name,
            username: authData.username,
            email: authData.email,
            picture: authData.picture
          };
        }
      });

      setAuthStatus(newAuthStatus);
      setProfiles(newProfiles);

      // For backward compatibility, also call the API
      try {
        const userId = window.localStorage.getItem('userId') || 'demo-user-123';
        await getAuthStatus(userId);
      } catch (apiError) {
        console.warn('API call failed, but local auth data was used:', apiError);
      }
    } catch (error) {
      console.error('Error fetching auth status:', error);
      toast.error('Failed to fetch authentication status');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleAuthChange = (platform: PlatformType, isAuthenticated: boolean, profile?: any) => {
    setAuthStatus(prev => ({
      ...prev,
      [platform]: isAuthenticated
    }));

    if (profile) {
      setProfiles(prev => ({
        ...prev,
        [platform]: profile
      }));
    } else if (!isAuthenticated) {
      setProfiles(prev => ({
        ...prev,
        [platform]: null
      }));
    }
  };

  const handleDisconnectAll = async () => {
    try {
      setIsLoggingOut(true);

      // Clear all auth data from localStorage
      clearAllAuthData();

      // For backward compatibility, also call the API
      try {
        const userId = window.localStorage.getItem('userId') || 'demo-user-123';
        await disconnectAll(userId);
      } catch (apiError) {
        console.warn('API call failed, but local auth data was cleared:', apiError);
      }

      const newAuthStatus: Record<PlatformType, boolean> = {
        linkedin: false,
        instagram: false,
        twitter: false,
        facebook: false,
        youtube: false,
      };

      const newProfiles: Record<PlatformType, any> = {
        linkedin: null,
        instagram: null,
        twitter: null,
        facebook: null,
        youtube: null,
      };

      setAuthStatus(newAuthStatus);
      setProfiles(newProfiles);

      toast.success('Disconnected from all platforms');
    } catch (error) {
      console.error('Error disconnecting from all platforms:', error);
      toast.error('Failed to disconnect from all platforms');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const connectedCount = Object.values(authStatus).filter(Boolean).length;
  const allConnected = connectedCount === platforms.length;

  return (
    <Card className={cn("w-full bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800 shadow-xl", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Social Media Accounts
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Connect your social media accounts to post content
            </CardDescription>
          </div>
          <Badge
            variant={allConnected ? "default" : "outline"}
            className={cn(
              "text-sm font-medium px-3 py-1 rounded-full transition-all duration-300",
              allConnected
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0"
                : "border border-gray-700 text-gray-400"
            )}
          >
            {connectedCount}/{platforms.length} Connected
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="relative">
              <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {platforms.map(platform => (
              <div
                key={platform}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl transition-all duration-300",
                  authStatus[platform]
                    ? "bg-gradient-to-r from-gray-800/50 to-gray-800/30 border border-gray-700/50"
                    : "bg-gray-900/30 border border-gray-800/50 hover:bg-gray-800/20"
                )}
              >
                <div className="flex items-center gap-4">
                  <SocialAuthButton
                    platform={platform}
                    isAuthenticated={authStatus[platform]}
                    profile={profiles[platform]}
                    onAuthChange={handleAuthChange}
                    size="default"
                  />

                  {profiles[platform] ? (
                    <div className="flex items-center">
                      {profiles[platform].picture && (
                        <img
                          src={profiles[platform].picture}
                          alt={profiles[platform].name}
                          className="h-8 w-8 rounded-full mr-3 border border-gray-700"
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{profiles[platform].name}</div>
                        <div className="text-sm text-gray-400">@{profiles[platform].username}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Not connected
                    </div>
                  )}
                </div>

                <div>
                  {authStatus[platform] ? (
                    <div className="flex items-center text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      <span className="text-xs font-medium">Connected</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                      <XCircle className="h-4 w-4 mr-1.5" />
                      <span className="text-xs font-medium">Disconnected</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Separator className="bg-gray-800" />

      <CardFooter className="flex justify-between py-5 px-6">
        <div className="flex items-center">
          {allConnected ? (
            <div className="flex items-center text-sm text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              <span className="font-medium">All accounts connected</span>
            </div>
          ) : (
            <div className="flex items-center text-sm text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full">
              <AlertCircle className="h-4 w-4 mr-1.5" />
              <span className="font-medium">Connect all for cross-posting</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAuthStatus}
            disabled={isRefreshing}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDisconnectAll}
            disabled={isLoggingOut || connectedCount === 0}
            className={cn(
              "bg-gradient-to-r hover:opacity-90 transition-opacity",
              connectedCount > 0 ? "from-red-600 to-red-700" : "from-gray-700 to-gray-800 opacity-50"
            )}
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Disconnect All
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialAuthPanel;
