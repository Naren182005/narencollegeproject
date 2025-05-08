const axios = require('axios');
const { oauthConfig } = require('../config/oauth');
const SocialConnection = require('../models/SocialConnection');
const crypto = require('crypto');

/**
 * Exchange authorization code for access token
 * @param {string} platform - The platform to authenticate with
 * @param {string} code - The authorization code
 * @returns {Promise<object>} - Token response
 */
async function exchangeCodeForToken(platform, code) {
  const config = oauthConfig[platform];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  let data;
  let headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };
  
  // Different platforms have different token request formats
  if (platform === 'instagram') {
    data = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      code: code
    });
  } else if (platform === 'twitter') {
    data = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      code: code,
      code_verifier: code.split('_')[1] || code // Use part of the code as verifier for demo
    });
    
    // Twitter requires Basic Auth
    const basicAuth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');
    headers['Authorization'] = `Basic ${basicAuth}`;
  } else {
    data = new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: config.redirectUri,
      code: code
    });
  }
  
  try {
    const response = await axios.post(config.tokenUrl, data, { headers });
    return response.data;
  } catch (error) {
    console.error(`Error exchanging code for token (${platform}):`, error.response?.data || error.message);
    throw new Error(`Failed to exchange code for token: ${error.message}`);
  }
}

/**
 * Get user profile from the platform
 * @param {string} platform - The platform
 * @param {string} accessToken - The access token
 * @returns {Promise<object>} - User profile
 */
async function getUserProfile(platform, accessToken) {
  const config = oauthConfig[platform];
  if (!config) {
    throw new Error(`Unsupported platform: ${platform}`);
  }
  
  let headers = {
    'Authorization': `Bearer ${accessToken}`
  };
  
  try {
    const response = await axios.get(config.profileUrl, { headers });
    
    // Different platforms return different profile formats
    let profile = {};
    
    if (platform === 'linkedin') {
      profile = {
        id: response.data.id,
        name: `${response.data.localizedFirstName} ${response.data.localizedLastName}`,
        username: response.data.id, // LinkedIn doesn't have usernames
      };
      
      // Get email separately for LinkedIn
      try {
        const emailResponse = await axios.get(config.emailUrl, { headers });
        if (emailResponse.data.elements && emailResponse.data.elements.length > 0) {
          profile.email = emailResponse.data.elements[0]['handle~'].emailAddress;
        }
      } catch (emailError) {
        console.error('Error fetching LinkedIn email:', emailError);
      }
    } else if (platform === 'twitter') {
      profile = {
        id: response.data.data.id,
        name: response.data.data.name,
        username: response.data.data.username,
      };
    } else if (platform === 'facebook') {
      profile = {
        id: response.data.id,
        name: response.data.name,
        username: response.data.id, // Use ID as username if not available
        email: response.data.email,
        picture: response.data.picture?.data?.url
      };
    } else if (platform === 'instagram') {
      profile = {
        id: response.data.id,
        username: response.data.username,
        name: response.data.username // Instagram API doesn't return name
      };
    } else if (platform === 'youtube') {
      if (response.data.items && response.data.items.length > 0) {
        const channel = response.data.items[0];
        profile = {
          id: channel.id,
          name: channel.snippet.title,
          username: channel.snippet.customUrl || channel.id,
          picture: channel.snippet.thumbnails?.default?.url
        };
      }
    }
    
    return profile;
  } catch (error) {
    console.error(`Error fetching user profile (${platform}):`, error.response?.data || error.message);
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}

/**
 * Save or update social connection in database
 * @param {string} userId - User ID in our system
 * @param {string} platform - Social media platform
 * @param {object} tokenData - Token data from OAuth provider
 * @param {object} profile - User profile from the platform
 * @returns {Promise<object>} - Saved connection
 */
async function saveConnection(userId, platform, tokenData, profile) {
  try {
    // Calculate token expiration
    let expiresAt = null;
    if (tokenData.expires_in) {
      expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);
    }
    
    // Find existing connection or create new one
    const connectionData = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token || null,
      tokenExpiresAt: expiresAt,
      connectedAt: new Date(),
      accountUsername: profile.username,
      accountId: profile.id,
      accountName: profile.name,
      profilePictureUrl: profile.picture,
      isActive: true,
      lastUsed: new Date()
    };
    
    // Update or create connection
    const connection = await SocialConnection.findOneAndUpdate(
      { userId, platform, accountId: profile.id },
      connectionData,
      { new: true, upsert: true }
    );
    
    return connection;
  } catch (error) {
    console.error(`Error saving connection (${platform}):`, error);
    throw new Error(`Failed to save connection: ${error.message}`);
  }
}

/**
 * Get all active connections for a user
 * @param {string} userId - User ID in our system
 * @returns {Promise<Array>} - List of connections
 */
async function getUserConnections(userId) {
  try {
    return await SocialConnection.find({ userId, isActive: true });
  } catch (error) {
    console.error('Error fetching user connections:', error);
    throw new Error(`Failed to fetch user connections: ${error.message}`);
  }
}

/**
 * Disconnect a social media account
 * @param {string} userId - User ID in our system
 * @param {string} platform - Platform to disconnect
 * @param {string} accountId - Account ID to disconnect
 * @returns {Promise<boolean>} - Success status
 */
async function disconnectAccount(userId, platform, accountId) {
  try {
    const result = await SocialConnection.findOneAndUpdate(
      { userId, platform, accountId },
      { isActive: false },
      { new: true }
    );
    
    return !!result;
  } catch (error) {
    console.error(`Error disconnecting account (${platform}):`, error);
    throw new Error(`Failed to disconnect account: ${error.message}`);
  }
}

/**
 * Generate a secure state parameter for OAuth flow
 * @returns {string} - Random state string
 */
function generateState() {
  return crypto.randomBytes(16).toString('hex');
}

module.exports = {
  exchangeCodeForToken,
  getUserProfile,
  saveConnection,
  getUserConnections,
  disconnectAccount,
  generateState
};
