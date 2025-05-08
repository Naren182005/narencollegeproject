import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would fetch the user's connections from a database
    // For demo purposes, we'll return mock data
    
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
    
    // Check localStorage for connected platforms (client-side only)
    // For server-side, we'd check a database
    
    // For demo purposes, we'll return all platforms as not authenticated
    return NextResponse.json({
      allAuthenticated: false,
      platforms: {
        linkedin: { authenticated: false, profile: null },
        instagram: { authenticated: false, profile: null },
        twitter: { authenticated: false, profile: null },
        facebook: { authenticated: false, profile: null },
        youtube: { authenticated: false, profile: null }
      }
    });
  } catch (error) {
    console.error('Error getting connections:', error);
    return NextResponse.json(
      { error: 'Failed to get connections' },
      { status: 500 }
    );
  }
}
