const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { generateWithChatGPT } = require('./chatgpt-service');
const socialAuthManager = require('./social-auth-service');
const { postToSocialMedia, postToMultiplePlatforms } = require('./social-post-service');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Social Media Authentication API
app.get('/api/auth/url/:platform', (req, res) => {
  const { platform } = req.params;

  try {
    const authUrl = socialAuthManager.getAuthUrl(platform);
    res.json({ url: authUrl });
  } catch (error) {
    console.error(`Error getting auth URL for ${platform}:`, error);
    res.status(500).json({ error: `Failed to get auth URL for ${platform}` });
  }
});

// Social Media Authentication Callback
app.post('/api/auth/callback', async (req, res) => {
  const { platform, code } = req.body;

  try {
    const result = await socialAuthManager.handleAuthCallback(platform, code);
    res.json(result);
  } catch (error) {
    console.error(`Error handling auth callback for ${platform}:`, error);
    res.status(500).json({ error: `Failed to authenticate with ${platform}` });
  }
});

// Get authentication status
app.get('/api/auth/status', (req, res) => {
  const platforms = ['linkedin', 'twitter', 'facebook', 'instagram', 'youtube'];
  const status = {};

  platforms.forEach(platform => {
    status[platform] = {
      authenticated: socialAuthManager.isAuthenticatedWith(platform),
      profile: socialAuthManager.getUserProfile(platform)
    };
  });

  res.json({
    allAuthenticated: socialAuthManager.isAuthenticatedWithAll(),
    platforms: status
  });
});

// Logout from a platform
app.post('/api/auth/logout/:platform', (req, res) => {
  const { platform } = req.params;

  try {
    const success = socialAuthManager.logout(platform);
    res.json({ success });
  } catch (error) {
    console.error(`Error logging out from ${platform}:`, error);
    res.status(500).json({ error: `Failed to logout from ${platform}` });
  }
});

// Logout from all platforms
app.post('/api/auth/logout', (req, res) => {
  try {
    socialAuthManager.logoutAll();
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging out from all platforms:', error);
    res.status(500).json({ error: 'Failed to logout from all platforms' });
  }
});

// Post to a specific platform
app.post('/api/post/:platform', async (req, res) => {
  const { platform } = req.params;
  const { content, mediaFiles } = req.body;

  try {
    const result = await postToSocialMedia(platform, content, mediaFiles);
    res.json(result);
  } catch (error) {
    console.error(`Error posting to ${platform}:`, error);
    res.status(500).json({ error: `Failed to post to ${platform}` });
  }
});

// Post to multiple platforms
app.post('/api/post/multiple', async (req, res) => {
  const { platformsContent, mediaFiles } = req.body;

  try {
    const results = await postToMultiplePlatforms(platformsContent, mediaFiles);
    res.json(results);
  } catch (error) {
    console.error('Error posting to multiple platforms:', error);
    res.status(500).json({ error: 'Failed to post to multiple platforms' });
  }
});

// For demo purposes, add an endpoint to simulate authentication
app.post('/api/auth/simulate', async (req, res) => {
  const { platform } = req.body;

  try {
    // Simulate authentication with a fake code
    const fakeCode = `fake_code_${Date.now()}`;
    const result = await socialAuthManager.handleAuthCallback(platform, fakeCode);
    res.json(result);
  } catch (error) {
    console.error(`Error simulating auth for ${platform}:`, error);
    res.status(500).json({ error: `Failed to simulate auth for ${platform}` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
