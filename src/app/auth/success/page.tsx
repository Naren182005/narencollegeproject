'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { saveAuthData, SocialPlatform } from '@/services/authService';
import { Loader2 } from 'lucide-react';

// Mock function to simulate token exchange
// In a real app, this would be a server-side API call
const exchangeCodeForToken = async (platform: SocialPlatform, code: string) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock response data
  const mockProfiles = {
    facebook: {
      id: 'fb123456',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      picture: 'https://i.pravatar.cc/150?u=facebook',
      accessToken: 'mock-fb-token-' + Math.random().toString(36).substring(2),
      refreshToken: 'mock-fb-refresh-' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 3600000, // 1 hour from now
    },
    twitter: {
      id: 'tw123456',
      name: 'John Doe',
      username: 'johndoe',
      picture: 'https://i.pravatar.cc/150?u=twitter',
      accessToken: 'mock-tw-token-' + Math.random().toString(36).substring(2),
      refreshToken: 'mock-tw-refresh-' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 3600000,
    },
    linkedin: {
      id: 'li123456',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      picture: 'https://i.pravatar.cc/150?u=linkedin',
      accessToken: 'mock-li-token-' + Math.random().toString(36).substring(2),
      refreshToken: 'mock-li-refresh-' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 3600000,
    },
    instagram: {
      id: 'ig123456',
      name: 'John Doe',
      username: 'johndoe',
      picture: 'https://i.pravatar.cc/150?u=instagram',
      accessToken: 'mock-ig-token-' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 3600000,
    },
    youtube: {
      id: 'yt123456',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      picture: 'https://i.pravatar.cc/150?u=youtube',
      accessToken: 'mock-yt-token-' + Math.random().toString(36).substring(2),
      refreshToken: 'mock-yt-refresh-' + Math.random().toString(36).substring(2),
      expiresAt: Date.now() + 3600000,
    },
  };
  
  return mockProfiles[platform];
};

export default function AuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform') as SocialPlatform;
  const code = searchParams.get('code');
  
  useEffect(() => {
    const handleAuth = async () => {
      if (!platform || !code) {
        router.push('/');
        return;
      }
      
      try {
        // Exchange code for token
        const profile = await exchangeCodeForToken(platform, code);
        
        // Save the auth data
        saveAuthData(platform, profile);
        
        // Redirect back to the app
        router.push('/');
      } catch (error) {
        console.error('Failed to complete authentication:', error);
        router.push(`/auth/error?platform=${platform}&error=token_exchange_failed`);
      }
    };
    
    handleAuth();
  }, [platform, code, router]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 shadow-xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">Authentication Successful</h2>
          <p className="mt-2 text-gray-400">
            Connecting your {platform} account...
          </p>
        </div>
        
        <div className="flex justify-center py-8">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </div>
        </div>
        
        <p className="text-center text-sm text-gray-500">
          You will be redirected back to the application automatically.
        </p>
      </div>
    </div>
  );
}
