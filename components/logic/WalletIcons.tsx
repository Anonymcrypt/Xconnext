'use client';

import React from 'react';

interface WalletIconProps {
  walletId: string;
  className?: string;
}

const WalletIcon: React.FC<WalletIconProps> = ({ walletId, className = "w-6 h-6" }) => {
  const getWalletIcon = (id: string) => {
    const icons: { [key: string]: string } = {
      metamask: '/icons/metamask.svg',
      walletconnect: '/icons/walletconnect.svg',
      coinbase: '/icons/coinbase.svg',
      trustwallet: '/icons/trustwallet.svg',
      phantom: '/icons/phantom.svg',
      ledger: '/icons/ledger.svg',
      trezor: '/icons/trezor.svg',
      binance: '/icons/binance.svg',
      exodus: '/icons/exodus.svg',
      argent: '/icons/argent.svg',
      rainbow: '/icons/rainbow.svg',
      zerion: '/icons/zerion.svg',
      // Fixed paths for new wallets
      brave: '/icons/Brave.svg',
      ambire: '/icons/Ambire.svg',
      leap: '/icons/leaf.svg',
      'magic eden': '/icons/magic-eden.svg',
      onto: '/icons/ONTO.svg',
      safe: '/icons/safe.svg',
      solflare: '/icons/Solflare.svg',
      torus: '/icons/torus.svg',
      web3auth: '/icons/web3auth.svg',
      other: '/icons/other.svg',
      formatic: 'icons/formatic.svg',

    };

    return icons[id] || '/icons/other.svg';
  };

  return (
    <img 
      src={getWalletIcon(walletId)}
      alt={`${walletId} icon`}
      className={className}
      onError={(e) => {
        // Fallback to a generic icon if the SVG fails to load
        e.currentTarget.src = '/icons/other.svg';
      }}
    />
  );
};

export default WalletIcon;