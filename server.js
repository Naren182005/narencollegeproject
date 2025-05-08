const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

// Database connection
require('./db/mongoose');

// Services
const { generateWithChatGPT } = require('./chatgpt-service');
const {
  exchangeCodeForToken,
  getUserProfile,
  saveConnection,
  getUserConnections,
  disconnectAccount,
  generateState
} = require('./services/oauth-service');
const { getAuthorizationUrl } = require('./config/oauth');

// Models
const SocialConnection = require('./models/SocialConnection');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Session middleware for storing OAuth state
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Basic route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Content generation API
app.post('/api/generate', async (req, res) => {
  try {
    console.log('Received request body:', req.body);

    // Extract platform and prompt from request body
    const { platform, prompt } = req.body;

    console.log('Extracted platform:', platform, 'and prompt:', prompt);

    // Validate platform
    if (!platform) {
      console.error('Missing platform in request');
      return res.status(400).json({ error: 'Platform is required' });
    }

    // Generate content using ChatGPT
    console.log('Calling generateWithChatGPT with platform:', platform, 'and prompt:', prompt || '');
    const content = await generateWithChatGPT(platform, prompt || '');

    // Validate content
    if (!content) {
      console.error('No content generated for platform:', platform);
      return res.status(500).json({ error: 'No content generated' });
    }

    console.log('Successfully generated content for', platform);
    console.log('Content type:', typeof content);
    console.log('Content preview:', typeof content === 'object' ? JSON.stringify(content).substring(0, 100) : content.substring(0, 100));

    // Send response
    res.json({ content });
  } catch (error) {
    console.error('Error in generate endpoint:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: `Failed to generate content: ${error.message}` });
  }
});

// Post content API (simulated)
app.post('/api/post', (req, res) => {
  const { platform, content } = req.body;

  // In a real app, this would connect to social media APIs
  console.log(`Posting to ${platform}:`, content);

  // Simulate processing delay
  setTimeout(() => {
    res.json({
      success: true,
      message: `Content successfully posted to ${platform}`,
      postId: `post-${Date.now()}`
    });
  }, 1000);
});

// OAuth Routes

// Get authorization URL for a platform
app.get('/api/auth/url/:platform', (req, res) => {
  const { platform } = req.params;
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Generate state parameter for CSRF protection
    const state = generateState();

    // Store state and userId in session
    req.session.oauthState = state;
    req.session.userId = userId;
    req.session.platform = platform;

    // Generate authorization URL
    const authUrl = getAuthorizationUrl(platform, state);

    res.json({ url: authUrl });
  } catch (error) {
    console.error(`Error getting auth URL for ${platform}:`, error);
    res.status(500).json({ error: `Failed to get auth URL for ${platform}` });
  }
});

// OAuth callback endpoint
app.get('/api/auth/callback/:platform', async (req, res) => {
  const { platform } = req.params;
  const { code, state } = req.query;

  // Verify state parameter to prevent CSRF attacks
  if (!req.session.oauthState || req.session.oauthState !== state) {
    return res.status(400).json({ error: 'Invalid state parameter' });
  }

  const userId = req.session.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID not found in session' });
  }

  try {
    // Exchange code for token
    const tokenData = await exchangeCodeForToken(platform, code);

    // Get user profile from the platform
    const profile = await getUserProfile(platform, tokenData.access_token);

    // Save connection to database
    await saveConnection(userId, platform, tokenData, profile);

    // Clear session data
    delete req.session.oauthState;
    delete req.session.platform;

    // Redirect to frontend with success message
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth-success?platform=${platform}`);
  } catch (error) {
    console.error(`Error handling OAuth callback for ${platform}:`, error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8080'}/auth-error?platform=${platform}&error=${encodeURIComponent(error.message)}`);
  }
});

// Get user's connected accounts
app.get('/api/auth/connections', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Get all active connections for the user
    const connections = await getUserConnections(userId);

    // Format the response
    const platforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'];
    const status = {};

    // Initialize all platforms as not authenticated
    platforms.forEach(platform => {
      status[platform] = {
        authenticated: false,
        profile: null
      };
    });

    // Update status for connected platforms
    connections.forEach(connection => {
      status[connection.platform] = {
        authenticated: true,
        profile: {
          id: connection.accountId,
          username: connection.accountUsername,
          name: connection.accountName,
          picture: connection.profilePictureUrl,
          connectedAt: connection.connectedAt
        }
      };
    });

    res.json({
      allAuthenticated: platforms.every(platform => status[platform].authenticated),
      platforms: status
    });
  } catch (error) {
    console.error('Error fetching user connections:', error);
    res.status(500).json({ error: 'Failed to fetch user connections' });
  }
});

// Disconnect a platform
app.post('/api/auth/disconnect/:platform', async (req, res) => {
  const { platform } = req.params;
  const { userId, accountId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const success = await disconnectAccount(userId, platform, accountId);
    res.json({ success });
  } catch (error) {
    console.error(`Error disconnecting ${platform}:`, error);
    res.status(500).json({ error: `Failed to disconnect ${platform}` });
  }
});

// Disconnect all platforms
app.post('/api/auth/disconnect-all', async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    await SocialConnection.updateMany(
      { userId, isActive: true },
      { isActive: false }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting all platforms:', error);
    res.status(500).json({ error: 'Failed to disconnect all platforms' });
  }
});

// Create a service for posting to social media platforms
const postToSocialMedia = async (userId, platform, content, mediaFiles = null) => {
  try {
    // Find the user's connection for this platform
    const connection = await SocialConnection.findOne({
      userId,
      platform,
      isActive: true
    });

    if (!connection) {
      throw new Error(`No active connection found for ${platform}`);
    }

    // Update last used timestamp
    connection.lastUsed = new Date();
    await connection.save();

    // In a real implementation, this would make API calls to the respective platforms
    // using the stored access tokens

    // For demo purposes, we'll simulate successful posting
    console.log(`Posting to ${platform} for user ${userId}:`,
      typeof content === 'object' ? JSON.stringify(content).substring(0, 100) : content.substring(0, 100));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      platform,
      postId: `post_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`,
      postUrl: `https://${platform}.com/${connection.accountUsername}/posts/${Date.now()}`,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    return {
      success: false,
      platform,
      error: error.message
    };
  }
};

// Post to a specific platform
app.post('/api/post/:platform', async (req, res) => {
  const { platform } = req.params;
  const { userId, content, mediaFiles } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const result = await postToSocialMedia(userId, platform, content, mediaFiles);

    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    res.status(500).json({ error: `Failed to post to ${platform}: ${error.message}` });
  }
});

// Post to multiple platforms
app.post('/api/post/multiple', async (req, res) => {
  const { userId, platformsContent, mediaFiles } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Get all active connections for the user
    const connections = await getUserConnections(userId);

    if (connections.length === 0) {
      return res.status(400).json({ error: 'No active social media connections found' });
    }

    const results = {};
    const postPromises = [];

    // For each platform in the request, check if user has a connection and post
    for (const [platform, content] of Object.entries(platformsContent)) {
      // Check if user has a connection for this platform
      const hasConnection = connections.some(conn => conn.platform === platform);

      if (hasConnection) {
        // Add to post promises
        postPromises.push(
          postToSocialMedia(userId, platform, content, mediaFiles)
            .then(result => {
              results[platform] = result;
            })
        );
      } else {
        // No connection for this platform
        results[platform] = {
          success: false,
          platform,
          error: 'No active connection found'
        };
      }
    }

    // Wait for all posts to complete
    await Promise.all(postPromises);

    res.json(results);
  } catch (error) {
    console.error('Error posting to multiple platforms:', error);
    res.status(500).json({ error: `Failed to post to multiple platforms: ${error.message}` });
  }
});

// For demo purposes, add an endpoint to simulate authentication
app.post('/api/auth/simulate', async (req, res) => {
  const { platform, userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Generate fake profile data
    const profile = {
      id: `user_${Math.random().toString(36).substring(2, 10)}`,
      username: `demo_user_${platform}`,
      name: `Demo User (${platform})`,
      picture: `https://ui-avatars.com/api/?name=Demo+User&background=random`
    };

    // Generate fake token data
    const tokenData = {
      access_token: `fake_token_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      refresh_token: `fake_refresh_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      expires_in: 3600 * 24 * 7 // 1 week
    };

    // Save to database
    const connection = await saveConnection(userId, platform, tokenData, profile);

    res.json({
      success: true,
      platform,
      profile: {
        id: profile.id,
        username: profile.username,
        name: profile.name,
        picture: profile.picture
      }
    });
  } catch (error) {
    console.error(`Error simulating auth for ${platform}:`, error);
    res.status(500).json({ error: `Failed to simulate auth for ${platform}: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
