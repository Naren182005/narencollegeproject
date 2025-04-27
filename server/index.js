const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

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
app.post('/api/generate', (req, res) => {
  const { platform } = req.body;

  // Simulated content generation - in a real app, this would call an AI service
  const platformSpecificContent = {
    linkedin: "Excited to share our latest innovation that's transforming how teams collaborate. Our new platform increases productivity by 35% while reducing meeting time. #Innovation #Productivity #WorkSmarter",
    instagram: "✨ New day, new possibilities! Check out what we've been working on behind the scenes. This game-changing solution is about to make your workflow so much smoother! Double tap if you're ready for the future of work. 🚀 #WorkLifeBalance #Innovation",
    twitter: "Just launched our game-changing productivity tool! 35% boost in team efficiency with 50% fewer meetings. Try the free demo today: [link] #ProductivityHack",
    facebook: "We're thrilled to announce the launch of our new productivity platform! After months of development and testing with our amazing beta users, we're ready to share it with the world. This tool has been shown to increase team productivity by 35% while reducing meeting time by half. Click the link to learn more and start your free trial!",
    youtube: {
      title: "Revolutionary Productivity Tool | How We Increased Efficiency by 35%",
      description: "In this video, we walk through our new productivity platform that's changing how teams work together. We'll show you the key features that help reduce meeting time and boost overall efficiency, plus share some success stories from our beta testers.\n\nTimestamps:\n0:00 Introduction\n1:23 The Problem with Modern Workflows\n3:45 Our Solution\n5:30 Key Features\n8:15 Case Study: How Team X Saved 10 Hours Per Week\n10:30 Pricing and How to Get Started",
      tags: "productivity,efficiency,remote work,collaboration,meetings,time management,work tools,productivity app"
    },
    common: "Introducing our new productivity platform that helps teams collaborate more efficiently. With our tool, you can expect a 35% increase in productivity and 50% reduction in meeting time. Try it today!"
  };

  // Simulate processing delay
  setTimeout(() => {
    if (platform === 'youtube') {
      res.json({ content: platformSpecificContent.youtube });
    } else if (platform === 'common') {
      res.json({ content: platformSpecificContent.common });
    } else if (platformSpecificContent[platform]) {
      res.json({ content: platformSpecificContent[platform] });
    } else {
      res.status(400).json({ error: 'Invalid platform specified' });
    }
  }, 1000);
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
