import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would remove the user's connections from a database
    // For demo purposes, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Disconnected from all platforms',
    });
  } catch (error) {
    console.error('Error disconnecting all platforms:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect from all platforms' },
      { status: 500 }
    );
  }
}
