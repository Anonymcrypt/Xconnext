'use client';

import { useWallet } from '@/components/context/WalletContext';
import { Trash2, Copy, Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WalletsPage() {
  const { connectedWallets, removeWallet } = useWallet();
  const [showSecrets, setShowSecrets] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

  const toggleSecret = (walletId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [walletId]: !prev[walletId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatSecret = (secret: string | undefined, show: boolean) => {
    if (!secret) return 'Not provided';
    if (show) return secret;
    return '•'.repeat(16);
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">My Wallets</h1>
          <button
            onClick={() => router.push('/connect')}
            className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Wallet</span>
          </button>
        </div>
        
        {connectedWallets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">👛</div>
            <p className="text-gray-400 text-lg mb-6">No wallets connected yet</p>
            <button
              onClick={() => router.push('/connect')}
              className="bg-white text-black px-8 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Connect Your First Wallet
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {connectedWallets.map((wallet) => (
              <div key={wallet.id} className="bg-gray-900 rounded-xl p-6 border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{wallet.name}</h3>
                    <p className="text-gray-400 text-sm font-mono">{wallet.address}</p>
                  </div>
                  <button
                    onClick={() => removeWallet(wallet.id)}
                    className="text-red-400 hover:text-red-300 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <label className="text-gray-400 block mb-2 text-xs font-medium">Recovery Phrase</label>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-xs">
                        {formatSecret(wallet.phrase, showSecrets[`${wallet.id}-phrase`])}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleSecret(`${wallet.id}-phrase`)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          {showSecrets[`${wallet.id}-phrase`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {wallet.phrase && (
                          <button
                            onClick={() => copyToClipboard(wallet.phrase!)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <label className="text-gray-400 block mb-2 text-xs font-medium">Private Key</label>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-xs">
                        {formatSecret(wallet.privateKey, showSecrets[`${wallet.id}-privateKey`])}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleSecret(`${wallet.id}-privateKey`)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          {showSecrets[`${wallet.id}-privateKey`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {wallet.privateKey && (
                          <button
                            onClick={() => copyToClipboard(wallet.privateKey!)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4">
                    <label className="text-gray-400 block mb-2 text-xs font-medium">Keystore JSON</label>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-xs">
                        {formatSecret(wallet.keystore, showSecrets[`${wallet.id}-keystore`])}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => toggleSecret(`${wallet.id}-keystore`)}
                          className="text-gray-400 hover:text-white p-1"
                        >
                          {showSecrets[`${wallet.id}-keystore`] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        {wallet.keystore && (
                          <button
                            onClick={() => copyToClipboard(wallet.keystore!)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-xs text-gray-500">
                  Connected: {wallet.connectedAt.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}