"use client";

import React, { useEffect, useState } from 'react';
import { useWallets } from '@mysten/dapp-kit';

/**
 * Wallet Debug Component
 * Shows all available wallets detected by Sui Wallet Kit
 * Helps verify if OneChain Wallet extension is properly detected
 */
export default function WalletDebug() {
  const wallets = useWallets();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    console.log('🔍 WALLET DEBUG: Available wallets:', wallets);
    wallets.forEach(wallet => {
      console.log(`  - ${wallet.name}:`, {
        name: wallet.name,
        version: wallet.version,
        icon: wallet.icon,
        accounts: wallet.accounts?.length || 0
      });
    });
  }, [wallets]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg"
      >
        🔍 Wallet Debug ({wallets.length})
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-96 max-h-96 overflow-auto bg-gray-900 border border-purple-500 rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-white font-bold">Available Wallets</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {wallets.length === 0 ? (
            <div className="text-gray-400 text-sm">
              No wallets detected. Please install:
              <ul className="mt-2 ml-4 list-disc">
                <li>OneChain Wallet Extension</li>
                <li>Sui Wallet Extension</li>
              </ul>
            </div>
          ) : (
            <div className="space-y-3">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded p-3 border border-gray-700"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {wallet.icon && (
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="w-6 h-6 rounded"
                      />
                    )}
                    <span className="text-white font-medium">{wallet.name}</span>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>Version: {wallet.version || 'N/A'}</div>
                    <div>Accounts: {wallet.accounts?.length || 0}</div>
                    <div className="break-all">
                      Features: {wallet.features?.join(', ') || 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <div className="font-medium text-white mb-1">Expected Wallets:</div>
              <ul className="ml-4 list-disc space-y-1">
                <li>OneChain Wallet (OneWallet)</li>
                <li>Sui Wallet</li>
                <li>Suiet Wallet</li>
                <li>Ethos Wallet</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
