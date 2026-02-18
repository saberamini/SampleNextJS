'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'There is a problem with the server configuration.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to sign in.';
      case 'Verification':
        return 'The verification token has expired or has already been used.';
      case 'CredentialsSignin':
        return 'Invalid email or password. Please try again.';
      default:
        return 'An unexpected authentication error occurred.';
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <div>
        <Link href="/" className="block text-center">
          <span className="text-2xl font-bold text-primary-600">Capstone Manager</span>
        </Link>
        <h2 className="mt-6 text-3xl font-bold text-gray-900">
          Authentication Error
        </h2>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600 text-lg font-medium">
          {getErrorMessage(error)}
        </div>
      </div>

      <div className="space-y-4">
        <Link
          href="/auth/signin"
          className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Try signing in again
        </Link>
        <Link
          href="/"
          className="block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

function ErrorLoading() {
  return (
    <div className="max-w-md w-full space-y-8 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-6"></div>
        <div className="h-24 bg-gray-200 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 rounded mb-2"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<ErrorLoading />}>
        <ErrorContent />
      </Suspense>
    </div>
  );
}
