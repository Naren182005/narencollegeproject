import { AES, enc } from 'crypto-js';

// Secret key for AES encryption (in a real app, this would be stored securely)
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'media-muse-secret-key';

export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube';

export interface SocialProfile {
  id: string;
  name: string;
  username: string;
  email?: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

// OAuth configuration for each platform
export const oauthConfig = {
  facebook: {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/facebook`,
    scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts',
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
  },
  twitter: {
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/twitter`,
    scope: 'tweet.read,tweet.write,users.read,offline.access',
    authUrl: 'https://twitter.com/i/oauth2/authorize',
  },
  linkedin: {
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/linkedin`,
    scope: 'r_liteprofile,r_emailaddress,w_member_social',
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
  },
  instagram: {
    clientId: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/instagram`,
    scope: 'user_profile,user_media',
    authUrl: 'https://api.instagram.com/oauth/authorize',
  },
  youtube: {
    clientId: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/callback/youtube`,
    scope: 'https://www.googleapis.com/auth/youtube.upload,https://www.googleapis.com/auth/youtube',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
  },
};

// Generate OAuth URL for a specific platform
export const generateOAuthUrl = (platform: SocialPlatform): string => {
  const config = oauthConfig[platform];
  
  if (!config.clientId) {
    console.error(`Client ID for ${platform} is not configured`);
    return '';
  }
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    state: platform,
  });
  
  // Add platform-specific parameters
  if (platform === 'twitter') {
    params.append('code_challenge', 'challenge'); // In a real app, generate a proper code challenge
    params.append('code_challenge_method', 'plain');
  }
  
  return `${config.authUrl}?${params.toString()}`;
};

// Encrypt token data using AES-256
export const encryptToken = (data: SocialProfile): string => {
  return AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt token data
export const decryptToken = (encryptedData: string): SocialProfile | null => {
  try {
    const bytes = AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(enc.Utf8);
    return JSON.parse(decryptedData);
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return null;
  }
};

// Save auth data to localStorage with encryption
export const saveAuthData = (platform: SocialPlatform, profile: SocialProfile): void => {
  try {
    const encryptedData = encryptToken(profile);
    localStorage.setItem(`auth_${platform}`, encryptedData);
    
    // Update the platforms list
    const platforms = getConnectedPlatforms();
    if (!platforms.includes(platform)) {
      platforms.push(platform);
      localStorage.setItem('connected_platforms', JSON.stringify(platforms));
    }
  } catch (error) {
    console.error(`Failed to save auth data for ${platform}:`, error);
  }
};

// Get auth data from localStorage with decryption
export const getAuthData = (platform: SocialPlatform): SocialProfile | null => {
  try {
    const encryptedData = localStorage.getItem(`auth_${platform}`);
    if (!encryptedData) return null;
    
    return decryptToken(encryptedData);
  } catch (error) {
    console.error(`Failed to get auth data for ${platform}:`, error);
    return null;
  }
};

// Remove auth data for a platform
export const removeAuthData = (platform: SocialPlatform): void => {
  try {
    localStorage.removeItem(`auth_${platform}`);
    
    // Update the platforms list
    const platforms = getConnectedPlatforms();
    const updatedPlatforms = platforms.filter(p => p !== platform);
    localStorage.setItem('connected_platforms', JSON.stringify(updatedPlatforms));
  } catch (error) {
    console.error(`Failed to remove auth data for ${platform}:`, error);
  }
};

// Get all connected platforms
export const getConnectedPlatforms = (): SocialPlatform[] => {
  try {
    const platforms = localStorage.getItem('connected_platforms');
    return platforms ? JSON.parse(platforms) : [];
  } catch (error) {
    console.error('Failed to get connected platforms:', error);
    return [];
  }
};

// Check if a platform is authenticated
export const isAuthenticated = (platform: SocialPlatform): boolean => {
  return getAuthData(platform) !== null;
};

// Remove all auth data (logout from all platforms)
export const clearAllAuthData = (): void => {
  try {
    const platforms = getConnectedPlatforms();
    platforms.forEach(platform => {
      localStorage.removeItem(`auth_${platform}`);
    });
    localStorage.removeItem('connected_platforms');
  } catch (error) {
    console.error('Failed to clear all auth data:', error);
  }
};
