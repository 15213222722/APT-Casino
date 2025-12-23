
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import GameRoulette from './page';
import pythEntropyService from '@/services/PythEntropyService';
import { useOneChainCasino } from '@/hooks/useOneChainCasino';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector, useDispatch } from 'react-redux';

// Mock external dependencies
vi.mock('@/services/PythEntropyService', () => ({
  default: {
    initialize: vi.fn(),
    network: 'mock_network'
  }
}));
vi.mock('@/hooks/useOneChainCasino');
vi.mock('@/hooks/useWalletStatus');
vi.mock('@mysten/dapp-kit');
vi.mock('react-redux');
// Mock Next.js Image component for JSDOM environment
vi.mock('next/image', () => ({
    __esModule: true,
    default: (props) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt || ''} />;
    },
}));
// Mock child components that might have their own complex logic or dependencies
vi.mock('./components/RouletteHistory', () => ({ default: () => <div>RouletteHistory</div> }));
vi.mock('./components/StrategyGuide', () => ({ default: () => <div>StrategyGuide</div> }));
vi.mock('./components/RoulettePayout', () => ({ default: () => <div>RoulettePayout</div> }));
vi.mock('./components/WinProbabilities', () => ({ default: () => <div>WinProbabilities</div> }));


describe('GameRoulette Component - Pyth Entropy Initialization', () => {
    
    const mockDispatch = vi.fn();
    
    beforeEach(() => {
        // Reset mocks before each test
        vi.clearAllMocks();
        
        // Setup default mock implementations for hooks
        useOneChainCasino.mockReturnValue({
            placeRouletteBet: vi.fn(),
            getGameHistory: vi.fn().mockResolvedValue([]),
            formatOCTAmount: vi.fn(val => String(val)),
        });
        
        useWalletStatus.mockReturnValue({ isConnected: true });
        useCurrentAccount.mockReturnValue({ address: '0x1234567890abcdef' });
        
        useSelector.mockReturnValue({ value: '1000', loading: false });
        useDispatch.mockReturnValue(mockDispatch);
    });
    
    it('should initialize Pyth Entropy Service successfully on mount', async () => {
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
        
        pythEntropyService.initialize.mockResolvedValue(undefined);
        pythEntropyService.network = 'testnet';
        
        render(<GameRoulette />);
        
        // Wait for the async initialize function to be called
        await waitFor(() => {
            expect(pythEntropyService.initialize).toHaveBeenCalledTimes(1);
        });
        
        // Verify console logs for success
        expect(consoleLogSpy).toHaveBeenCalledWith('✅ PYTH ENTROPY: Roulette initialized');
        expect(consoleLogSpy).toHaveBeenCalledWith('🎮 Network:', 'testnet');
        
        consoleLogSpy.mockRestore();
    });
    
    it('should handle Pyth Entropy Service initialization failure on mount', async () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const mockError = new Error('Initialization failed');
        
        pythEntropyService.initialize.mockRejectedValue(mockError);
        
        render(<GameRoulette />);
        
        // Wait for the async initialize function to be called and reject
        await waitFor(() => {
            expect(pythEntropyService.initialize).toHaveBeenCalledTimes(1);
        });
        
        // Verify console logs for error
        expect(consoleErrorSpy).toHaveBeenCalledWith('❌ FAILED TO INIT PYTH ENTROPY:', mockError);
        
        // Check if the error message is rendered in the document.
        // The component calls setError, which should result in an error message being displayed.
        await waitFor(() => {
             const alert = screen.queryByText('Failed to initialize randomness service. Please refresh.');
             expect(alert).not.toBeNull();
        });
        
        consoleErrorSpy.mockRestore();
    });
});
