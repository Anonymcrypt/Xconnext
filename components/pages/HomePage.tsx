'use client';

import { useState, useMemo } from 'react';
import { Search, X, AlertCircle, Zap, Shield, Users, TrendingUp } from 'lucide-react';
import { FaSearch } from 'react-icons/fa';
import WalletConnector from '@/components/custom/Wallets';
import { Wallet } from '@/libs/types/wallets';
import { useRouter } from 'next/navigation';

const WALLETS: Wallet[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '',
    colors: {
      primary: '#F6851B',
      secondary: '#E2761B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '',
    colors: {
      primary: '#3B99FC',
      secondary: '#2A85FF',
      text: '#FFFFFF'
    }
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    icon: '',
    colors: {
      primary: '#0052FF',
      secondary: '#0042D6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '',
    colors: {
      primary: '#3375BB',
      secondary: '#2A65A6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '',
    colors: {
      primary: '#4B49AC',
      secondary: '#3A3897',
      text: '#FFFFFF'
    }
  },
  {
    id: 'ledger',
    name: 'Ledger',
    icon: '',
    colors: {
      primary: '#2C2C2C',
      secondary: '#1A1A1A',
      text: '#FFFFFF'
    }
  },
  {
    id: 'trezor',
    name: 'Trezor',
    icon: '',
    colors: {
      primary: '#00B45A',
      secondary: '#009C4D',
      text: '#FFFFFF'
    }
  },
  {
    id: 'binance',
    name: 'Binance',
    icon: '',
    colors: {
      primary: '#F0B90B',
      secondary: '#D4A30C',
      text: '#000000'
    }
  },
  {
    id: 'exodus',
    name: 'Exodus',
    icon: '',
    colors: {
      primary: '#1C1C1C',
      secondary: '#2D2D2D',
      text: '#FFFFFF'
    }
  },
  {
    id: 'argent',
    name: 'Argent',
    icon: '',
    colors: {
      primary: '#FF875B',
      secondary: '#FF6B3B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '',
    colors: {
      primary: '#001A72',
      secondary: '#002EB5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'zerion',
    name: 'Zerion',
    icon: '',
    colors: {
      primary: '#2962EF',
      secondary: '#1A51DF',
      text: '#FFFFFF'
    }
  },
  {
    id: 'brave',
    name: 'Brave',
    icon: '',
    colors: {
      primary: '#FB542B',
      secondary: '#E63E1C',
      text: '#FFFFFF'
    }
  },
  {
    id: 'ambire',
    name: 'Ambire',
    icon: '',
    colors: {
      primary: '#FF6B35',
      secondary: '#E55A2B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'leap',
    name: 'Leap',
    icon: '',
    colors: {
      primary: '#00DC82',
      secondary: '#00C274',
      text: '#FFFFFF'
    }
  },
  {
    id: 'magic eden',
    name: 'Magic Eden',
    icon: '',
    colors: {
      primary: '#000000',
      secondary: '#333333',
      text: '#FFFFFF'
    }
  },
  {
    id: 'onto',
    name: 'ONTO',
    icon: '',
    colors: {
      primary: '#00A3FF',
      secondary: '#008CE6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'safe',
    name: 'Safe',
    icon: '',
    colors: {
      primary: '#12FF80',
      secondary: '#00E572',
      text: '#000000'
    }
  },
  {
    id: 'solflare',
    name: 'Solflare',
    icon: '',
    colors: {
      primary: '#9945FF',
      secondary: '#7C36CC',
      text: '#FFFFFF'
    }
  },
  {
    id: 'torus',
    name: 'Torus',
    icon: '',
    colors: {
      primary: '#0364FF',
      secondary: '#0252CC',
      text: '#FFFFFF'
    }
  },
  {
    id: 'web3auth',
    name: 'Web3Auth',
    icon: '',
    colors: {
      primary: '#0364FF',
      secondary: '#0252CC',
      text: '#FFFFFF'
    }
  },
  {
    id: 'other',
    name: 'Other Wallet',
    icon: '',
    colors: {
      primary: '#6B7280',
      secondary: '#4B5563',
      text: '#FFFFFF'
    }
  }
];

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onManualConnect: () => void;
  walletName: string;
}

function ErrorPopup({ isOpen, onClose, onManualConnect, walletName }: ErrorPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Connection Required</h3>
            <p className="text-gray-400 text-sm">Manual setup needed for {walletName}</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
          To connect your <span className="text-white font-semibold">{walletName}</span>, you'll need to enter your wallet details manually for secure verification.
        </p>
        
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 border border-gray-600 hover:border-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onManualConnect}
            className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConnectWalletPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; wallet: Wallet | null }>({
    isOpen: false,
    wallet: null
  });
  const router = useRouter();

  const filteredWallets = useMemo(() => {
    if (!searchTerm) return WALLETS;
    
    return WALLETS.filter(wallet =>
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const popularWallets = useMemo(() => {
    return WALLETS.filter(wallet => 
      ['metamask', 'coinbase', 'trustwallet', 'phantom'].includes(wallet.id)
    );
  }, []);

  const handleConnect = async (wallet: Wallet) => {
    if (wallet.id === 'other') {
      router.push('/connect/other');
      return;
    }

    setIsConnecting(wallet.id);

    try {
      // Simulate connection process
      await new Promise((resolve, reject) => 
        setTimeout(() => reject(new Error('Auto-connect unavailable')), 1500)
      );
    } catch (err) {
      setErrorPopup({ isOpen: true, wallet });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleManualConnect = () => {
    if (errorPopup.wallet) {
      router.push(`/connect/enter-details?wallet=${errorPopup.wallet.id}`);
      setErrorPopup({ isOpen: false, wallet: null });
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -inset-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-3xl blur-xl opacity-30"></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-6">
            Connect Your Wallet
          </h1>
          <p className="text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Securely connect your preferred wallet to access the decentralized web. 
            Your keys, your crypto.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
        <div className="relative group">
          <FaSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors duration-300" />
          <input
            type="text"
            placeholder="Search among 20+ supported wallets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-12 py-5 bg-gray-800 border-2 border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 text-white placeholder-gray-500 text-lg backdrop-blur-sm shadow-lg"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

        {/* Popular Wallets Section */}
        {!searchTerm && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Most Popular</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {popularWallets.map((wallet) => (
                <div key={wallet.id} className="relative">
                  <WalletConnector
                    wallet={wallet}
                    onConnect={handleConnect}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Wallets Section */}
        <div className="mb-8">
          {searchTerm ? (
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Search Results
            </h2>
          ) : (
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              All Supported Wallets
            </h2>
          )}

          {/* Wallets Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredWallets.map((wallet) => (
              <div key={wallet.id} className="relative">
                <WalletConnector
                  wallet={wallet}
                  onConnect={handleConnect}
                />
                
                {/* Enhanced Connecting Overlay */}
                {isConnecting === wallet.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-90 rounded-xl flex flex-col items-center justify-center z-10 space-y-3 backdrop-blur-sm">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-10 w-10 border-3 border-blue-500 border-t-transparent"></div>
                      <div className="absolute inset-0 animate-ping rounded-full h-10 w-10 border-2 border-blue-400 opacity-75"></div>
                    </div>
                    <p className="text-white text-sm font-medium">Connecting...</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* No results message */}
        {filteredWallets.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-3">
              No wallets found
            </h3>
            <p className="text-gray-500 text-lg max-w-md mx-auto mb-8">
              We couldn't find any wallets matching "{searchTerm}". Try a different search term or browse all wallets.
            </p>
            <button
              onClick={clearSearch}
              className="bg-linear-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
            >
              View All Wallets
            </button>
          </div>
        )}

        {/* Security Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center space-x-8 text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">Secure Connection</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span className="text-sm">Instant Setup</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">
            Your wallet connection is encrypted and secure. We never access your private keys.
          </p>
        </div>

        {/* Error Popup */}
        <ErrorPopup
          isOpen={errorPopup.isOpen}
          onClose={() => setErrorPopup({ isOpen: false, wallet: null })}
          onManualConnect={handleManualConnect}
          walletName={errorPopup.wallet?.name || ''}
        />
      </div>
    </div>
  );
}