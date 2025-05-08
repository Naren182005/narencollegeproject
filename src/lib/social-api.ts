import { generateOAuthUrl, SocialPlatform } from '@/services/authService';

/**
 * Get authentication URL for a specific platform
 * @param platform The platform to authenticate with
 * @param userId The user ID in our system
 * @returns The authentication URL
 */
export async function getAuthUrl(platform: string, userId: string): Promise<string> {
  try {
    // Use our authService to generate the OAuth URL
    return generateOAuthUrl(platform as SocialPlatform);
  } catch (error) {
    console.error('Error getting auth URL:', error);
    throw error;
  }
}

/**
 * Handle authentication callback
 * @param platform The platform being authenticated
 * @param code The authorization code
 * @returns Authentication result
 */
export async function handleAuthCallback(platform: string, code: string) {
  try {
    const response = await fetch('/api/auth/callback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform, code }),
    });

    if (!response.ok) {
      throw new Error(`Error authenticating: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error handling auth callback:', error);
    throw error;
  }
}

/**
 * Get authentication status for all platforms
 * @param userId The user ID in our system
 * @returns Authentication status
 */
export async function getAuthStatus(userId: string) {
  try {
    console.log('Getting auth status for user:', userId);

    const response = await fetch(`/api/auth/connections?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      throw new Error(`Error getting auth status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting auth status:', error);
    // Return a default status instead of throwing an error
    return {
      allAuthenticated: false,
      platforms: {
        linkedin: { authenticated: false, profile: null },
        instagram: { authenticated: false, profile: null },
        twitter: { authenticated: false, profile: null },
        facebook: { authenticated: false, profile: null },
        youtube: { authenticated: false, profile: null }
      }
    };
  }
}

/**
 * Disconnect a specific platform
 * @param platform The platform to disconnect
 * @param userId The user ID in our system
 * @param accountId The account ID to disconnect
 * @returns Disconnect result
 */
export async function disconnectPlatform(platform: string, userId: string, accountId: string) {
  try {
    const response = await fetch(`/api/auth/disconnect/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, accountId }),
    });

    if (!response.ok) {
      throw new Error(`Error disconnecting ${platform}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    throw error;
  }
}

/**
 * Disconnect all platforms
 * @param userId The user ID in our system
 * @returns Disconnect result
 */
export async function disconnectAll(userId: string) {
  try {
    const response = await fetch('/api/auth/disconnect-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Error disconnecting all platforms: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error disconnecting all platforms:', error);
    throw error;
  }
}

/**
 * Post content to a specific platform
 * @param platform The platform to post to
 * @param userId The user ID in our system
 * @param content The content to post
 * @param mediaFiles Optional media files to attach
 * @returns Posting result
 */
export async function postToSocialMedia(platform: string, userId: string, content: string | object, mediaFiles?: any) {
  try {
    console.log(`Posting to ${platform} for user ${userId}:`,
      typeof content === 'object' ? JSON.stringify(content).substring(0, 100) : content.substring(0, 100));

    const response = await fetch(`/api/post/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, content, mediaFiles }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error posting to ${platform}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    throw error;
  }
}

/**
 * Post content to multiple platforms
 * @param userId The user ID in our system
 * @param platformsContent Object mapping platforms to content
 * @param mediaFiles Optional media files to attach
 * @returns Posting results for each platform
 */
export async function postToMultiplePlatforms(userId: string, platformsContent: Record<string, string | object>, mediaFiles?: any) {
  try {
    console.log(`Posting to multiple platforms for user ${userId}:`, Object.keys(platformsContent));

    const response = await fetch('/api/post/multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, platformsContent, mediaFiles }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error posting to multiple platforms: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error posting to multiple platforms:', error);
    throw error;
  }
}

/**
 * Simulate authentication with a platform (for demo purposes)
 * @param platform The platform to simulate authentication with
 * @param userId The user ID in our system
 * @returns Simulated authentication result
 */
export async function simulateAuth(platform: string, userId: string) {
  try {
    console.log(`Simulating auth for platform ${platform} and user ${userId}`);

    const response = await fetch('/api/auth/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform, userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error simulating auth: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error simulating auth:', error);
    throw error;
  }
}
