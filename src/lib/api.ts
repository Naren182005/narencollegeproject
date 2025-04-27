// API service for interacting with the backend

/**
 * Generate content for a specific platform
 * @param platform The platform to generate content for (linkedin, instagram, twitter, facebook, youtube, common)
 * @param prompt Optional custom prompt to guide content generation
 * @returns The generated content
 */
export async function generateContent(platform: string, prompt: string = '') {
  try {
    console.log(`API Service: Generating content for ${platform}${prompt ? ' with prompt: ' + prompt : ''}`);

    // Validate platform
    const validPlatforms = ['linkedin', 'instagram', 'twitter', 'facebook', 'youtube', 'common'];
    if (!validPlatforms.includes(platform)) {
      throw new Error(`Invalid platform: ${platform}. Valid platforms are: ${validPlatforms.join(', ')}`);
    }

    const requestBody = { platform, prompt };
    console.log('Request body:', requestBody);

    // Make the API request
    console.log('Sending request to /api/generate');
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Received response with status:', response.status);

    // Handle error responses
    if (!response.ok) {
      let errorMessage = `Error generating content: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // If we can't parse the error as JSON, try to get the text
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch (textError) {
          console.error('Could not read error response text:', textError);
        }
      }

      console.error('Server error response:', errorMessage);
      throw new Error(errorMessage);
    }

    // Parse the response
    let data;
    try {
      data = await response.json();
      console.log('Parsed response data:', data);
    } catch (e) {
      console.error('Error parsing response JSON:', e);
      throw new Error('Invalid JSON response from server');
    }

    // Validate the response data
    if (!data || data.content === undefined) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from server');
    }

    console.log('Successfully received content for', platform);
    return data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

/**
 * Post content to a specific platform
 * @param platform The platform to post to (linkedin, instagram, twitter, facebook, youtube)
 * @param content The content to post
 * @returns The result of the post operation
 */
export async function postContent(platform: string, content: any) {
  try {
    const response = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ platform, content }),
    });

    if (!response.ok) {
      throw new Error(`Error posting content: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting content:', error);
    throw error;
  }
}
