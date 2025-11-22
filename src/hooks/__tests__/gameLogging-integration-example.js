/**
 * Integration Example: Game Result Logging to One Chain
 * 
 * This file demonstrates how game components should use the updated
 * useOneChainCasino hook to log game results to One Chain.
 */

// Example 1: Roulette Game Complete Flow
async function handleRouletteGameComplete(gameResult) {
  const {
    placeRouletteBet,
    formatOCTAmount,
    parseOCTAmount
  } = useOneChainCasino();

  try {
    // 1. Get entropy from Pyth Entropy (Arbitrum Sepolia)
    const entropyData = await pythEntropyService.requestEntropy();
    const entropyValue = entropyData.vrfValue;
    const entropyTxHash = entropyData.transactionHash;

    // 2. Calculate game result using entropy
    const spinResult = calculateRouletteResult(entropyValue);
    const isWin = checkIfWin(betType, betValue, spinResult.number);
    const payoutAmount = isWin ? calculatePayout(betAmount, betType) : '0';

    // 3. Log complete game result to One Chain
    const onechainTxHash = await placeRouletteBet(
      betType,           // 'straight', 'red', 'black', etc.
      betValue,          // Number or 0 for color bets
      betAmount,         // '1.0' OCT
      numbers,           // [7] for straight bet
      entropyValue,      // '0xabc123...' from Pyth Entropy
      entropyTxHash,     // '0xdef456...' Arbitrum Sepolia tx
      {
        number: spinResult.number,
        color: spinResult.color,
        isWin: isWin,
        betType: betType
      },
      payoutAmount       // '35.0' OCT if win
    );

    // 4. Store transaction hashes in database
    await saveGameHistory({
      gameType: 'ROULETTE',
      onechainTxHash: onechainTxHash,
      arbitrumEntropyTxHash: entropyTxHash,
      betAmount: betAmount,
      payoutAmount: payoutAmount,
      resultData: spinResult
    });

    console.log('✅ Roulette game logged to One Chain:', onechainTxHash);
    return onechainTxHash;

  } catch (error) {
    console.error('❌ Failed to log roulette game:', error);
    throw error;
  }
}

// Example 2: Mines Game Complete Flow
async function handleMinesGameFlow() {
  const {
    startMinesGame,
    revealMinesTile,
    cashoutMinesGame
  } = useOneChainCasino();

  try {
    // 1. Start game with entropy
    const entropyData = await pythEntropyService.requestEntropy();
    const gameId = await startMinesGame(
      '1.0',                    // Bet amount
      5,                        // Number of mines
      entropyData.vrfValue,     // Entropy value
      entropyData.transactionHash // Entropy tx hash
    );

    console.log('✅ Mines game started:', gameId);

    // 2. Reveal tiles (multiple times)
    for (let i = 0; i < 5; i++) {
      const tileIndex = playerSelectedTiles[i];
      const isMine = checkIfMine(tileIndex, minePositions);
      const currentMultiplier = calculateMultiplier(i + 1, 5);

      const revealTxHash = await revealMinesTile(
        gameId,
        tileIndex,
        isMine,
        currentMultiplier
      );

      console.log(`✅ Tile ${tileIndex} revealed:`, revealTxHash);

      if (isMine) {
        console.log('💥 Hit a mine! Game over.');
        return;
      }
    }

    // 3. Cashout
    const finalMultiplier = calculateMultiplier(5, 5);
    const payoutAmount = (parseFloat(betAmount) * finalMultiplier).toString();

    const cashoutTxHash = await cashoutMinesGame(
      gameId,
      payoutAmount,
      finalMultiplier,
      5 // tiles revealed
    );

    console.log('✅ Mines game cashed out:', cashoutTxHash);
    return cashoutTxHash;

  } catch (error) {
    console.error('❌ Mines game failed:', error);
    throw error;
  }
}

// Example 3: Plinko Game Complete Flow
async function handlePlinkoGameComplete() {
  const { playPlinko } = useOneChainCasino();

  try {
    // 1. Get entropy
    const entropyData = await pythEntropyService.requestEntropy();

    // 2. Calculate plinko result
    const plinkoResult = calculatePlinkoPath(entropyData.vrfValue, 16);
    const multiplier = getMultiplierForSlot(plinkoResult.landingSlot);
    const payoutAmount = (parseFloat(betAmount) * multiplier).toString();

    // 3. Log to One Chain
    const txHash = await playPlinko(
      '1.0',                    // Bet amount
      16,                       // Number of rows
      entropyData.vrfValue,     // Entropy value
      entropyData.transactionHash, // Entropy tx hash
      {
        path: plinkoResult.path,
        landingSlot: plinkoResult.landingSlot,
        multiplier: multiplier,
        isWin: multiplier > 1.0
      },
      payoutAmount
    );

    console.log('✅ Plinko game logged:', txHash);
    return txHash;

  } catch (error) {
    console.error('❌ Plinko game failed:', error);
    throw error;
  }
}

// Example 4: Wheel Game Complete Flow
async function handleWheelGameComplete() {
  const { spinWheel } = useOneChainCasino();

  try {
    // 1. Get entropy
    const entropyData = await pythEntropyService.requestEntropy();

    // 2. Calculate wheel result
    const wheelResult = calculateWheelSegment(entropyData.vrfValue, 10);
    const multiplier = getMultiplierForSegment(wheelResult.segment);
    const payoutAmount = (parseFloat(betAmount) * multiplier).toString();

    // 3. Log to One Chain
    const txHash = await spinWheel(
      '2.0',                    // Bet amount
      10,                       // Number of segments
      entropyData.vrfValue,     // Entropy value
      entropyData.transactionHash, // Entropy tx hash
      {
        segment: wheelResult.segment,
        multiplier: multiplier,
        isWin: multiplier > 0,
        color: wheelResult.color
      },
      payoutAmount
    );

    console.log('✅ Wheel spin logged:', txHash);
    return txHash;

  } catch (error) {
    console.error('❌ Wheel spin failed:', error);
    throw error;
  }
}

// Example 5: Error Handling
async function handleGameWithErrorRecovery() {
  const { placeRouletteBet } = useOneChainCasino();

  try {
    const txHash = await placeRouletteBet(
      'straight',
      7,
      '1.0',
      [7],
      entropyValue,
      entropyTxHash,
      resultData,
      payoutAmount
    );

    return txHash;

  } catch (error) {
    if (error.message.includes('Wallet not connected')) {
      // Show wallet connection modal
      showWalletModal();
    } else if (error.message.includes('Insufficient')) {
      // Show insufficient balance error
      showInsufficientBalanceError();
    } else if (error.message.includes('timeout')) {
      // Transaction might still succeed, show pending status
      showPendingTransactionStatus();
    } else {
      // Generic error
      showGenericError(error.message);
    }
    throw error;
  }
}

// Example 6: Transaction Verification
async function verifyGameTransaction(txHash) {
  const explorerUrl = oneChainClientService.getExplorerUrl(txHash);
  
  console.log('🔍 Verify transaction on One Chain Explorer:');
  console.log(explorerUrl);
  
  // Wait for confirmation
  const receipt = await oneChainClientService.waitForTransaction(txHash);
  
  if (receipt.effects.status.status === 'success') {
    console.log('✅ Transaction confirmed successfully');
    return true;
  } else {
    console.log('❌ Transaction failed');
    return false;
  }
}

// Example 7: Batch Game History Retrieval
async function getPlayerGameHistory() {
  const { getGameHistory } = useOneChainCasino();

  try {
    // Get all games
    const allGames = await getGameHistory(null, 50);
    
    // Get roulette games only
    const rouletteGames = await getGameHistory('ROULETTE', 20);
    
    // Get mines games only
    const minesGames = await getGameHistory('MINES', 20);
    
    console.log('📜 Game History:');
    console.log('Total games:', allGames.length);
    console.log('Roulette games:', rouletteGames.length);
    console.log('Mines games:', minesGames.length);
    
    return {
      all: allGames,
      roulette: rouletteGames,
      mines: minesGames
    };

  } catch (error) {
    console.error('❌ Failed to get game history:', error);
    return { all: [], roulette: [], mines: [] };
  }
}

/**
 * Key Points for Integration:
 * 
 * 1. Always get entropy from Pyth Entropy (Arbitrum Sepolia) first
 * 2. Calculate game result using the entropy value
 * 3. Call the appropriate game handler with complete data
 * 4. Wait for transaction confirmation (handled automatically)
 * 5. Store returned transaction hash in database
 * 6. Handle errors appropriately
 * 7. Update UI with transaction status
 * 
 * Data Flow:
 * Pyth Entropy (Arbitrum Sepolia) → Game Logic → One Chain Transaction → Database
 * 
 * Transaction Hashes to Store:
 * - onechainTxHash: Transaction hash from One Chain (game result)
 * - arbitrumEntropyTxHash: Transaction hash from Arbitrum Sepolia (entropy)
 * 
 * Both hashes should be stored in the database for verification and audit.
 */

export {
  handleRouletteGameComplete,
  handleMinesGameFlow,
  handlePlinkoGameComplete,
  handleWheelGameComplete,
  handleGameWithErrorRecovery,
  verifyGameTransaction,
  getPlayerGameHistory
};
