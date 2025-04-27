/**
 * Get authentication URL for a specific platform
 * @param platform The platform to authenticate with
 * @returns The authentication URL
 */
export async function getAuthUrl(platform: string): Promise<string> {
  try {
    const response = await fetch(`/api/auth/url/${platform}`);
    
    if (!response.ok) {
      throw new Error(`Error getting auth URL: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.url;
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
 * @returns Authentication status
 */
export async function getAuthStatus() {
  try {
    const response = await fetch('/api/auth/status');
    
    if (!response.ok) {
      throw new Error(`Error getting auth status: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting auth status:', error);
    throw error;
  }
}

/**
 * Logout from a specific platform
 * @param platform The platform to logout from
 * @returns Logout result
 */
export async function logout(platform: string) {
  try {
    const response = await fetch(`/api/auth/logout/${platform}`, {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error logging out: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
}

/**
 * Logout from all platforms
 * @returns Logout result
 */
export async function logoutAll() {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
    });
    
    if (!response.ok) {
      throw new Error(`Error logging out from all platforms: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error logging out from all platforms:', error);
    throw error;
  }
}

/**
 * Post content to a specific platform
 * @param platform The platform to post to
 * @param content The content to post
 * @param mediaFiles Optional media files to attach
 * @returns Posting result
 */
export async function postToSocialMedia(platform: string, content: string | object, mediaFiles?: any) {
  try {
    const response = await fetch(`/api/post/${platform}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, mediaFiles }),
    });
    
    if (!response.ok) {
      throw new Error(`Error posting to ${platform}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    throw error;
  }
}

/**
 * Post content to multiple platforms
 * @param platformsContent Object mapping platforms to content
 * @param mediaFiles Optional media files to attach
 * @returns Posting results for each platform
 */
export async function postToMultiplePlatforms(platformsContent: Record<string, string | object>, mediaFiles?: any) {
  try {
    const response = await fetch('/api/post/multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platformsContent, mediaFiles }),
    });
    
    if (!response.ok) {
      throw new Error(`Error posting to multiple platforms: ${response.statusText}`);
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
 * @returns Simulated authentication result
 */
export async function simulateAuth(platform: string) {
  try {
    const response = await fetch('/api/auth/simulate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform }),
    });
    
    if (!response.ok) {
      throw new Error(`Error simulating auth: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error simulating auth:', error);
    throw error;
  }
}
