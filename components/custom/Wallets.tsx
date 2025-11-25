'use client';

import { Wallet } from '@/libs/types/wallets';

interface WalletConnectorProps {
  wallet: Wallet;
  onConnect: (wallet: Wallet) => void;
}

export default function WalletConnector({ wallet, onConnect }: WalletConnectorProps) {
  return (
    <div
      className="group relative rounded-xl border border-gray-600 p-4 transition-all duration-300 hover:border-gray-400 cursor-pointer bg-transparent hover:bg-gray-900"
      onClick={() => onConnect(wallet)}
    >
      <div className="flex flex-col items-center space-y-3">
        {/* Wallet icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{ 
            background: `linear-gradient(135deg, ${wallet.colors.primary}, ${wallet.colors.secondary})`
          }}
        >
          <span className="text-2xl font-bold" style={{ color: wallet.colors.text }}>
            {wallet.icon}
          </span>
        </div>
        
        {/* Wallet name */}
        <h3 className="font-medium text-gray-200 text-sm text-center">
          {wallet.name}
        </h3>
      </div>
    </div>
  );
}