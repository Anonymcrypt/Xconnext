'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, X, AlertCircle, Zap, Shield, Users, TrendingUp } from 'lucide-react';
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
      primary: '#ededed',
      secondary: '#fafafa',
      text: '#000000'
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
      primary: '#1a1a1a',
      secondary: '#232323',
      text: '#F0B90B'
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

interface ConnectingPopupProps {
  isOpen: boolean;
  walletName: string;
  progress: number;
}

function ConnectingPopup({ isOpen, walletName, progress }: ConnectingPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Connecting to {walletName}</h3>
            <p className="text-gray-400 text-sm">Please wait while we establish connection</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>Initializing...</span>
            <span>{progress}%</span>
            <span>Complete</span>
          </div>
        </div>
        
        <p className="text-gray-300 text-center text-sm">
          Securely connecting to your {walletName} wallet...
        </p>
      </div>
    </div>
  );
}

interface ErrorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onManualConnect: () => void;
  walletName: string;
}

function ErrorPopup({ isOpen, onClose, onManualConnect, walletName }: ErrorPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-linear-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Connection Failed</h3>
            <p className="text-gray-400 text-sm">Unable to connect to {walletName}</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
          We encountered an error while trying to connect to your <span className="text-white font-semibold">{walletName}</span> wallet. 
          This could be due to network issues or wallet configuration.
        </p>
        
        <div className="flex space-x-4">
          {/* <button
            onClick={onClose}
            className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 border border-gray-600 hover:border-gray-500"
          >
            Try Again
          </button> */}
          <button
            onClick={onManualConnect}
            className="flex-1 bg-linear-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Connect Manually
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConnectWalletPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [connectingProgress, setConnectingProgress] = useState(0);
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
    setConnectingProgress(0);

    // Simulate connection progress
    const progressInterval = setInterval(() => {
      setConnectingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300); // Update every 300ms for 3 seconds total

    try {
      // Simulate connection process for exactly 3 seconds
      await new Promise((resolve, reject) => 
        setTimeout(() => reject(new Error('Unable to establish connection with wallet')), 4000)
      );
    } catch (err) {
      setErrorPopup({ isOpen: true, wallet });
    } finally {
      clearInterval(progressInterval);
      setIsConnecting(null);
      setConnectingProgress(0);
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchTerm) {
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-linear-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg width="35" height="35" viewBox="0 0 235 229" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M81.6982 3.40589C92.2946 -1.13524 104.289 -1.13535 114.886 3.40589L188.073 34.7721C193.236 36.9848 196.583 42.0615 196.583 47.6783V121.438C196.583 148.647 183.443 174.18 161.303 189.995L114.615 223.343C104.851 230.318 91.7332 230.318 81.9688 223.343L35.2803 189.995C13.1401 174.18 9.77221e-05 148.646 0 121.438V47.6783C0.000123348 42.0614 3.34794 36.9847 8.51074 34.7721L81.6982 3.40589ZM38.4863 159.146C36.1904 157.612 33.0849 158.23 31.5508 160.526C30.017 162.822 30.634 165.927 32.9297 167.462L94.668 208.71L97.2754 210.452L99.9785 208.863L116.54 199.13C118.921 197.731 119.716 194.667 118.317 192.287C116.918 189.906 113.855 189.111 111.475 190.509L97.6172 198.654L38.4863 159.146ZM61.3809 55.6217C58.6682 55.3766 56.0356 56.6224 54.5039 58.8746L29.0039 96.3746C26.6751 99.7997 27.5635 104.464 30.9883 106.794C34.4135 109.123 39.0791 108.234 41.4082 104.809L59.3164 78.4752L84.8477 136.129C85.9023 138.51 88.1174 140.174 90.6982 140.524C93.2792 140.874 95.8573 139.859 97.5078 137.844L129.144 99.2252L156.715 146.849C158.79 150.434 163.378 151.658 166.963 149.583C170.547 147.507 171.771 142.919 169.696 139.335L136.696 82.3346C135.463 80.2049 133.263 78.8154 130.811 78.6168C128.358 78.4185 125.963 79.4351 124.403 81.3385L93.6279 118.91L67.5635 60.0553C66.4605 57.5648 64.0936 55.8669 61.3809 55.6217Z" fill="#FAFAFA"/>
              <path d="M208 7.00029C222.912 7.00029 235 19.0886 235 34.0003C235 48.912 222.912 61.0003 208 61.0003C193.088 61.0003 181 48.912 181 34.0003C181 19.0886 193.088 7.00029 208 7.00029ZM195.5 30.0003C193.015 30.0003 191 32.015 191 34.5003C191 36.9856 193.015 39.0003 195.5 39.0003H220.5C222.985 39.0003 225 36.9856 225 34.5003C225 32.015 222.985 30.0003 220.5 30.0003H195.5Z" fill="#FF0000"/>
              </svg>
              </div>
              <div className="absolute -inset-2 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-linear-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Securely connect your preferred wallet to access the decentralized web. 
            Your keys, your crypto.
          </p>
        </div>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            {/* Enhanced search container with glass effect */}
            <div className="relative bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl transition-all duration-300 group-hover:border-gray-600/50 group-focus-within:border-blue-500/50 group-focus-within:ring-2 group-focus-within:ring-blue-500/20">
              {/* Search icon with gradient */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-linear-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <Search className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <input
                type="text"
                placeholder="Search 20+ supported wallets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-12 py-5 bg-transparent border-none outline-none text-white placeholder-gray-400 text-lg font-medium"
              />
              
              {/* Clear button with smooth animation */}
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-all duration-200 group/clear"
                >
                  <X className="w-4 h-4 text-gray-400 group-hover/clear:text-white transition-colors" />
                </button>
              )}
            </div>
            
            {/* Search stats */}
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-sm text-gray-500">
                {filteredWallets.length} of {WALLETS.length} wallets
              </span>
              {searchTerm && (
                <span className="text-sm text-blue-400 font-medium">
                  Searching for "{searchTerm}"
                </span>
              )}
            </div>
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
                  
                  {/* Connecting Overlay for Popular Wallets */}
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

        {/* Connecting Popup */}
        <ConnectingPopup
          isOpen={isConnecting !== null}
          walletName={WALLETS.find(w => w.id === isConnecting)?.name || ''}
          progress={connectingProgress}
        />

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