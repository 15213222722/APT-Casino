/**
 * Tests for One Chain Casino Game Result Logging
 * Validates Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useOneChainCasino } from '../useOneChainCasino';
import oneChainClientService from '../../services/OneChainClientService';

// Mock the wagmi useAccount hook
jest.mock('wagmi', () => ({
  useAccount: jest.fn(() => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true
  }))
}));

// Mock the OneChainClientService
jest.mock('../../services/OneChainClientService', () => ({
  __esModule: true,
  default: {
    logGameResult: jest.fn(),
    waitForTransaction: jest.fn(),
    getBalance: jest.fn(),
    formatOCTAmount: jest.fn((amount) => {
      const value = BigInt(amount);
      const divisor = BigInt(10 ** 18);
      const wholePart = value / divisor;
      const fractionalPart = value % divisor;
      const fractionalStr = fractionalPart.toString().padStart(18, '0').slice(0, 4);
      return `${wholePart}.${fractionalStr}`;
    }),
    parseOCTAmount: jest.fn((amount) => {
      const amountStr = amount.toString();
      const parts = amountStr.split('.');
      const wholePart = parts[0] || '0';
      const fractionalPart = (parts[1] || '').padEnd(18, '0').slice(0, 18);
      const weiAmount = BigInt(wholePart) * BigInt(10 ** 18) + BigInt(fractionalPart);
      return weiAmount.toString();
    })
  }
}));

describe('useOneChainCasino - Game Result Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock implementations
    oneChainClientService.logGameResult.mockResolvedValue('0xmocktxhash123');
    oneChainClientService.waitForTransaction.mockResolvedValue({
      digest: '0xmocktxhash123',
      effects: { status: { status: 'success' } }
    });
    oneChainClientService.getBalance.mockResolvedValue('1000000000000000000'); // 1 OCT
  });

  describe('Roulette Game Logging (Requirement 3.1)', () => {
    it('should log roulette game result to One Chain with all required data', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const betType = 'straight';
      const betValue = 7;
      const amount = '1.0';
      const numbers = [7];
      const entropyValue = '0xabc123';
      const entropyTxHash = '0xentropytx123';
      const resultData = {
        number: 7,
        color: 'red',
        isWin: true
      };
      const payoutAmount = '35.0';

      let txHash;
      await act(async () => {
        txHash = await result.current.placeRouletteBet(
          betType,
          betValue,
          amount,
          numbers,
          entropyValue,
          entropyTxHash,
          resultData,
          payoutAmount
        );
      });

      // Verify logGameResult was called with correct data
      expect(oneChainClientService.logGameResult).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'ROULETTE',
          playerAddress: '0x1234567890123456789012345678901234567890',
          betAmount: expect.any(String),
          payoutAmount: expect.any(String),
          gameConfig: expect.objectContaining({
            betType,
            betValue,
            numbers,
            wheelType: 'european'
          }),
          resultData: expect.objectContaining({
            number: 7,
            color: 'red',
            isWin: true,
            timestamp: expect.any(Number)
          }),
          entropyValue,
          entropyTxHash,
          timestamp: expect.any(Number)
        })
      );

      // Verify transaction confirmation was awaited
      expect(oneChainClientService.waitForTransaction).toHaveBeenCalledWith('0xmocktxhash123');

      // Verify transaction hash was returned
      expect(txHash).toBe('0xmocktxhash123');
    });

    it('should include bet amount, result, winnings, player address, and timestamp', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      await act(async () => {
        await result.current.placeRouletteBet(
          'red',
          0,
          '2.5',
          [],
          '0xentropy',
          '0xentropytx',
          { number: 12, color: 'red', isWin: true },
          '5.0'
        );
      });

      const callArgs = oneChainClientService.logGameResult.mock.calls[0][0];

      // Verify all required fields are present
      expect(callArgs).toHaveProperty('betAmount');
      expect(callArgs).toHaveProperty('payoutAmount');
      expect(callArgs).toHaveProperty('playerAddress');
      expect(callArgs).toHaveProperty('timestamp');
      expect(callArgs.resultData).toHaveProperty('number');
      expect(callArgs.resultData).toHaveProperty('color');
      expect(callArgs.resultData).toHaveProperty('isWin');
    });
  });

  describe('Mines Game Logging (Requirement 3.2)', () => {
    it('should log mines game start to One Chain', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const betAmount = '1.0';
      const minesCount = 5;
      const entropyValue = '0xminesentropy';
      const entropyTxHash = '0xminesentropytx';

      let txHash;
      await act(async () => {
        txHash = await result.current.startMinesGame(
          betAmount,
          minesCount,
          entropyValue,
          entropyTxHash
        );
      });

      expect(oneChainClientService.logGameResult).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'MINES',
          playerAddress: expect.any(String),
          betAmount: expect.any(String),
          gameConfig: expect.objectContaining({
            minesCount,
            gridSize: 25,
            action: 'start'
          }),
          entropyValue,
          entropyTxHash
        })
      );

      expect(oneChainClientService.waitForTransaction).toHaveBeenCalled();
      expect(txHash).toBe('0xmocktxhash123');
    });

    it('should log mines tile reveal to One Chain', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const gameId = '0xgameid123';
      const tileIndex = 5;
      const isMine = false;
      const currentMultiplier = 1.5;

      await act(async () => {
        await result.current.revealMinesTile(gameId, tileIndex, isMine, currentMultiplier);
      });

      expect(oneChainClientService.logGameResult).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'MINES',
          gameConfig: expect.objectContaining({
            gameId,
            action: 'reveal'
          }),
          resultData: expect.objectContaining({
            tileIndex,
            isMine,
            currentMultiplier,
            status: 'revealed'
          })
        })
      );
    });

    it('should log mines cashout to One Chain', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const gameId = '0xgameid123';
      const payoutAmount = '3.5';
      const finalMultiplier = 2.5;
      const tilesRevealed = 10;

      await act(async () => {
        await result.current.cashoutMinesGame(gameId, payoutAmount, finalMultiplier, tilesRevealed);
      });

      expect(oneChainClientService.logGameResult).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'MINES',
          payoutAmount: expect.any(String),
          gameConfig: expect.objectContaining({
            gameId,
            action: 'cashout'
          }),
          resultData: expect.objectContaining({
            status: 'completed',
            finalMultiplier,
            tilesRevealed,
            isWin: true
          })
        })
      );
    });
  });

  describe('Plinko Game Logging (Requirement 3.3)', () => {
    it('should log plinko game result to One Chain', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const betAmount = '1.0';
      const rows = 16;
      const entropyValue = '0xplinkoentropy';
      const entropyTxHash = '0xplinkotx';
      const resultData = {
        path: [0, 1, 0, 1, 1, 0, 1, 0],
        landingSlot: 8,
        multiplier: 5.0,
        isWin: true
      };
      const payoutAmount = '5.0';

      let txHash;
      await act(async () => {
        txHash = await result.current.playPlinko(
          betAmount,
          rows,
          entropyValue,
          entropyTxHash,
          resultData,
          payoutAmount
        );
      });

      expect(oneChainClientService.logGameResult).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'PLINKO',
          betAmount: expect.any(String),
          payoutAmount: expect.any(String),
          gameConfig: expect.objectContaining({
            rows
          }),
          resultData: expect.objectContaining({
            path: expect.any(Array),
            landingSlot: 8,
            multiplier: 5.0,
            isWin: true
          }),
          entropyValue,
          entropyTxHash
        })
      );

      expect(txHash).toBe('0xmocktxhash123');
    });
  });

  describe('Wheel Game Logging (Requirement 3.4)', () => {
    it('should log wheel spin result to One Chain', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const betAmount = '2.0';
      const segments = 10;
      const entropyValue = '0xwheelentropy';
      const entropyTxHash = '0xwheeltx';
      const resultData = {
        segment: 7,
        multiplier: 10.0,
        isWin: true
      };
      const payoutAmount = '20.0';

      let txHash;
      await act(async () => {
        txHash = await result.current.spinWheel(
          betAmount,
          segments,
          entropyValue,
          entropyTxHash,
          resultData,
          payoutAmount
        );
      });

      expect(oneChainClientService.logGameResult).toHaveBeenCalledWith(
        expect.objectContaining({
          gameType: 'WHEEL',
          betAmount: expect.any(String),
          payoutAmount: expect.any(String),
          gameConfig: expect.objectContaining({
            segments
          }),
          resultData: expect.objectContaining({
            segment: 7,
            multiplier: 10.0,
            isWin: true
          }),
          entropyValue,
          entropyTxHash
        })
      );

      expect(txHash).toBe('0xmocktxhash123');
    });
  });

  describe('Transaction Confirmation (Requirement 3.5)', () => {
    it('should wait for One Chain transaction confirmation before completing', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const waitForTransactionSpy = jest.spyOn(oneChainClientService, 'waitForTransaction');

      await act(async () => {
        await result.current.placeRouletteBet(
          'straight',
          7,
          '1.0',
          [7],
          '0xentropy',
          '0xentropytx',
          { number: 7, color: 'red', isWin: true },
          '35.0'
        );
      });

      // Verify waitForTransaction was called
      expect(waitForTransactionSpy).toHaveBeenCalledWith('0xmocktxhash123');
      
      // Verify it was called after logGameResult
      const logCallOrder = oneChainClientService.logGameResult.mock.invocationCallOrder[0];
      const waitCallOrder = waitForTransactionSpy.mock.invocationCallOrder[0];
      expect(waitCallOrder).toBeGreaterThan(logCallOrder);
    });

    it('should store One Chain transaction hash in game result', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      let txHash;
      await act(async () => {
        txHash = await result.current.placeRouletteBet(
          'red',
          0,
          '1.0',
          [],
          '0xentropy',
          '0xentropytx',
          { number: 12, color: 'red', isWin: true },
          '2.0'
        );
      });

      // Verify transaction hash is returned and can be stored
      expect(txHash).toBe('0xmocktxhash123');
      expect(typeof txHash).toBe('string');
      expect(txHash).toMatch(/^0x/);
    });

    it('should handle transaction confirmation timeout', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      // Mock timeout error
      oneChainClientService.waitForTransaction.mockRejectedValueOnce(
        new Error('Transaction confirmation timeout after 30000ms')
      );

      await act(async () => {
        await expect(
          result.current.placeRouletteBet(
            'straight',
            7,
            '1.0',
            [7],
            '0xentropy',
            '0xentropytx',
            { number: 7, color: 'red', isWin: true },
            '35.0'
          )
        ).rejects.toThrow('Transaction confirmation timeout');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle wallet not connected error', async () => {
      // Mock disconnected wallet
      const useAccount = require('wagmi').useAccount;
      useAccount.mockReturnValueOnce({
        address: null,
        isConnected: false
      });

      const { result } = renderHook(() => useOneChainCasino());

      await act(async () => {
        await expect(
          result.current.placeRouletteBet('straight', 7, '1.0', [7], '0xentropy')
        ).rejects.toThrow('Wallet not connected');
      });
    });

    it('should handle transaction submission failure', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      oneChainClientService.logGameResult.mockRejectedValueOnce(
        new Error('Transaction submission failed')
      );

      await act(async () => {
        await expect(
          result.current.placeRouletteBet(
            'straight',
            7,
            '1.0',
            [7],
            '0xentropy',
            '0xentropytx',
            { number: 7, color: 'red', isWin: true },
            '35.0'
          )
        ).rejects.toThrow('Transaction submission failed');
      });
    });

    it('should set error state on failure', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      oneChainClientService.logGameResult.mockRejectedValueOnce(
        new Error('Network error')
      );

      await act(async () => {
        try {
          await result.current.placeRouletteBet('straight', 7, '1.0', [7], '0xentropy');
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Network error');
    });
  });

  describe('Balance Updates', () => {
    it('should update balance after successful game completion', async () => {
      const { result } = renderHook(() => useOneChainCasino());

      const getBalanceSpy = jest.spyOn(oneChainClientService, 'getBalance');

      await act(async () => {
        await result.current.placeRouletteBet(
          'straight',
          7,
          '1.0',
          [7],
          '0xentropy',
          '0xentropytx',
          { number: 7, color: 'red', isWin: true },
          '35.0'
        );
      });

      // Verify balance was fetched after transaction
      expect(getBalanceSpy).toHaveBeenCalled();
    });
  });
});
