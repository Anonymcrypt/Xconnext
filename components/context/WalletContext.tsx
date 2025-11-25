'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConnectedWallet } from '@/libs/types/wallets';

interface WalletContextType {
  connectedWallets: ConnectedWallet[];
  addWallet: (wallet: ConnectedWallet) => void;
  removeWallet: (walletId: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connectedWallets, setConnectedWallets] = useState<ConnectedWallet[]>([]);

  const addWallet = (wallet: ConnectedWallet) => {
    setConnectedWallets(prev => [...prev, wallet]);
  };

  const removeWallet = (walletId: string) => {
    setConnectedWallets(prev => prev.filter(w => w.id !== walletId));
  };

  return (
    <WalletContext.Provider value={{ connectedWallets, addWallet, removeWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}