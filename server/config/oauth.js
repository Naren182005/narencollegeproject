// OAuth configuration for social media platforms
require('dotenv').config();

// Base URL for redirects
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';

// OAuth configurations for each platform
const oauthConfig = {
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'your-linkedin-client-secret',
    redirectUri: `${BASE_URL}/api/auth/callback/linkedin`,
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scope: 'r_liteprofile r_emailaddress w_member_social',
    profileUrl: 'https://api.linkedin.com/v2/me',
    emailUrl: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
  },
  
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || 'your-twitter-client-id',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || 'your-twitter-client-secret',
    redirectUri: `${BASE_URL}/api/auth/callback/twitter`,
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scope: 'tweet.read tweet.write users.read offline.access',
    profileUrl: 'https://api.twitter.com/2/users/me',
  },
  
  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || 'your-facebook-app-id',
    clientSecret: process.env.FACEBOOK_APP_SECRET || 'your-facebook-app-secret',
    redirectUri: `${BASE_URL}/api/auth/callback/facebook`,
    authUrl: 'https://www.facebook.com/v16.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v16.0/oauth/access_token',
    scope: 'public_profile,email,pages_show_list,pages_read_engagement,pages_manage_posts',
    profileUrl: 'https://graph.facebook.com/v16.0/me?fields=id,name,email,picture',
  },
  
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || 'your-instagram-client-id',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || 'your-instagram-client-secret',
    redirectUri: `${BASE_URL}/api/auth/callback/instagram`,
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
    scope: 'user_profile,user_media',
    profileUrl: 'https://graph.instagram.com/me?fields=id,username',
  },
  
  youtube: {
    clientId: process.env.YOUTUBE_CLIENT_ID || 'your-youtube-client-id',
    clientSecret: process.env.YOUTUBE_CLIENT_SECRET || 'your-youtube-client-secret',
    redirectUri: `${BASE_URL}/api/auth/callback/youtube`,
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube',
    profileUrl: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
  }
};

/**
 * Generate OAuth authorization URL for a specific platform
 * @param {string} platform - The platform to generate URL for
 * @param {string} state - State parameter for CSRF protection
 * @returns {string} - Authorization URL
 */
function getAuthorizationUrl(platform, state) {
  const config = oauthConfig[platform];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    scope: config.scope,
    response_type: 'code',
    state: state
  });
  
  // Add platform-specific parameters
  if (platform === 'twitter') {
    params.append('code_challenge', state);
    params.append('code_challenge_method', 'plain');
  }
  
  return `${config.authUrl}?${params.toString()}`;
}

module.exports = {
  oauthConfig,
  getAuthorizationUrl
};
