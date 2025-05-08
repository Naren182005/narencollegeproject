import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, userId } = body;
    
    if (!platform || !userId) {
      return NextResponse.json(
        { error: 'Platform and userId are required' },
        { status: 400 }
      );
    }
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock profiles for each platform
    const mockProfiles = {
      facebook: {
        id: `fb_${userId.substring(0, 5)}`,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        picture: 'https://i.pravatar.cc/150?u=facebook',
      },
      twitter: {
        id: `tw_${userId.substring(0, 5)}`,
        name: 'John Doe',
        username: 'johndoe',
        picture: 'https://i.pravatar.cc/150?u=twitter',
      },
      linkedin: {
        id: `li_${userId.substring(0, 5)}`,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        picture: 'https://i.pravatar.cc/150?u=linkedin',
      },
      instagram: {
        id: `ig_${userId.substring(0, 5)}`,
        name: 'John Doe',
        username: 'johndoe',
        picture: 'https://i.pravatar.cc/150?u=instagram',
      },
      youtube: {
        id: `yt_${userId.substring(0, 5)}`,
        name: 'John Doe',
        username: 'johndoe',
        email: 'john@example.com',
        picture: 'https://i.pravatar.cc/150?u=youtube',
      },
    };
    
    // Return success with mock profile
    return NextResponse.json({
      success: true,
      platform,
      profile: mockProfiles[platform as keyof typeof mockProfiles],
    });
  } catch (error) {
    console.error('Error simulating auth:', error);
    return NextResponse.json(
      { error: 'Failed to simulate authentication' },
      { status: 500 }
    );
  }
}
