'use client';

import { useRouter } from 'next/navigation';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ErrorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Connection Failed</h1>
        <p className="text-gray-400 mb-8">
          We couldn't connect your wallet. Please check your credentials and try again.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center space-x-2 w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center space-x-2 w-full bg-gray-800 text-white py-4 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Choose Different Wallet</span>
          </button>
        </div>
      </div>
    </div>
  );
}