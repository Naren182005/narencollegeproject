import { setupWorker, rest } from 'msw';

// Mock data for profiles
const mockProfiles = {
  linkedin: {
    id: 'linkedin-123',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  twitter: {
    id: 'twitter-456',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  facebook: {
    id: 'facebook-789',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  instagram: {
    id: 'instagram-012',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  youtube: {
    id: 'youtube-345',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    picture: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
};

// Mock content generation
const mockContent = {
  linkedin: 'I\'m excited to share that our company has reached a significant milestone! We\'ve just surpassed 1 million users worldwide. This achievement is a testament to our team\'s dedication and our users\' trust. #MilestoneAchieved #GrowthMindset',
  twitter: 'Just hit 1M users! 🚀 Couldn\'t have done it without our amazing team and community. What should we build next? #ThankYou',
  facebook: 'We\'re thrilled to announce that we\'ve reached 1 million users! 🎉 This journey has been incredible, and we\'re just getting started. Thank you to everyone who has supported us along the way. We\'re planning some exciting new features to celebrate!',
  instagram: '1,000,000 USERS! 🎉\n\nWords can\'t express how grateful we are for this amazing community. Every like, comment, and share has helped us reach this milestone.\n\n#ThankYou #OneMillion #JustTheBeginning',
  youtube: {
    title: 'We Just Hit 1 MILLION Users! Here\'s Our Journey',
    description: 'In this video, we\'re celebrating our 1 million user milestone! Join us as we look back at our journey, share some behind-the-scenes stories, and give you a sneak peek at what\'s coming next. Thank you for being part of our community!',
    tags: 'milestone,celebration,startup journey,behind the scenes',
  },
  common: 'We\'re excited to announce that we\'ve reached 1 million users worldwide! This milestone is a testament to our amazing community and dedicated team. Thank you for your support on this journey. We\'re just getting started and have many exciting features planned for the future. Stay tuned! #OneMillion #ThankYou',
};

// Create the worker
export const worker = setupWorker(
  // Handle content generation
  rest.post('/api/generate', (req, res, ctx) => {
    const { platform, prompt } = req.body as { platform: string; prompt: string };
    
    console.log(`Mock server: Generating content for ${platform}${prompt ? ' with prompt: ' + prompt : ''}`);
    
    // Return the mock content for the platform
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        content: mockContent[platform as keyof typeof mockContent] || 'Generated content for ' + platform,
      })
    );
  }),
  
  // Handle auth simulation
  rest.post('/api/auth/simulate', (req, res, ctx) => {
    const { platform, userId } = req.body as { platform: string; userId: string };
    
    console.log(`Mock server: Simulating auth for ${platform} and user ${userId}`);
    
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        success: true,
        profile: mockProfiles[platform as keyof typeof mockProfiles],
      })
    );
  }),
  
  // Handle auth status
  rest.get('/api/auth/connections', (req, res, ctx) => {
    const userId = req.url.searchParams.get('userId');
    
    console.log(`Mock server: Getting auth status for user ${userId}`);
    
    return res(
      ctx.status(200),
      ctx.json({
        allAuthenticated: false,
        platforms: {
          linkedin: { authenticated: false, profile: null },
          instagram: { authenticated: false, profile: null },
          twitter: { authenticated: false, profile: null },
          facebook: { authenticated: false, profile: null },
          youtube: { authenticated: false, profile: null },
        },
      })
    );
  }),
  
  // Handle disconnect platform
  rest.post('/api/auth/disconnect/:platform', (req, res, ctx) => {
    const { platform } = req.params;
    const { userId, accountId } = req.body as { userId: string; accountId: string };
    
    console.log(`Mock server: Disconnecting ${platform} for user ${userId} and account ${accountId}`);
    
    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        success: true,
      })
    );
  }),
  
  // Handle disconnect all
  rest.post('/api/auth/disconnect-all', (req, res, ctx) => {
    const { userId } = req.body as { userId: string };
    
    console.log(`Mock server: Disconnecting all platforms for user ${userId}`);
    
    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        success: true,
      })
    );
  }),
  
  // Handle post to platform
  rest.post('/api/post/:platform', (req, res, ctx) => {
    const { platform } = req.params;
    const { userId, content, mediaFiles } = req.body as { userId: string; content: any; mediaFiles?: any };
    
    console.log(`Mock server: Posting to ${platform} for user ${userId}`);
    
    return res(
      ctx.delay(1000),
      ctx.status(200),
      ctx.json({
        success: true,
        postId: `mock-post-${Math.random().toString(36).substring(2)}`,
        platform,
      })
    );
  }),
  
  // Handle post to multiple platforms
  rest.post('/api/post/multiple', (req, res, ctx) => {
    const { userId, platformsContent, mediaFiles } = req.body as {
      userId: string;
      platformsContent: Record<string, any>;
      mediaFiles?: any;
    };
    
    console.log(`Mock server: Posting to multiple platforms for user ${userId}: ${Object.keys(platformsContent).join(', ')}`);
    
    const results: Record<string, any> = {};
    
    Object.keys(platformsContent).forEach(platform => {
      results[platform] = {
        success: true,
        postId: `mock-post-${Math.random().toString(36).substring(2)}`,
        platform,
      };
    });
    
    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json(results)
    );
  }),
);
