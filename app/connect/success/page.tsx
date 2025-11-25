'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';

export default function SuccessPage() {
  const router = useRouter();
  const { connectedWallets } = useWallet();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/wallets');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Wallet Connected!</h1>
        <p className="text-gray-400 mb-8">
          Your wallet has been successfully connected and added to your list.
        </p>
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <p className="text-sm text-gray-400">
            Redirecting to your wallets in 3 seconds...
          </p>
        </div>
        <button
          onClick={() => router.push('/wallets')}
          className="flex items-center justify-center space-x-2 w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          <span>View My Wallets</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}