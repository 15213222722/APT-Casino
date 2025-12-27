"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineVolumeUp, HiOutlineVolumeOff, HiOutlineInformationCircle } from "react-icons/hi";
import { FaRegGem, FaBomb, FaDiamond, FaQuestion, FaCoins, FaBullseye, FaClipboardCheck, FaDice, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { GiMineTruck, GiTreasureMap, GiCrystalGrowth } from "react-icons/gi";
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setBalance } from '@/store/balanceSlice';
import useWalletStatus from '@/hooks/useWalletStatus';
import { useTranslation } from 'react-i18next';

const GRID_SIZES = {
  5: 5, // 5x5 grid - classic mode
};

const MINE_SPRITES = [
  "/images/bomb.png",
];

const GEM_SPRITES = [
  "/images/diamond.png",
];

// Sound effects URLs
const SOUNDS = {
  click: "/sounds/click.mp3",
  reveal: "/sounds/reveal.mp3",
  gem: "/sounds/gem.mp3",
  explosion: "/sounds/explosion.mp3",
  win: "/sounds/win.mp3",
  cashout: "/sounds/cashout.mp3",
  hover: "/sounds/hover.mp3",
  bet: "/sounds/bet.mp3",
};

// Helper function to calculate combinations (nCk)
const combinations = (n, k) => {
  if (k < 0 || k > n) {
    return 0;
  }
  if (k === 0 || k === n) {
    return 1;
  }
  if (k > n / 2) {
    k = n - k;
  }
  let res = 1;
  for (let i = 1; i <= k; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return res;
};

// New multiplier calculation function with house edge
const calculateMultiplier = (revealedCount, minesCount, gridSize, houseEdge = 0.03) => {
  if (revealedCount === 0) {
    return 1.0;
  }
  const totalTiles = gridSize * gridSize;
  const safeTiles = totalTiles - minesCount;

  if (revealedCount > safeTiles) {
    return 0; // Should not happen in a normal game flow
  }

  const prob = combinations(safeTiles, revealedCount) / combinations(totalTiles, revealedCount);
  
  if (prob === 0) {
    // This can happen if revealedCount > safeTiles, return a high number as it's a "win"
    // but cap it to avoid infinity. This case indicates all safe tiles are revealed.
    const maxMultiplier = (1 - houseEdge) / (combinations(safeTiles, safeTiles) / combinations(totalTiles, safeTiles));
    return maxMultiplier;
  }

  const multiplier = (1 - houseEdge) / prob;
  return multiplier;
};

// Helper function to initialize the grid, moved outside the component
const initializeGrid = async (gridSize, mines) => {
  // Ensure mines count is valid (never more than totalTiles - 1)
  const totalTiles = gridSize * gridSize;
  const validMines = Math.min(mines, totalTiles - 1);
  
  let newGrid = Array(gridSize)
    .fill()
    .map(() =>
      Array(gridSize)
        .fill()
        .map(() => ({
          isDiamond: false,
          isBomb: false,
          isRevealed: false,
          isHovered: false,
          spriteIndex: 0,
        }))
    );

  // Place mines using simple random generation
  let bombsPlaced = 0;
  while (bombsPlaced < validMines) {
    const row = Math.floor(Math.random() * gridSize);
    const col = Math.floor(Math.random() * gridSize);
    if (!newGrid[row][col].isBomb) {
      newGrid[row][col].isBomb = true;
      bombsPlaced++;
    }
  }

  // All non-bomb cells are diamonds (gems)
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (!newGrid[i][j].isBomb) {
        newGrid[i][j].isDiamond = true;
      }
    }
  }

  return newGrid;
};

const Game = ({ betSettings = {}, onGameStatusChange, onGameComplete }) => {
  // Redux integration
  const dispatch = useDispatch();
  const { userBalance } = useSelector((state) => state.balance);
  const { isConnected } = useWalletStatus();

  // Game Settings
  const defaultSettings = {
    betAmount: 0.001, // Default to 0.001 OCT
    mines: 5,
    isAutoBetting: false,
    tilesToReveal: 5,
  };

  const settings = { ...defaultSettings, ...betSettings };
  const processedSettingsRef = useRef(null); // Track if current settings have been processed
  const isCashoutCompleteRef = useRef(false); // Track if user just cashed out
  
  // Game State
  const [grid, setGrid] = useState([]);
  const [gridSize, setGridSize] = useState(GRID_SIZES[5]); // Default 5x5 grid
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [minesCount, setMinesCount] = useState(settings.mines);
  const [revealedCount, setRevealedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [multiplier, setMultiplier] = useState(1.0);
  const [profit, setProfit] = useState(0);
  const [hasPlacedBet, setHasPlacedBet] = useState(false);
  const [isAutoBetting, setIsAutoBetting] = useState(settings.isAutoBetting);
  const [isGameInfoVisible, setIsGameInfoVisible] = useState(false);
  const [betAmount, setBetAmount] = useState(parseFloat(settings.betAmount));
  const [autoRevealInProgress, setAutoRevealInProgress] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  
  // Audio refs
  const audioRefs = {
    click: useRef(null),
    reveal: useRef(null),
    gem: useRef(null),
    explosion: useRef(null),
    win: useRef(null),
    cashout: useRef(null),
    hover: useRef(null),
    bet: useRef(null),
  };
  
  // Window size for Confetti
  const { width, height } = useWindowSize();
  const { t } = useTranslation();
  
  // Calculate safe tiles
  const totalTiles = gridSize * gridSize;
  const safeTiles = totalTiles - minesCount;
  
  // Calculate current payout
  const calculatePayout = () => {
    const currentBetAmount = parseFloat(settings.betAmount) || 0.001;
    const payout = currentBetAmount * multiplier;
    console.log('Calculating payout:', { currentBetAmount, multiplier, payout });
    return payout;
  };

  // Calculate the chance of hitting a mine on the next click
  const calculateMineChance = () => {
    const remainingTiles = totalTiles - revealedCount;
    if (remainingTiles <= 0) {
      return 0;
    }
    const chance = (minesCount / remainingTiles) * 100;
    return Math.round(chance);
  };

  // Multiplier table (memoized to avoid recalculation)
  const multiplierTable = useMemo(() => {
    const table = [];
    const safeTiles = totalTiles - minesCount;

    // Show multipliers for revealing 1 up to all safe tiles
    for (let i = 1; i <= safeTiles; i++) {
      const multiplierValue = calculateMultiplier(i, minesCount, gridSize);
      if (multiplierValue > 0 && multiplierValue !== Infinity) {
        table.push({
          tiles: i,
          multiplier: multiplierValue.toFixed(2) + 'x',
        });
      }
    }
    
    // If the table is empty (e.g., 25 mines), show a message
    if (table.length === 0 && safeTiles > 0) {
      const finalMultiplier = calculateMultiplier(safeTiles, minesCount, gridSize);
      if (finalMultiplier > 0 && finalMultiplier !== Infinity) {
        table.push({
          tiles: safeTiles,
          multiplier: finalMultiplier.toFixed(2) + 'x',
        });
      }
    }

    return table;
  }, [minesCount, totalTiles, gridSize]);

  // Play sound helper function
  const playSound = (sound) => {
    if (isMuted || !audioRefs[sound]?.current) return;
    
    try {
      const audio = audioRefs[sound].current;
      audio.currentTime = 0; // Reset to start
      audio.volume = 0.3; // Set volume to 30%
      audio.play().catch(error => {
        console.warn(`Could not play sound ${sound}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${sound}:`, error);
    }
  };
  
  // Initialize the game on component mount
  useEffect(() => {
    const initGame = async () => {
      const size = GRID_SIZES[5];
      setGridSize(size);
      
      try {
        const newGrid = await initializeGrid(size, settings.mines);
        setGrid(newGrid);
      } catch (error) {
        console.error('❌ Error initializing game grid:', error);
        // Fallback initialization
        setGrid(Array(size).fill().map(() =>
          Array(size).fill().map(() => ({
            isDiamond: true,
            isBomb: false,
            isRevealed: false,
            isHovered: false,
            spriteIndex: 0,
          }))
        ));
      }
    };
    
    initGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notify parent about game status changes
  useEffect(() => {
    if (onGameStatusChange) {
      // Use a small delay to ensure state updates are complete
      const notifyParent = () => {
        onGameStatusChange({ isPlaying, hasPlacedBet });
      };
      setTimeout(notifyParent, 10);
    }
  }, [isPlaying, hasPlacedBet, onGameStatusChange]);

  // Update state when bet settings change, but DO NOT start the game
  useEffect(() => {
    // Don't apply settings if a game is in progress
    if (isPlaying || hasPlacedBet) {
      return;
    }

    const newMinesCount = settings.mines || defaultSettings.mines;
    const newBetAmount = parseFloat(settings.betAmount) || defaultSettings.betAmount;

    const updateGridForNewSettings = async () => {
      setMinesCount(newMinesCount);
      const newGrid = await initializeGrid(gridSize, newMinesCount);
      setGrid(newGrid);
      setMultiplier(1.0);
      setProfit(0);
      setRevealedCount(0);
    };

    // Only update if things have actually changed
    if (newMinesCount !== minesCount) {
      updateGridForNewSettings();
    }
    if (newBetAmount !== betAmount) {
      setBetAmount(newBetAmount);
    }
    
  }, [settings.mines, settings.betAmount, isPlaying, hasPlacedBet]);

  // This effect will now ONLY handle the form submission (actual bet)
  useEffect(() => {
    // Ensure we have settings and the form was actually submitted
    if (Object.keys(betSettings).length === 0 || !betSettings.submitted) {
      return;
    }

    // Reset the submission flag to prevent re-triggering
    betSettings.submitted = false;

    const startGameWithBet = async () => {
      console.log('🔌 Mines Bet - Wallet Status:', { isConnected, userBalance });
      if (!isConnected) {
        toast.error('Please connect your wallet first to play Mines!');
        return;
      }
      
      const currentBalance = parseFloat(userBalance || '0');
      const betToPlace = parseFloat(settings.betAmount);
      
      if (currentBalance < betToPlace) {
        toast.error(`Insufficient balance. You have ${currentBalance.toFixed(5)} OCT but need ${betToPlace} OCT`);
        return;
      }

      try {
        // Deduct bet amount from Redux balance
        const newBalance = (currentBalance - betToPlace).toString();
        dispatch(setBalance(newBalance));
        
        console.log('=== STARTING MINES BET ===');
        console.log('Bet amount:', betToPlace);
        console.log('Mines count:', settings.mines);
        
        // Reset game state for new round
        setGameOver(false);
        setGameWon(false);
        setGrid(await initializeGrid(gridSize, settings.mines));
        setMultiplier(1.0);
        setProfit(0);
        setRevealedCount(0);
        
        // Start the game
        setIsPlaying(true);
        setHasPlacedBet(true);
        playSound('bet');
        
        toast.success(`Bet placed! ${betToPlace.toFixed(5)} OCT deducted.`);
        
        if (settings.isAutoBetting) {
          toast.info(`Auto betting mode: Will reveal ${settings.tilesToReveal || 5} tiles`);
          setTimeout(() => {
            autoRevealTiles(settings.tilesToReveal);
          }, 100);
        }
      } catch (error) {
        console.error('Error placing bet:', error);
        toast.error(`Bet placement failed: ${error.message}`);
        // Refund on error
        dispatch(setBalance(userBalance));
      }
    };
    
    startGameWithBet();
  }, [betSettings, userBalance, dispatch, isConnected]); // Dependency on betSettings will catch submissions

  // Handle cell hover (for desktop)
  const handleCellHover = (row, col, isHovering) => {
    if (gameOver || gameWon || !isPlaying || grid[row][col].isRevealed) return;
    
    if (isHovering) playSound('hover');
    
    const newGrid = [...grid];
    newGrid[row][col].isHovered = isHovering;
    setGrid(newGrid);
  };

  // Reveal a specific cell
  const revealCell = (row, col) => {
    if (gameOver || gameWon || !isPlaying || grid[row][col].isRevealed) return;

    playSound('click');

    const newGrid = [...grid];
    newGrid[row][col].isRevealed = true;

    setTimeout(() => {
    if (grid[row][col].isBomb) {
        playSound('explosion');
        toast.error('Game Over! You hit a mine!');
        
        // Immediately reset critical states
        setIsPlaying(false);
        setHasPlacedBet(false);
        
        // Reset game state for mine hit
        const resetAfterMine = () => {
          setGameOver(true);
          setMultiplier(1.0);
          setProfit(0);
          revealAll();
          
          // Mark game as completed to prevent auto-restart
          isCashoutCompleteRef.current = true;
          
          // Force parent component to update immediately
          if (onGameStatusChange) {
            onGameStatusChange({ isPlaying: false, hasPlacedBet: false });
          }
          
          // Notify parent about game completion
          if (onGameComplete) {
            onGameComplete({
              action: 'reveal',
              mines: minesCount,
              betAmount: betAmount,
              won: false,
              payout: 0,
              multiplier: 0,
              isMine: true,
              tileIndex: row * gridSize + col,
              gameId: `mines_${Date.now()}`
            });
          }
        };
        
        // Use setTimeout to ensure state updates happen properly
        setTimeout(resetAfterMine, 50);
    } else if (grid[row][col].isDiamond) {
        playSound('gem');
        
        setRevealedCount(prev => {
          const newCount = prev + 1;
          
          // Update multiplier using the new formula
          const newMultiplier = calculateMultiplier(newCount, minesCount, gridSize);
          setMultiplier(newMultiplier);

          // Update profit
          const currentBetAmount = parseFloat(betAmount) || 0.001;
          setProfit(Math.round(currentBetAmount * (newMultiplier - 1)));
          
          // Check if all safe tiles are revealed
          if (newCount === safeTiles) {
            playSound('win');
            setShowConfetti(true);
            toast.success('Congratulations! You revealed all safe tiles!');
            setTimeout(() => setShowConfetti(false), 5000);
            
            // Immediately reset critical states
            setIsPlaying(false);
            setHasPlacedBet(false);
            
            // Reset game state for win
            const resetAfterWin = () => {
              setGameWon(true);
              setMultiplier(1.0);
              setProfit(0);
              revealAll();
              
              // Mark game as completed to prevent auto-restart
              isCashoutCompleteRef.current = true;
              
              // Force parent component to update immediately
              if (onGameStatusChange) {
                onGameStatusChange({ isPlaying: false, hasPlacedBet: false });
              }
              
              // Notify parent about game completion
              if (onGameComplete) {
                onGameComplete({
                  action: 'reveal',
                  mines: minesCount,
                  betAmount: betAmount,
                  won: true,
                  payout: calculatePayout(),
                  multiplier: multiplier,
                  isMine: false,
                  tileIndex: -1, // All tiles revealed
                  tilesRevealed: safeTiles,
                  gameId: `mines_${Date.now()}`
                });
              }
            };
            
            // Use setTimeout to ensure state updates happen properly
            setTimeout(resetAfterWin, 50);
        }
          
          return newCount;
      });
    }
    }, 200);

    setGrid(newGrid);
  };

  // Auto-reveal tiles (for auto betting)
  const autoRevealTiles = (count = settings.tilesToReveal) => {
    if (gameOver || gameWon || !isPlaying || autoRevealInProgress) return;
    
    setAutoRevealInProgress(true);
    
    // Ensure we have a valid count from settings
    const tilesToReveal = count || 5; // Default to 5 if undefined
    
    // Show more tiles for high mine counts
    const maxTiles = minesCount >= 20 ? Math.min(safeTiles, tilesToReveal) : Math.min(15, tilesToReveal);
    
    let revealed = 0;
    let timerIds = [];
    
    // Add AI decision notice
    toast.info("AI is making decisions...");
    
    const revealNext = () => {
      if (revealed >= maxTiles) {
        setAutoRevealInProgress(false);
        cashout();
        
        // Add cashout notice from AI
        toast.success("AI Agent: Optimal cashout point reached ✓");
        return;
      }
      
      // Find all unrevealed gem cells
      const unrevealedGems = [];
      grid.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (!cell.isRevealed && cell.isDiamond) {
            unrevealedGems.push([rowIndex, colIndex]);
          }
        });
      });
      
      if (unrevealedGems.length === 0) {
        setAutoRevealInProgress(false);
        return;
      }
      
      // For AI behavior - use simple random for decisions
      const makeAIMove = () => {
        const randomIndex = Math.floor(Math.random() * unrevealedGems.length);
        const [rowToReveal, colToReveal] = unrevealedGems[randomIndex];
        
        const aiDelay = 300 + Math.random() * 700;
        setTimeout(() => {
          revealCell(rowToReveal, colToReveal);
          revealed++;
          
          // Check if game is over after each reveal
          if (!gameOver && !gameWon) {
            const timerId = setTimeout(revealNext, aiDelay);
            timerIds.push(timerId);
          } else {
            setAutoRevealInProgress(false);
            if (gameOver) {
              toast.error("AI Agent: Mine detected - round lost");
              // Reset game state after auto-reveal loss
              const resetAfterAutoLoss = () => {
                setIsPlaying(false);
                setHasPlacedBet(false);
                setMultiplier(1.0);
                setProfit(0);
                // Mark game as completed to prevent auto-restart
                isCashoutCompleteRef.current = true;
              };
              setTimeout(resetAfterAutoLoss, 0);
            } else if (gameWon) {
              toast.success("AI Agent: Perfect game! All safe tiles revealed!");
              // Reset game state after auto-reveal win
              const resetAfterAutoWin = () => {
                setIsPlaying(false);
                setHasPlacedBet(false);
                setMultiplier(1.0);
                setProfit(0);
                // Mark game as completed to prevent auto-restart
                isCashoutCompleteRef.current = true;
              };
              setTimeout(resetAfterAutoWin, 0);
            }
          }
        }, aiDelay);
      };
      
      makeAIMove();
    };
    
    // Start the auto-reveal process
    const initialDelay = 800; // initial thinking delay
    setTimeout(revealNext, initialDelay);
    
    // Cleanup timers if component unmounts
    return () => timerIds.forEach(id => clearTimeout(id));
  };

  // Reveal all cells (game over)
  const revealAll = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isRevealed: true,
      }))
    );
    setGrid(newGrid);
  };

  // Reset the game
  const resetGame = () => {
    playSound('click');
    
    // Update the processed settings ref when manually resetting
    processedSettingsRef.current = null;
    
    setIsPlaying(false);
    setGameOver(false);
    setGameWon(false);
    
    const resetGrid = async () => {
      const newGrid = await initializeGrid(gridSize, minesCount);
      setGrid(newGrid);
    };
    resetGrid();

    setMultiplier(1.0);
    setProfit(0);
    setRevealedCount(0);
    setAutoRevealInProgress(false);
    setShowConfetti(false);
    setIsStartingGame(false);
    
    // Reset hasPlacedBet to allow user to go back to the form
    setHasPlacedBet(false);
  };
  
  // Cashout function
  const cashout = () => {
    if (!isPlaying || gameOver || gameWon || revealedCount === 0) return;

    try {
      const payout = calculatePayout();
      
      // Cashout is just a local operation - no blockchain transaction needed
      // The actual payout was already handled in the initial bet transaction
              toast.success(`Cashed out: ${payout.toFixed(5)} OCT (${multiplier.toFixed(2)}x)`);
      playSound('cashout');
      
      // Update user balance in Redux store (add payout to current balance)
      const currentBalance = parseFloat(userBalance || '0');
      const newBalance = currentBalance + payout;
      
      console.log('Balance update:', {
        currentBalance: currentBalance.toFixed(5),
        payout: payout.toFixed(5),
        newBalance: newBalance.toFixed(5)
      });
      
      dispatch(setBalance(newBalance.toString()));
      
      // Show confetti on any profitable cashout
      if (payout > 0) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
      
      // COMPLETELY RESET ALL GAME STATE for next round
      // Immediately reset critical states
      setIsPlaying(false);
      setHasPlacedBet(false);
      
      // Then reset other states with a small delay
      const resetGameState = () => {
        setGameWon(false);
        setGameOver(false);
        setRevealedCount(0);
        setMultiplier(1.0);
        setProfit(0);
        setAutoRevealInProgress(false);
        setIsStartingGame(false);
        
        // Mark cashout as complete to prevent auto-restart
        isCashoutCompleteRef.current = true;
        // Keep the processed settings to prevent auto-restart
        // processedSettingsRef.current = null; // Don't reset this
        
        // Force a complete game reset
        const resetGridOnCashout = async () => {
          const newGrid = await initializeGrid(gridSize, minesCount);
          setGrid(newGrid);
        };
        resetGridOnCashout();
        
        // Force parent component to update immediately
        if (onGameStatusChange) {
          onGameStatusChange({ isPlaying: false, hasPlacedBet: false });
        }
        
        // Notify parent about game completion
        if (onGameComplete) {
          onGameComplete({
            action: 'cashout',
            mines: minesCount,
            betAmount: betAmount.toFixed(5),
            won: true,
            payout: payout.toFixed(5),
            multiplier: multiplier.toFixed(2),
            tilesRevealed: revealedCount,
            gameId: `mines_${Date.now()}`
          });
        }
      };
      
      // Use setTimeout to ensure state updates happen after current render cycle
      setTimeout(resetGameState, 50);
      
    } catch (error) {
      console.error('Error cashing out:', error);
      toast.error(`Cashout failed: ${error.message}`);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Toggle game info
  const toggleGameInfo = () => {
    setIsGameInfoVisible(!isGameInfoVisible);
  };
  
  const adjustMinesCount = (delta) => {
    if (isPlaying || hasPlacedBet) return;
    
    // For 5x5 grid, allow up to 24 mines (with 1 safe tile)
    const newCount = Math.max(1, Math.min(minesCount + delta, 24));
    setMinesCount(newCount);
  };
  
  // Cell content renderer
  const getCellContent = (cell) => {
    if (!cell.isRevealed) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <FaQuestion className="text-gray-400 text-xl md:text-2xl" />
        </div>
      );
    }
    
    if (cell.isBomb) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={MINE_SPRITES[cell.spriteIndex % MINE_SPRITES.length]}
            alt="Mine"
            width={64}
            height={64}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </div>
      );
    }
    
    if (cell.isDiamond) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Image
            src={GEM_SPRITES[cell.spriteIndex % GEM_SPRITES.length]}
            alt="Gem"
            width={64}
            height={64}
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <div className="relative flex flex-col items-center w-full">
      {/* Audio elements */}
      {Object.entries(SOUNDS).map(([key, src]) => (
        <audio key={key} ref={audioRefs[key]} src={src} preload="auto" />
      ))}
      
      {/* Confetti animation for wins */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
      
      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="dark" />
      
      {/* Game information overlay */}
      <AnimatePresence>
        {isGameInfoVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/90 backdrop-blur-sm z-50 p-6 overflow-auto"
          >
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <GiMineTruck className="mr-2 text-red-500" /> {t('mines_game.how_to_play_title')}
              </h3>
              
              <div className="space-y-4 text-white/90">
                <p><strong>{t('mines_game.objective_title')}:</strong> {t('mines_game.objective_text')}</p>
                
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <FaRegGem className="text-blue-400 text-xl" />
                  <span>{t('mines_game.gems_info')}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <FaBomb className="text-red-500 text-xl" />
                  <span>{t('mines_game.mines_info')}</span>
                </div>
                
                <div className="flex items-center gap-2 bg-gray-800/50 p-2 rounded">
                  <FaCoins className="text-yellow-500 text-xl" />
                  <span>{t('mines_game.cashout_info')}</span>
                </div>
                
                <p><strong>{t('mines_game.strategy_title')}:</strong> {t('mines_game.strategy_text')}</p>
                
                <div className="border border-gray-700 rounded p-4">
                  <h4 className="text-lg font-semibold mb-2">{t('mines_game.payout_formula_title')}</h4>
                  <p className="font-mono bg-gray-800/50 p-2 rounded text-sm">
                    {t('mines_game.payout_formula_text')}
                  </p>
                </div>
      </div>

              <button 
                className="mt-6 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg text-white font-medium"
                onClick={toggleGameInfo}
              >
                {t('mines_game.got_it_button')}
              </button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Header */}
      <div className="w-full flex flex-wrap justify-between items-center gap-2 mb-4">
        <div className="flex items-center space-x-3">
          <button 
            className="p-2 rounded-full bg-purple-900/20 hover:bg-purple-900/40 transition-colors"
            onClick={toggleMute}
            title={isMuted ? t('mines_game.unmute_button') : t('mines_game.mute_button')}
          >
            {isMuted ? 
              <HiOutlineVolumeOff className="text-white/70 text-xl" /> : 
              <HiOutlineVolumeUp className="text-white/70 text-xl" />
            }
          </button>

          <button
            className="p-2 rounded-full bg-blue-900/20 hover:bg-blue-900/40 transition-colors"
            onClick={toggleGameInfo}
            title={t('mines_game.game_info_button')}
          >
            <HiOutlineInformationCircle className="text-white/70 text-xl" />
          </button>
        </div>
      </div>
      
      {/* Game Stats */}
      <div className="w-full grid grid-cols-3 gap-2 mb-3">
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-white/50 mb-1">{t('mines_game.chance_of_mine_label')}</div>
          <div className={`text-lg font-bold ${calculateMineChance() > 50 ? 'text-red-400' : 'text-white'}`}>
            {calculateMineChance()}%
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-white/50 mb-1">{t('mines_game.multiplier_label')}</div>
          <div className="text-lg font-bold text-yellow-400">
            {multiplier.toFixed(2)}x
          </div>
        </div>
        
        <div className="bg-gray-900/50 rounded p-2 text-center">
          <div className="text-xs text-white/50 mb-1">{t('mines_game.profit_label')}</div>
          <div className={`text-lg font-bold ${profit > 0 ? 'text-green-400' : 'text-white'}`}>
            {profit > 0 ? '+' : ''}{profit}
          </div>
        </div>
      </div>
      
      {/* Game Grid */}
      <div 
        className={`grid gap-1.5 w-full mb-3 mx-auto max-w-md`}
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {grid && Array.isArray(grid) ? grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              className={`
                aspect-square flex items-center justify-center rounded-lg 
                ${cell.isRevealed ? (
                  cell.isBomb ? 'bg-red-900/70' : 'bg-blue-600/30'
                ) : (
                  cell.isHovered ? 'bg-purple-800/30' : 'bg-gray-900/70'
                )}
                ${!isPlaying ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                ${cell.isRevealed ? '' : 'hover:bg-purple-800/30'}
                transition-colors duration-200 text-2xl
                border border-gray-800 shadow-lg
              `}
              onClick={() => isPlaying && revealCell(rowIndex, colIndex)}
              onMouseEnter={() => handleCellHover(rowIndex, colIndex, true)}
              onMouseLeave={() => handleCellHover(rowIndex, colIndex, false)}
              disabled={!isPlaying || cell.isRevealed || gameOver || gameWon}
              whileHover={{ scale: isPlaying && !cell.isRevealed ? 1.05 : 1 }}
              whileTap={{ scale: isPlaying && !cell.isRevealed ? 0.95 : 1 }}
              animate={{ 
                opacity: cell.isRevealed ? 1 : 0.9,
                scale: cell.isRevealed ? 1 : 1
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {getCellContent(cell)}
            </motion.button>
          ))
        ) : null}
      </div>
      
      {/* Game Controls */}
      <div className="w-full space-y-2">
        {/* Remove the Start Game button from here - it should only be in the left panel */}
        
        {/* Cashout button - only show when game is actively being played */}
        {hasPlacedBet && isPlaying && !gameOver && !gameWon && (
          <div className="flex gap-3">
            <button
              onClick={cashout}
              disabled={revealedCount === 0}
              className={`w-full py-3 ${
                revealedCount > 0
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' 
                  : 'bg-gray-700 cursor-not-allowed'
              } rounded-lg text-white font-bold shadow-lg transition-all flex items-center justify-center gap-2`}
            >
              <FaCoins className="text-yellow-300" />
              <span>{t('mines_game.cashout_button', { amount: calculatePayout() })}</span>
            </button>
          </div>
        )}
        
        {/* Win message - shown when game is won */}
        {gameWon && (
          <div className="text-center py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg text-white font-bold">
            <span>{t('mines_game.congratulations_message')}</span>
            <div className="mt-2 text-sm opacity-90">
              {t('mines_game.winnings_message', { amount: calculatePayout(), multiplier: multiplier.toFixed(2) })}
            </div>
          </div>
        )}
        
        {/* Game result message */}
        {(gameOver || gameWon) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center py-1.5 rounded-lg ${
              gameWon ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
            } font-bold`}
          >
            {gameWon ? t('mines_game.won_message_short') : t('mines_game.lost_message_short')}
          </motion.div>
        )}
      </div>
      
      {/* Multiplier Table */}
      <div className="w-full mt-2">
        <h3 className="text-white font-medium mb-2 flex items-center">
          <GiCrystalGrowth className="mr-2 text-blue-400" /> 
          {t('mines_game.multiplier_table_title')}
        </h3>
        <div className="relative">
          {/* Scrollable multiplier table with improved styling and indicators */}
          <div className="bg-black/40 p-4 rounded-xl border border-gray-700/60 shadow-lg">
            {/* Shadow indicators with arrow icons for better UX */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none flex items-center justify-center">
              <FaArrowLeft className="text-purple-400 ml-2" />
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none flex items-center justify-center">
              <FaArrowRight className="text-purple-400 mr-2" />
            </div>
            
            <div className="overflow-x-auto pb-1">
              <div className="flex gap-3 min-w-max">
                {multiplierTable.map((item, index) => (
                  <div 
                    key={index}
                    className={`min-w-[95px] p-2.5 text-center rounded-lg ${
                      item.tiles === revealedCount 
                        ? 'bg-gradient-to-br from-purple-700 to-purple-600 text-white font-bold shadow-lg shadow-purple-700/50 border-2 border-purple-500/80' 
                        : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white/90 hover:bg-gray-700/90 transition-colors shadow-md border border-gray-700/50'
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{t('mines_game.tiles_label', { count: item.tiles })}</div>
                    <div className="text-xl font-semibold">{item.multiplier}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {safeTiles === 1 ? (
              <div className="text-xs text-center text-yellow-400 font-medium mt-3">
                {t('mines_game.one_safe_tile_message', { multiplier: (25.00).toFixed(2) })}
              </div>
            ) : multiplierTable.length > 6 && (
              <div className="text-xs text-center text-white/80 mt-3 flex items-center justify-center gap-2">
                <FaArrowLeft className="text-purple-400" />
                <span>{t('mines_game.swipe_message')}</span>
                <FaArrowRight className="text-purple-400" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
