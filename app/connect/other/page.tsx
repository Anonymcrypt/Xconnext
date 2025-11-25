'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Key, FileText, Shield } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { ConnectedWallet } from '@/libs/types/wallets';

export default function OtherWalletPage() {
  const router = useRouter();
  const { addWallet } = useWallet();
  
  const [walletName, setWalletName] = useState('');
  const [activeTab, setActiveTab] = useState<'phrase' | 'privateKey' | 'keystore'>('phrase');
  const [formData, setFormData] = useState({
    phrase: '',
    privateKey: '',
    keystore: '',
    password: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (!walletName.trim()) {
      alert('Please enter a wallet name');
      return;
    }

    if (!formData.phrase && !formData.privateKey && !formData.keystore) {
      alert('Please enter your credentials');
      return;
    }

    setIsConnecting(true);

    try {
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create connected wallet object
      const connectedWallet: ConnectedWallet = {
        id: `custom-${Date.now()}`,
        name: walletName,
        address: `0x${Math.random().toString(16).substr(2, 40)}`,
        connectedAt: new Date(),
        ...(formData.phrase && { phrase: formData.phrase }),
        ...(formData.privateKey && { privateKey: formData.privateKey }),
        ...(formData.keystore && { keystore: formData.keystore }),
      };

      // Add to wallet list
      addWallet(connectedWallet);

      // Redirect to success page
      router.push('/connect/success');
      
    } catch (error) {
      console.error('Connection failed:', error);
      router.push('/connect/error');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
              <Wallet className="w-6 h-6 text-gray-300" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Connect Custom Wallet</h1>
              <p className="text-gray-400">Add any wallet using your credentials</p>
            </div>
          </div>
        </div>

        {/* Wallet Name Input */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Wallet Name
          </label>
          <input
            type="text"
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            placeholder="Enter your wallet name (e.g., My Ledger, Hardware Wallet)"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none"
          />
        </div>

        {/* Connection Methods Tabs */}
        <div className="bg-gray-900 rounded-xl p-2 mb-6">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('phrase')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'phrase' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="text-sm">Phrase</span>
            </button>
            <button
              onClick={() => setActiveTab('privateKey')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'privateKey' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm">Private Key</span>
            </button>
            <button
              onClick={() => setActiveTab('keystore')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'keystore' 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm">Keystore</span>
            </button>
          </div>
        </div>

        {/* Input Forms */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          {activeTab === 'phrase' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Recovery Phrase
              </label>
              <textarea
                value={formData.phrase}
                onChange={(e) => handleInputChange('phrase', e.target.value)}
                placeholder="Enter your 12 or 24-word recovery phrase"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none resize-none"
                rows={4}
              />
            </div>
          )}

          {activeTab === 'privateKey' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Private Key
              </label>
              <textarea
                value={formData.privateKey}
                onChange={(e) => handleInputChange('privateKey', e.target.value)}
                placeholder="Enter your private key"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none resize-none"
                rows={4}
              />
            </div>
          )}

          {activeTab === 'keystore' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Keystore JSON
              </label>
              <textarea
                value={formData.keystore}
                onChange={(e) => handleInputChange('keystore', e.target.value)}
                placeholder="Paste your keystore JSON file contents"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none resize-none"
                rows={4}
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Keystore password"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none"
              />
            </div>
          )}
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </div>
    </div>
  );
}