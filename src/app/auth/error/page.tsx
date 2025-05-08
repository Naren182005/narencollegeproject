'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const platform = searchParams.get('platform');
  const error = searchParams.get('error');
  
  const getErrorMessage = () => {
    switch (error) {
      case 'access_denied':
        return 'You denied access to your account.';
      case 'no_code':
        return 'No authorization code was received from the provider.';
      case 'token_exchange_failed':
        return 'Failed to exchange the authorization code for an access token.';
      default:
        return 'An unknown error occurred during authentication.';
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-700 shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
            <AlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          
          <h2 className="mt-6 text-3xl font-bold text-white">Authentication Failed</h2>
          <p className="mt-2 text-gray-400">
            There was a problem connecting your {platform} account.
          </p>
        </div>
        
        <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4 mt-6">
          <p className="text-red-400 text-sm">
            Error: {getErrorMessage()}
          </p>
        </div>
        
        <div className="flex justify-center mt-8">
          <Button asChild className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90">
            <Link href="/">
              Return to Application
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
