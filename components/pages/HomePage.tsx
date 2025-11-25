'use client';

import { useState, useMemo } from 'react';
import { Search, X, AlertCircle } from 'lucide-react';
import WalletConnector from '@/components/custom/Wallets';
import { Wallet } from '@/libs/types/wallets';
import { useRouter } from 'next/navigation';

const WALLETS: Wallet[] = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    colors: {
      primary: '#F6851B',
      secondary: '#E2761B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    colors: {
      primary: '#3B99FC',
      secondary: '#2A85FF',
      text: '#FFFFFF'
    }
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    icon: '🪙',
    colors: {
      primary: '#0052FF',
      secondary: '#0042D6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'trustwallet',
    name: 'Trust Wallet',
    icon: '🔷',
    colors: {
      primary: '#3375BB',
      secondary: '#2A65A6',
      text: '#FFFFFF'
    }
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    colors: {
      primary: '#4B49AC',
      secondary: '#3A3897',
      text: '#FFFFFF'
    }
  },
  {
    id: 'ledger',
    name: 'Ledger',
    icon: '🔐',
    colors: {
      primary: '#2C2C2C',
      secondary: '#1A1A1A',
      text: '#FFFFFF'
    }
  },
  {
    id: 'trezor',
    name: 'Trezor',
    icon: '💎',
    colors: {
      primary: '#00B45A',
      secondary: '#009C4D',
      text: '#FFFFFF'
    }
  },
  {
    id: 'binance',
    name: 'Binance',
    icon: '₿',
    colors: {
      primary: '#F0B90B',
      secondary: '#D4A30C',
      text: '#000000'
    }
  },
  {
    id: 'exodus',
    name: 'Exodus',
    icon: '🌌',
    colors: {
      primary: '#1C1C1C',
      secondary: '#2D2D2D',
      text: '#FFFFFF'
    }
  },
  {
    id: 'argent',
    name: 'Argent',
    icon: '🛡️',
    colors: {
      primary: '#FF875B',
      secondary: '#FF6B3B',
      text: '#FFFFFF'
    }
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    icon: '🌈',
    colors: {
      primary: '#001A72',
      secondary: '#002EB5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'zerion',
    name: 'Zerion',
    icon: '⚡',
    colors: {
      primary: '#2962EF',
      secondary: '#1A51DF',
      text: '#FFFFFF'
    }
  },
  {
    id: 'other',
    name: 'Other Wallet',
    icon: '🔗',
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-red-500 bg-opacity-20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Connection Issue</h3>
            <p className="text-gray-400 text-sm">Unable to connect to {walletName}</p>
          </div>
        </div>
        
        <p className="text-gray-300 mb-6">
          We couldn't automatically connect to your {walletName} wallet. You can try connecting manually by entering your wallet details.
        </p>
        
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onManualConnect}
            className="flex-1 bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
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
  const [errorPopup, setErrorPopup] = useState<{ isOpen: boolean; wallet: Wallet | null }>({
    isOpen: false,
    wallet: null
  });
  const router = useRouter();

  const filteredWallets = useMemo(() => {
    return WALLETS.filter(wallet =>
      wallet.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleConnect = async (wallet: Wallet) => {
    if (wallet.id === 'other') {
      router.push('/connect/other');
      return;
    }

    setIsConnecting(wallet.id);

    try {
      // Simulate connection process
      await new Promise((resolve, reject) => setTimeout(() => reject(new Error('Connection failed')), 2000));
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

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-white mb-3">
            Connect Wallet
          </h1>
          <p className="text-gray-400">
            Choose your wallet to connect
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search wallets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-700 rounded-xl focus:border-gray-500 outline-none transition-colors duration-200 text-white placeholder-gray-500"
            />
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredWallets.map((wallet) => (
            <div key={wallet.id} className="relative">
              <WalletConnector
                wallet={wallet}
                onConnect={handleConnect}
              />
              
              {/* Connecting Overlay */}
              {isConnecting === wallet.id && (
                <div className="absolute inset-0 bg-black bg-opacity-90 rounded-xl flex flex-col items-center justify-center z-10 space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-400 border-t-white"></div>
                  <p className="text-white text-sm">Connecting...</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* No results message */}
        {filteredWallets.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              No wallets found
            </h3>
            <p className="text-gray-500">
              Try a different search term
            </p>
          </div>
        )}

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