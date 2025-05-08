import { NextRequest, NextResponse } from 'next/server';
import { SocialPlatform } from '@/services/authService';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  const { platform } = params;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  
  // Handle errors from OAuth provider
  if (error) {
    console.error(`OAuth error for ${platform}:`, error);
    return NextResponse.redirect(
      new URL(`/auth/error?platform=${platform}&error=${error}`, request.url)
    );
  }
  
  if (!code) {
    return NextResponse.redirect(
      new URL(`/auth/error?platform=${platform}&error=no_code`, request.url)
    );
  }
  
  try {
    // Exchange the code for tokens - in a real app, this would be done server-side
    // For demo purposes, we'll just pass the code to the client to handle
    return NextResponse.redirect(
      new URL(`/auth/success?platform=${platform}&code=${code}`, request.url)
    );
  } catch (error) {
    console.error(`Failed to exchange code for ${platform}:`, error);
    return NextResponse.redirect(
      new URL(`/auth/error?platform=${platform}&error=token_exchange_failed`, request.url)
    );
  }
}
