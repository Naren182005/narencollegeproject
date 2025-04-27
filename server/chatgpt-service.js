// ChatGPT integration service
require('dotenv').config();

/**
 * Generate content using ChatGPT
 * @param {string} platform - The platform to generate content for
 * @param {string} prompt - Optional custom prompt
 * @returns {Promise<string|object>} - The generated content
 */
async function generateWithChatGPT(platform, prompt = '') {
  try {
    console.log(`ChatGPT Service: Generating content for ${platform} with prompt: ${prompt || 'default'}`);

    // Validate platform
    const validPlatforms = ['linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'common'];
    if (!validPlatforms.includes(platform)) {
      throw new Error(`Invalid platform: ${platform}. Valid platforms are: ${validPlatforms.join(', ')}`);
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a random topic if not provided in the prompt
    let topic = '';
    if (prompt && prompt.toLowerCase().includes('about')) {
      // Extract topic from prompt
      const aboutMatch = prompt.match(/about\s+([^.!?,]+)/i);
      if (aboutMatch && aboutMatch[1]) {
        topic = aboutMatch[1].trim();
      }
    }

    if (!topic) {
      const topics = ['digital marketing', 'social media strategy', 'content creation', 'brand awareness', 'customer engagement'];
      topic = topics[Math.floor(Math.random() * topics.length)];
    }

    console.log(`Using topic: ${topic}`);

    // Create content based on platform
    let content;

    switch (platform) {
      case 'linkedin':
        content = `📊 *New Insights on ${topic}*\n\nOur team has just completed a comprehensive analysis of the latest trends in ${topic}. The results show that businesses implementing strategic approaches are seeing up to 45% higher engagement rates.\n\nKey findings:\n• Consistent posting increases visibility by 37%\n• Interactive content drives 2x more comments\n• Strategic hashtag usage improves reach by 28%\n\nWant to learn how these insights can transform your business strategy? Let's connect!\n\n#${topic.replace(/\s+/g, '')} #BusinessStrategy #DigitalTransformation`;
        break;

      case 'instagram':
        content = `✨ Elevate your ${topic} game! ✨\n\nSwipe through to discover our top 5 tips that are changing how brands connect with their audience in 2025! 👉\n\nThese strategies helped our clients achieve:\n📈 40% growth in engagement\n💬 3x more meaningful conversations\n🔄 Higher conversion rates\n\nDouble tap if you're ready to transform your approach to ${topic}!\n\n#${topic.replace(/\s+/g, '')} #ContentCreator #SocialMediaTips`;
        break;

      case 'twitter':
        content = `Just released: Our new guide to mastering ${topic} in 2025! 🚀\n\nThree game-changing strategies inside that increased our client engagement by 45%.\n\nDownload the free guide here: [link] #${topic.replace(/\s+/g, '')} #DigitalStrategy`;
        break;

      case 'facebook':
        content = `🔍 NEW RESEARCH: The Changing Landscape of ${topic} in 2025\n\nWe're excited to share our latest findings on how ${topic} is evolving and what it means for businesses like yours.\n\nOur 3-month study revealed that companies adopting innovative approaches to ${topic} are seeing remarkable results:\n\n✅ 37% increase in audience retention\n✅ 42% higher conversion rates\n✅ 29% improvement in brand recognition\n\nWant to know how these insights apply to your business? Drop a comment below or message us directly for a free 15-minute consultation!\n\n[Attached: Infographic showing key statistics from our research]`;
        break;

      case 'youtube':
        content = {
          title: `5 Revolutionary ${topic.charAt(0).toUpperCase() + topic.slice(1)} Strategies for 2025`,
          description: `In this comprehensive guide, we break down the most effective ${topic} strategies that are transforming businesses in 2025.\n\nBased on our research with over 100 companies across different industries, we've identified the approaches that consistently deliver results.\n\nTIMESTAMPS:\n00:00 Introduction\n01:45 The evolution of ${topic}\n04:30 Strategy #1: Audience-centric content\n08:15 Strategy #2: Data-driven decision making\n12:40 Strategy #3: Cross-platform integration\n17:20 Strategy #4: Authentic storytelling\n22:05 Strategy #5: Measurable outcomes\n26:30 Implementation guide\n\nDOWNLOAD OUR FREE WORKSHEET:\nGet our implementation worksheet at [website link]\n\nConnect with us:\nInstagram: @companyname\nTwitter: @companyhandle\nLinkedIn: Company Name\n\n#${topic.replace(/\s+/g, '')} #BusinessStrategy #DigitalMarketing`,
          tags: `${topic},business strategy,marketing tips,social media,digital marketing,content creation,${new Date().getFullYear()},business growth,engagement strategies`
        };
        break;

      case 'common':
        content = `📣 New Insights on ${topic}! 📣\n\nOur latest research reveals the strategies driving success in ${topic} for 2025.\n\nDiscover how leading brands are achieving:\n• 37% higher engagement rates\n• 42% better conversion rates\n• 29% increased brand visibility\n\nLearn more about implementing these strategies in your business. Link in bio!\n\n#${topic.replace(/\s+/g, '')} #DigitalStrategy`;
        break;

      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    console.log(`Generated content for ${platform}:`, typeof content === 'object' ? 'Object with properties' : content.substring(0, 50) + '...');
    return content;

  } catch (error) {
    console.error('Error generating content with ChatGPT:', error);
    throw error;
  }
}

module.exports = { generateWithChatGPT };
