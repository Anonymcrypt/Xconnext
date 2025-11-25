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
  }