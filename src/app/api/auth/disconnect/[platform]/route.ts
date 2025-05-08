import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const { platform } = params;
    const body = await request.json();
    const { userId, accountId } = body;
    
    if (!userId || !accountId) {
      return NextResponse.json(
        { error: 'userId and accountId are required' },
        { status: 400 }
      );
    }
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would remove the connection from a database
    // For demo purposes, we'll just return success
    
    return NextResponse.json({
      success: true,
      platform,
      message: `Disconnected from ${platform}`,
    });
  } catch (error) {
    console.error('Error disconnecting platform:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect platform' },
      { status: 500 }
    );
  }
}
