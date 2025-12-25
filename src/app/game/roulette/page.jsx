"use client";
import { useTranslation } from 'react-i18next';
import React, { useState, useReducer, useMemo, useEffect, useRef, useCallback } from "react";
import { Box, Typography, IconButton, CircularProgress } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { ThemeProvider, styled, createTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import ClearIcon from "@mui/icons-material/Clear";
import UndoIcon from "@mui/icons-material/Undo";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ParentSize from "@visx/responsive/lib/components/ParentSize";
import currency from "currency.js";
import TextFieldCurrency from "@/components/TextFieldCurrency";
import Button from "@/components/Button";
import { rouletteTutorial, rouletteOdds } from "./tutorials";
import { muiStyles } from "./styles";
import Image from "next/image";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { gameData, bettingTableData } from "./config/gameDetail";
import { useToken } from "@/hooks/useToken";

import useWalletStatus from '@/hooks/useWalletStatus';

import { FaVolumeMute, FaVolumeUp, FaChartLine, FaCoins, FaTrophy, FaDice, FaBalanceScale, FaRandom, FaPercentage, FaPlayCircle, FaRocket, FaStar, FaMeteor } from "react-icons/fa";
import { GiCardRandom, GiDiceTarget, GiRollingDices, GiPokerHand, GiSpaceship } from "react-icons/gi";
import { Shield, Stars, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
// import RouletteLeaderboard from './components/RouletteLeaderboard';
import StrategyGuide from './components/StrategyGuide';
import RoulettePayout from './components/RoulettePayout';
import WinProbabilities from './components/WinProbabilities';
import RouletteHistory from './components/RouletteHistory';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useSelector, useDispatch } from 'react-redux';
import { setBalance, setLoading, loadBalanceFromStorage } from '@/store/balanceSlice';
import pythEntropyService from '@/services/PythEntropyService';
import { useOneChainCasino } from '@/hooks/useOneChainCasino';

// Ethereum client functions will be added here when needed

// Casino module address for Ethereum
const CASINO_MODULE_ADDRESS = process.env.NEXT_PUBLIC_CASINO_MODULE_ADDRESS || "0x0000000000000000000000000000000000000000";




const parseOCTAmount = (amount) => {
  // Parse OCT amount
  return parseFloat(amount);
};

const CasinoGames = {
  roulette: {
    placeBet: (betType, betValue, amount, numbers = []) => ({
      // Mock payload for demo
      betType,
      betValue,
      amount,
      numbers
    })
  }
};


// Ethereum wallet integration will be added here

const TooltipWide = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 800,
    padding: '8px 12px',
    fontSize: '0.85rem',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(5px)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
  },
});

const enhancedTooltip = {
  tooltip: {
    backgroundColor: 'rgba(0, 20, 60, 0.95)',
    backdropFilter: 'blur(10px)',
    padding: '10px 15px',
    fontSize: '0.85rem',
    borderRadius: '12px',
    border: '1px solid rgba(0, 200, 255, 0.3)',
    boxShadow: '0 8px 32px rgba(0, 150, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, rgba(0, 20, 60, 0.95) 0%, rgba(0, 40, 80, 0.95) 100%)'
  }
};



const BetType = {
  NUMBER: 0,    // Single number (35:1) - bahsinizi 36'ya katlar
  COLOR: 1,     // Red/Black (1:1) - bahsinizi 2'ye katlar
  ODDEVEN: 2,   // Odd/Even (1:1) - bahsinizi 2'ye katlar
  HIGHLOW: 3,   // 1-18/19-36 (1:1) - bahsinizi 2'ye katlar
  DOZEN: 4,     // 1-12, 13-24, 25-36 (2:1) - bahsinizi 3'e katlar
  COLUMN: 5,    // First, Second, Third column (2:1) - bahsinizi 3'e katlar
  SPLIT: 6,     // Two adjacent numbers (17:1) - bahsinizi 18'e katlar
  STREET: 7,    // Three numbers horizontal (11:1) - bahsinizi 12'ye katlar
  CORNER: 8,    // Four numbers (8:1) - bahsinizi 9'a katlar
  LINE: 9       // Six numbers (5:1) - bahsinizi 6'ya katlar
};

// Bet payout multipliers - Doğru payout mantığı ile
// Payout = bahsinizi kaç katına çıkarır (1:1 = 2x, 2:1 = 3x, 35:1 = 36x)
const BetPayouts = {
  [BetType.NUMBER]: 36,    // 35:1 - bahsinizi 36'ya katlar
  [BetType.COLOR]: 2,      // 1:1 - bahsinizi 2'ye katlar
  [BetType.ODDEVEN]: 2,    // 1:1 - bahsinizi 2'ye katlar
  [BetType.HIGHLOW]: 2,    // 1:1 - bahsinizi 2'ye katlar
  [BetType.DOZEN]: 3,      // 2:1 - bahsinizi 3'e katlar
  [BetType.COLUMN]: 3,     // 2:1 - bahsinizi 3'e katlar
  [BetType.SPLIT]: 18,     // 17:1 - bahsinizi 18'e katlar
  [BetType.STREET]: 12,    // 11:1 - bahsinizi 12'ye katlar
  [BetType.CORNER]: 9,     // 8:1 - bahsinizi 9'a katlar
  [BetType.LINE]: 6        // 5:1 - bahsinizi 6'ya katlar
};


function BetBox({ betValue = 0, betType = "", position = "top-right", ...props }) {
  // Calculate position based on the position prop
  const getPosition = () => {
    switch (position) {
      case "top-right":
        return { top: "25%", left: "75%" };
      case "top-left":
        return { top: "25%", left: "25%" };
      case "bottom-right":
        return { top: "75%", left: "75%" };
      case "bottom-left":
        return { top: "75%", left: "25%" };
      default:
        return { top: "25%", left: "75%" }; // Default to top-right
    }
  };

  return (
    <Tooltip
      title={
        <Typography sx={{ color: '#00ffff', fontWeight: 'bold' }}>
          {betType}: {betValue}
        </Typography>
      }
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: enhancedTooltip.tooltip
        }
      }}
    >
      <Box
        sx={{
          position: "absolute",
          ...getPosition(),
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 5,
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #00d4ff 0%, #0066ff 50%, #003d7a 100%)",
          border: "2px solid rgba(0, 255, 255, 0.8)",
          boxShadow: "0 0 20px rgba(0, 200, 255, 0.6), 0 4px 15px rgba(0, 100, 200, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)",
          "&:hover": {
            transform: "translate(-50%, -50%) scale(1.2) rotate(5deg)",
            boxShadow: "0 0 40px rgba(0, 255, 255, 1), 0 8px 25px rgba(0, 150, 255, 0.8), inset 0 2px 0 rgba(255, 255, 255, 0.6)",
            background: "linear-gradient(135deg, #00ffff 0%, #00aaff 50%, #0066cc 100%)",
            filter: "brightness(1.2)"
          },
          animation: "chipFloat 3s ease-in-out infinite, chipGlow 2s ease-in-out infinite alternate",
          '@keyframes pulse': {
            '0%': { boxShadow: '0 0 20px rgba(0, 200, 255, 0.6), 0 4px 15px rgba(0, 100, 200, 0.4)' },
            '50%': { boxShadow: '0 0 30px rgba(0, 200, 255, 0.8), 0 4px 20px rgba(0, 100, 200, 0.6)' },
            '100%': { boxShadow: '0 0 20px rgba(0, 200, 255, 0.6), 0 4px 15px rgba(0, 100, 200, 0.4)' }
          }
        }}
        {...props}
      >
        <Typography
          sx={{
            fontSize: "13px",
            color: "white",
            fontWeight: "bold",
            textShadow: "0 0 8px rgba(0, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.5)",
          }}
        >
          {betValue}
        </Typography>
      </Box>
    </Tooltip>
  );
}

function GridInside({
  insideNumber = -1, // must define this
  topEdge = false,
  red = false,
  straightup = 0,
  splitleft = 0,
  splitbottom = 0,
  corner = 0,
  placeBet,
  isWinner = false,
  ...props
}) {
  // Get corner bet numbers from predefined map
  const getCornerNumbers = () => {
    // Predefined corner positions for all numbers
    // FIXED: Correct corner values based on actual roulette table layout
    const cornerMap = {
      2: "0,1,2",        // Middle-left corner
      5: "1,2,4,5",      // Middle-left corner
      8: "4,5,7,8",      // Middle-left corner
      11: "7,8,10,11",   // Middle-left corner - FIXED
      14: "10,11,13,14", // Middle-left corner - FIXED
      17: "13,14,16,17", // Middle-left corner - FIXED
      20: "16,17,19,20", // Middle-left corner
      23: "19,20,22,23", // Middle-left corner - FIXED
      26: "22,23,25,26", // Middle-left corner
      29: "25,26,28,29", // Middle-left corner
      32: "28,29,31,32", // Middle-left corner
      35: "31,32,33,35", // Middle-right corner
      
      3: "2,3,0",        // Top-left corner
      6: "2,3,5,6",      // Top-left corner
      9: "5,6,8,9",      // Top-left corner
      12: "8,9,11,12",   // Top-left corner
      15: "11,12,14,15", // Top-left corner - FIXED
      18: "14,15,17,18", // Top-left corner
      21: "17,18,20,21", // Top-left corner
      24: "20,21,23,24", // Top-left corner
      27: "23,24,26,27", // Top-left corner
      30: "26,27,29,30", // Top-left corner
      33: "29,30,32,33", // Top-left corner
      36: "32,33,35,36"  // Top-right corner
    };

    const cornerNumbers = cornerMap[insideNumber];
    if (cornerNumbers) {
      return `Corner ${cornerNumbers.replace(/,/g, '-')}`;
    }
    return `Corner ${insideNumber}`;
  };

  // Get split bet numbers from predefined map
  const getSplitNumbers = () => {
    // Predefined split positions for all numbers
    const splitMap = {
      // Left splits (n, n-3) - including 1,2,3 with 0
      1: "0,1",      // Bottom-left split with 0
      2: "0,2",      // Middle-left split with 0
      3: "0,3",      // Top-left split with 0
      
      4: "1,4",      // Bottom-left split
      7: "4,7",      // Bottom-left split
      10: "7,10",    // Bottom-left split
      13: "10,13",   // Bottom-left split
      16: "13,16",   // Bottom-left split
      19: "16,19",   // Bottom-left split
      22: "19,22",   // Bottom-left split
      25: "22,25",   // Bottom-left split
      28: "25,28",   // Bottom-left split
      31: "28,31",   // Bottom-left split
      34: "31,34",   // Bottom-left split
      
      5: "2,5",      // Middle-left split
      8: "5,8",      // Middle-left split
      11: "8,11",    // Middle-left split
      14: "11,14",   // Middle-left split
      17: "14,17",   // Middle-left split
      20: "17,20",   // Middle-left split
      23: "20,23",   // Middle-left split
      26: "23,26",   // Middle-left split
      29: "26,29",   // Middle-left split
      32: "29,32",   // Middle-left split
      35: "32,35",   // Middle-left split
      
      6: "3,6",      // Top-left split
      9: "6,9",      // Top-left split
      12: "9,12",    // Top-left split
      15: "12,15",   // Top-left split
      18: "15,18",   // Top-left split
      21: "18,21",   // Top-left split
      24: "21,24",   // Top-left split
      27: "24,27",   // Top-left split
      30: "27,30",   // Top-left split
      33: "30,33",   // Top-left split
      36: "33,36"    // Top-left split
    };

    const splitNumbers = splitMap[insideNumber];
    if (splitNumbers) {
      // Show only the numbers, not the split number
      return `Split ${splitNumbers.replace(',', '-')}`;
    }
    return `Split ${insideNumber}`;
  };

  // Get bottom bet numbers - can be either street bet or bottom split bet
  const getBottomBetNumbers = () => {
    const isBottomRow = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(insideNumber);
    const isMiddleRow = [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(insideNumber);
    const isTopRow = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(insideNumber);

    if (isBottomRow) {
      // Bottom row: street bet [n, n+1, n+2]
      const streetNumbers = [insideNumber, insideNumber + 1, insideNumber + 2];
      return `Street ${streetNumbers.join('-')}`;
    } else {
      // Middle/Top row: bottom split bet - use predefined values
      const bottomSplitMap = {
        2: "1,2",      // Split 2: 1,2
        3: "2,3",      // Split 3: 2,3
        5: "4,5",      // Split 5: 4,5
        6: "5,6",      // Split 6: 5,6
        8: "7,8",      // Split 8: 7,8
        9: "8,9",      // Split 9: 8,9
        11: "10,11",   // Split 11: 10,11
        12: "11,12",   // Split 12: 11,12
        14: "13,14",   // Split 14: 13,14
        15: "14,15",   // Split 15: 14,15
        17: "16,17",   // Split 17: 16,17
        18: "17,18",   // Split 18: 17,18
        20: "19,20",   // Split 20: 19,20
        21: "20,21",   // Split 21: 20,21
        23: "22,23",   // Split 23: 22,23
        24: "23,24",   // Split 24: 23,24
        26: "25,26",   // Split 26: 25,26
        27: "26,27",   // Split 27: 26,27
        29: "28,29",   // Split 29: 28,29
        30: "29,30",   // Split 30: 29,30
        32: "31,32",   // Split 32: 31,32
        33: "32,33",   // Split 33: 32,33
        35: "34,35",   // Split 35: 34,35 - Changed from street to split
        36: "35,36"    // Split 36: 35,36 - Changed from street to split
      };
      
      const splitNumbers = bottomSplitMap[insideNumber];
      if (splitNumbers) {
        return `Split ${splitNumbers.replace(',', '-')}`;
      }
      
      // Fallback to old calculation if not in map
      const bottomNumber = insideNumber + 3;
      return `Split ${insideNumber}-${bottomNumber}`;
    }
  };

  // Get horizontal split bet numbers from predefined map
  const getHorizontalSplitNumbers = () => {
    // Predefined horizontal split positions for all numbers
    const horizontalSplitMap = {
      // Horizontal splits (n, n+1) - same row - FIXED VALUES
      2: "1,2",      // Split 2: 1,2
      3: "2,3",      // Split 3: 2,3
      5: "4,5",      // Split 5: 4,5
      6: "5,6",      // Split 6: 5,6
      8: "7,8",      // Split 8: 7,8
      9: "8,9",      // Split 9: 8,9
      11: "10,11",   // Split 11: 10,11
      12: "11,12",   // Split 12: 11,12
      14: "13,14",   // Split 14: 13,14
      15: "14,15",   // Split 15: 14,15
      17: "16,17",   // Split 17: 16,17
      18: "17,18",   // Split 18: 17,18
      20: "19,20",   // Split 20: 19,20
      21: "20,21",   // Split 21: 20,21
      23: "22,23",   // Split 23: 22,23
      24: "23,24",   // Split 24: 23,24
      26: "25,26",   // Split 26: 25,26
      27: "26,27",   // Split 27: 26,27
      29: "28,29",   // Split 29: 28,29
      30: "29,30",   // Split 30: 29,30
      32: "31,32",   // Split 32: 31,32
      33: "32,33",   // Split 33: 32,33
      35: "34,35",   // Split 35: 34,35
      36: "35,36"    // Split 36: 35,36
    };

    const horizontalSplitNumbers = horizontalSplitMap[insideNumber];
    if (horizontalSplitNumbers) {
      // Show only the numbers, not the split number
      return `Split ${horizontalSplitNumbers.replace(',', '-')}`;
    }
    return `Split ${insideNumber}`;
  };

  return (
    <ParentSize {...props}>
      {({ width }) => (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            width: width,
            height: topEdge ? width + 10 : width,
            ...(red && { 
              background: "#d82633"
            }),
            ...(!red && { 
              background: "#000"
            }),
            ...(isWinner && {
              boxShadow: "0 0 40px 15px rgba(0, 255, 255, 1), 0 0 80px 25px rgba(0, 150, 255, 0.6), inset 0 0 30px rgba(0, 255, 255, 0.4)",
              zIndex: 3,
              background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #155e75 100%)",
              border: "3px solid rgba(0, 255, 255, 0.8)",
              animation: 'winnerPulse 1s ease-in-out infinite, winnerGlow 2s ease-in-out infinite alternate',
              "&::before": {
                content: '""',
                position: 'absolute',
                top: -5,
                left: -5,
                right: -5,
                bottom: -5,
                borderRadius: 'inherit',
                background: 'radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%)',
                animation: 'winnerRipple 1.5s ease-in-out infinite'
              },
              "&::after": {
                content: '""',
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                borderRadius: 'inherit',
                border: '2px solid rgba(0, 255, 255, 0.5)',
                animation: 'winnerRotate 3s linear infinite'
              }
            }),
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: red ? 
                "0 12px 35px rgba(216, 38, 51, 0.6), 0 0 40px rgba(216, 38, 51, 0.3), inset 0 0 20px rgba(216, 38, 51, 0.2)" :
                "0 12px 35px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.2)",
              zIndex: 2,
              "&::before": {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: red ? 
                  'radial-gradient(circle at center, rgba(216, 38, 51, 0.3) 0%, transparent 70%)' :
                  'radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                borderRadius: 'inherit',
                animation: 'pulse 1.5s infinite'
              }
            },
            "&::before": {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: red ? 
                'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(216,38,51,0.1) 100%)' :
                'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
              borderRadius: 'inherit',
              opacity: 0.6
            }
          }}
        >
          <Box
            sx={{ display: "flex", flexDirection: "column", width: "10px" }}
            id="left-edge"
          >
            {topEdge && (
              <Box
                sx={{
                  height: "10px",
                  backgroundColor: (theme) => theme.palette.dark.card,
                }}
              ></Box>
            )}
            <Box
              sx={{
                position: "relative",
                flex: 1,
                backgroundColor: (theme) => theme.palette.dark.card,
                cursor: "pointer",
              }}
              id="left-split-bet"
              onClick={(e) => placeBet(e, "inside", (insideNumber - 1) * 4 + 2)}
            >
              {splitleft > 0 && (
                <BetBox
                  betValue={splitleft}
                  betType={getSplitNumbers()}
                  position="top-right"
                  onClick={(e) =>
                    placeBet(e, "inside", (insideNumber - 1) * 4 + 2)
                  }
                />
              )}
            </Box>
            {(() => {
              // Only show corner bet if this number has a corner definition
              const cornerMap = {
                2: "0,1,2",        // Middle-left corner
                5: "1,2,4,5",      // Middle-left corner
                8: "4,5,7,8",      // Middle-left corner
                11: "7,8,10,11",   // Middle-left corner - FIXED
                14: "10,11,13,14", // Middle-left corner - FIXED
                17: "13,14,16,17", // Middle-left corner - FIXED
                20: "16,17,19,20", // Middle-left corner
                23: "19,20,22,23", // Middle-left corner - FIXED
                26: "22,23,25,26", // Middle-left corner
                29: "25,26,28,29", // Middle-left corner
                32: "28,29,31,32", // Middle-left corner
                35: "31,32,33,35", // Middle-right corner
                
                3: "2,3,0",        // Top-left corner
                6: "2,3,5,6",      // Top-left corner
                9: "5,6,8,9",      // Top-left corner
                12: "8,9,11,12",   // Top-left corner
                15: "11,12,14,15", // Top-left corner - FIXED
                18: "14,15,17,18", // Top-left corner
                21: "17,18,20,21", // Top-left corner
                24: "20,21,23,24", // Top-left corner
                27: "23,24,26,27", // Top-left corner
                30: "26,27,29,30", // Top-left corner
                33: "29,30,32,33", // Top-left corner
                36: "32,33,35,36"  // Top-right corner
              };
              
              // Only render corner bet area if this number has a corner definition
              if (cornerMap[insideNumber]) {
                return (
                  <Box
                    sx={{
                      position: "relative",
                      height: "10px",
                      backgroundColor: (theme) => theme.palette.dark.card,
                      cursor: "pointer",
                    }}
                    id="left-corner-bet"
                    onClick={(e) => placeBet(e, "inside", (insideNumber - 1) * 4 + 4)}
                  >
                    {corner > 0 && (
                      <BetBox
                        betValue={corner}
                        betType={getCornerNumbers()}
                        position="bottom-right"
                        onClick={(e) =>
                          placeBet(e, "inside", (insideNumber - 1) * 4 + 4)
                        }
                      />
                    )}
                  </Box>
                );
              }
              return null; // Don't render corner bet area for bottom row numbers
            })()}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
            {topEdge && (
              <Box
                sx={{
                  height: "10px",
                  backgroundColor: (theme) => theme.palette.dark.card,
                }}
              ></Box>
            )}
            <Box
              sx={{
                position: "relative",
                flex: 5,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
              id="straight-bet"
              onClick={(e) => placeBet(e, "inside", (insideNumber - 1) * 4 + 1)}
            >
              <Typography
                variant="h5"
                sx={{
                  position: "relative",
                  zIndex: 4,
                  textShadow: red ? 
                    "0 0 8px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.3)" :
                    "0 0 8px rgba(255, 255, 255, 0.8), 0 0 4px rgba(255, 255, 255, 0.3)",
                  fontWeight: "bold",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  transform: "translateX(-10%)",
                  color: red ? "#fff" : "#fff",
                  fontSize: "1.1rem"
                }}
              >
                {insideNumber}
              </Typography>
              {straightup > 0 && (
                <BetBox
                  betValue={straightup}
                  betType={"Straight up"}
                  position="top-right"
                  onClick={(e) =>
                    placeBet(e, "inside", (insideNumber - 1) * 4 + 1)
                  }
                />
              )}
            </Box>
            <Box
              sx={{
                position: "relative",
                flex: 1,
                backgroundColor: (theme) => theme.palette.dark.card,
                maxHeight: "10px",
                minHeight: "10px",
                cursor: "pointer",
              }}
              id="bottom-split-bet"
              onClick={(e) => placeBet(e, "inside", (insideNumber - 1) * 4 + 3)}
            >
              {splitbottom > 0 && (
                <BetBox
                  betValue={splitbottom}
                  betType={getBottomBetNumbers()}
                  position="bottom-right"
                  onClick={(e) =>
                    placeBet(e, "inside", (insideNumber - 1) * 4 + 3)
                  }
                />
              )}
            </Box>
          </Box>

        </Box>
      )}
    </ParentSize>
  );
}

function GridZero({ inside, placeBet, ...props }) {
  return (
    <ParentSize {...props}>
      {({ width, height }) => (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: width,
            height: height,
            cursor: "pointer",
            clipPath: "polygon(100% 0%, 100% 100%, 40% 100%, 0% 50%, 40% 0%)",
            backgroundColor: '#14D854',
          }}
          onClick={(e) => placeBet(e, "inside", 0)}
        >
          <Typography variant="h5">0</Typography>
          {inside[0] > 0 && (
            <BetBox
              betValue={inside[0]}
              betType={"Straight up"}
              onClick={(e) => placeBet(e, "inside", 0)}
            />
          )}
        </Box>
      )}
    </ParentSize>
  );
}

function GridColumnBet({
  topCard = false,
  bottomCard = false,
  index,
  columns,
  bet,
  placeBet,
  ...props
}) {
  return (
    <ParentSize style={{ height: "100%" }} {...props}>
      {({ width, height }) => (
        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: width,
            height: height,
            cursor: "pointer",
            backgroundColor: (theme) => theme.palette.dark.button,
            borderTop: (theme) =>
              `${topCard ? 10 : 5}px solid ${theme.palette.dark.card}`,
            borderBottom: (theme) =>
              `${bottomCard ? 10 : 5}px solid ${theme.palette.dark.card}`,
            borderRight: (theme) => "10px solid " + theme.palette.dark.card,
            borderLeft: (theme) => "10px solid " + theme.palette.dark.card,
          }}
          onClick={(e) => placeBet(e, "columns", index)}
        >
          <Typography variant="h5">2 To 1</Typography>
          {columns[index] > 0 && (
            <BetBox
              betValue={columns[index]}
              betType={`2 To 1 (row ${index + 1})`}
              onClick={(e) => placeBet(e, "columns", index)}
            />
          )}
        </Box>
      )}
    </ParentSize>
  );
}

function GridOutsideBet({ rightCard = false, active = false, betType = "", ...props }) {
  // Determine background color based on bet type
  const getBackgroundStyle = () => {
    switch (betType) {
      case 'red':
        return {
          background: "#d82633",
          borderBottom: "10px solid rgba(216, 38, 51, 0.6)",
          borderLeft: "10px solid rgba(216, 38, 51, 0.6)",
          "&:hover": {
            background: "linear-gradient(135deg, #ff3333 0%, #b71c1c 50%, #cc0000 100%)",
            boxShadow: "0 8px 25px rgba(216, 38, 51, 0.5), 0 0 30px rgba(216, 38, 51, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
            transform: "translateY(-2px) scale(1.02)"
          }
        };
      case 'black':
        return {
          background: "#000",
          borderBottom: "10px solid rgba(0, 0, 0, 0.6)",
          borderLeft: "10px solid rgba(0, 0, 0, 0.6)",
          "&:hover": {
            background: "linear-gradient(135deg, #333333 0%, #1a1a1a 50%, #000000 100%)",
            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.05)",
            transform: "translateY(-2px) scale(1.02)"
          }
        };
      default:
        return {
          background: "linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%)",
          borderBottom: "10px solid rgba(30, 58, 138, 0.6)",
          borderLeft: "10px solid rgba(30, 58, 138, 0.6)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
          "&:hover": {
            transform: "translateY(-4px) scale(1.03)",
            boxShadow: "0 15px 35px rgba(59, 130, 246, 0.4), 0 0 30px rgba(37, 99, 235, 0.3), inset 0 0 25px rgba(59, 130, 246, 0.2)",
            background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #4f46e5 100%)",
            border: "1px solid rgba(96, 165, 250, 0.6)",
            filter: "brightness(1.1)"
          }
        };
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 2,
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        ...getBackgroundStyle()
      }}
      {...props}
    >
      {props.children}
    </Box>
  );
}

const firstThird = [
  { val: 3, red: true },
  { val: 6 },
  { val: 9, red: true },
  { val: 12 },
  { val: 2 },
  { val: 5, red: true },
  { val: 8 },
  { val: 11 },
  { val: 1, red: true },
  { val: 4 },
  { val: 7, red: true },
  { val: 10 },
];
const secondThird = [
  { val: 15 },
  { val: 18, red: true },
  { val: 21, red: true },
  { val: 24 },
  { val: 14, red: true },
  { val: 17 },
  { val: 20 },
  { val: 23, red: true },
  { val: 13 },
  { val: 16, red: true },
  { val: 19, red: true },
  { val: 22 },
];
const thirdThird = [
  { val: 27, red: true },
  { val: 30, red: true },
  { val: 33 },
  { val: 36, red: true },
  { val: 26 },
  { val: 29 },
  { val: 32, red: true },
  { val: 35 },
  { val: 25, red: true },
  { val: 28 },
  { val: 31 },
  { val: 34, red: true },
];

const arrayReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return new Array(state.length).fill(0);
    case "update":
      let updatedArr = [...state];
      updatedArr[action.ind] = action.val;
      return updatedArr;
    default:
      return state;
  }
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case "reset":
      return [];
    case "update":
      return action.payload;
    default:
      return state;
  }
};
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const notificationSteps = {
  PLACING_BET: 0,
  BET_PLACED: 1,
  GENERATING_RANDOM: 2,
  RESULT_READY: 3
};

// Custom animated wheel component for visual feedback
const RouletteWheel = ({ spinning, result, onSpinComplete, onSpinStart, onWin, isSmallScreen, isPortrait }) => {
  const wheelRef = useRef(null);
  const [spinComplete, setSpinComplete] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (spinning && result >= 0) {
      // Calculate the rotation to land on the result number
      const segmentAngle = 360 / 37; // 37 segments (0-36)
      const baseRotation = 3600; // 10 full rotations for effect
      const resultPosition = segmentAngle * result;
      const finalRotation = baseRotation + resultPosition;

      setRotation(finalRotation);
      if (onSpinStart) onSpinStart();

      setTimeout(() => {
        setSpinComplete(true);
        if (onSpinComplete) onSpinComplete();
        if (onWin) onWin();
      }, 4200); // Slightly longer than animation
    } else if (!spinning) {
      setRotation(0);
      setSpinComplete(false);
    }
  }, [spinning, result, onSpinComplete, onSpinStart, onWin]);

  const wheelSize = isSmallScreen && !isPortrait ? '120px' : '200px';

  return (
    <Box
      sx={{
        width: wheelSize,
        height: wheelSize,
        borderRadius: '50%',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: spinning ? 
          '0 0 50px rgba(0, 200, 255, 0.8), 0 0 100px rgba(0, 150, 255, 0.5), inset 0 0 30px rgba(0, 255, 255, 0.3)' :
          '0 0 30px rgba(0,0,0,0.7), 0 0 60px rgba(0, 100, 200, 0.3)',
        margin: 'auto',
        display: result >= 0 ? 'block' : 'none',
        animation: spinning ? 'wheelGlow 1s ease-in-out infinite alternate' : 'none',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-10px',
          left: '-10px',
          right: '-10px',
          bottom: '-10px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 200, 255, 0.2) 0%, transparent 70%)',
          animation: spinning ? 'ripple 2s linear infinite' : 'none'
        }
      }}
    >
      <Box
        ref={wheelRef}
        sx={{
          width: '100%',
          height: '100%',
          backgroundImage: 'url(/images/roulette-wheel.png)',
          backgroundSize: 'contain',
          transformOrigin: 'center',
          position: 'relative',
          transform: `rotate(${rotation}deg)`,
          transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
          filter: spinning ? 'brightness(1.2) saturate(1.3)' : 'brightness(1) saturate(1)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: '50%',
            background: spinning ? 
              'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)' :
              'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)'
          }
        }}
      />
      {spinComplete && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '2rem',
            textShadow: '0 0 20px rgba(0,0,0,0.9), 0 0 40px rgba(0, 200, 255, 0.8)',
            zIndex: 10,
            animation: 'resultAppear 0.5s ease-out',
            '&::before': {
              content: `"${result}"`,
              position: 'absolute',
              top: 0,
              left: 0,
              color: 'rgba(0, 200, 255, 0.5)',
              filter: 'blur(8px)',
              animation: 'resultPulse 1s ease-in-out infinite'
            }
          }}
        >
          {result}
        </Box>
      )}
    </Box>
  );
};

// --- Bet FX helpers (local-only UI effects) ---
const fxKey = (type, ind = 0) => `${type}:${ind}`;

const safeNow = () => {
  try {
    return performance?.now?.() ?? Date.now();
  } catch {
    return Date.now();
  }
};

// Add betting statistics tracking
const BettingStats = ({ history, t }) => {
  const stats = useMemo(() => {
    console.log("BettingStats - history:", history); // Debug log
    if (!history || history.length === 0) return null;

    // Calculate session total bets (sum of all totalBets from each round)
    const statTotal = history.reduce((sum, bet) => sum + bet.totalBets, 0);

    // Calculate session total winnings (sum of all winningBets from each round)
    const statWinnings = history.reduce((sum, bet) => sum + bet.winningBets, 0);

    // Calculate win rate using statWinnings/statTotal
    const winRate = statTotal > 0 ? (statWinnings / statTotal * 100).toFixed(1) : 0;

    // Calculate most common numbers
    const numberFrequency = {};
    history.forEach(bet => {
      if (bet.result >= 0) {
        numberFrequency[bet.result] = (numberFrequency[bet.result] || 0) + 1;
      }
    });

    const mostCommonNumbers = Object.entries(numberFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([number, count]) => ({ number: parseInt(number), count }));

    // Calculate profit/loss
    // payout field now contains the net result (positive for wins, negative for losses)
    const totalProfitLoss = history.reduce((sum, bet) => sum + bet.payout, 0);
    
    // profitLoss is the actual net profit/loss from all bets
    const profitLoss = totalProfitLoss;



    console.log("Stats calculation details:", {
      historyLength: history.length,
      betDetails: history.map(bet => ({
        win: bet.win,
        amount: bet.amount,
        payout: bet.payout,
        totalBets: bet.totalBets,
        winningBets: bet.winningBets
      })),
      totalProfitLoss,
      profitLoss,
      statTotal,
      statWinnings
    });

    const result = {
      winRate,
      mostCommonNumbers,
      totalProfitLoss,
      profitLoss,
      totalBets: history.length,
      statTotal,
      statWinnings
    };

    console.log("BettingStats - calculated stats:", result); // Debug log
    return result;
  }, [history]);

  if (!stats) return null;

  return (
    <Box sx={{
      p: 2,
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '8px',
      background: 'rgba(0,0,0,0.3)'
    }}>
      <Typography variant="h6" color="white" sx={{ mb: 2 }}>{t('roulette_page.session_statistics')}</Typography>
      <Grid container spacing={2}>
        <Grid xs={6} md={4}>
          <Typography variant="body2" color="text.secondary">{t('roulette_page.win_rate')}</Typography>
          <Typography variant="h5">{stats.winRate}%</Typography>
        </Grid>
        <Grid xs={6} md={4}>
          <Typography variant="body2" color="text.secondary">{t('roulette_page.total_bets')}</Typography>
          <Typography variant="h5">{stats.statTotal}</Typography>
        </Grid>
        <Grid xs={6} md={4}>
          <Typography variant="body2" color="text.secondary">{t('roulette_page.pl')}</Typography>
          <Typography variant="h5" color={stats.profitLoss >= 0 ? 'success.main' : 'error.main'}>
            {stats.profitLoss >= 0 ? '+' : ''}{stats.profitLoss.toFixed(2)}
          </Typography>
        </Grid>

        <Grid xs={12}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{t('roulette_page.hot_numbers')}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            {stats.mostCommonNumbers.map((item) => (
              <Box
                key={item.number}
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: item.number === 0 ? '#14D854' :
                    [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(item.number) ? '#d82633' : '#000',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Typography variant="caption" fontWeight="bold">{item.number}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

// Roulette Header Component moved inside the main component

export default function GameRoulette() {
  const { t } = useTranslation();
  // Add a ref for scrolling past navbar
  const contentRef = useRef(null);
  // Add development mode flag - set to true to bypass network check
  const [devMode, setDevMode] = useState(false);

  // Add smooth scrolling to the entire document
  useEffect(() => {
    // Apply smooth scrolling to the html element
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      // Clean up when component unmounts
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  // Scroll past navbar on initial load
  useEffect(() => {
    const scrollPastNavbar = () => {
      if (contentRef.current) {
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }, 100);
      }
    };

    scrollPastNavbar();
  }, []);

  // Smooth scroll to element function
  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Add offset to account for fixed elements and prevent cutoff
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };

  // Roulette Header Component inside the main component to access scrollToElement
  const RouletteHeader = () => {
    // Calculate real statistics from betting history
    const gameStatistics = {
      totalBets: bettingHistory.length,
      totalVolume: bettingHistory.reduce((sum, bet) => sum + parseFloat(bet.amount || 0), 0).toFixed(5),
      maxWin: bettingHistory.length > 0 ? Math.max(...bettingHistory.map(bet => parseFloat(bet.payout || 0))).toFixed(5) : '0.00000'
    };

    return (
        <div className="relative text-white px-4 md:px-8 lg:px-20 mb-8 pt-20 md:pt-24 mt-4">
        {/* Enhanced Space-themed Background Elements */}
        <div className="absolute top-5 -right-32 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" style={{ animation: 'pulse 4s ease-in-out infinite, float 20s infinite ease-in-out' }}></div>
        <div className="absolute top-28 left-1/3 w-32 h-32 bg-gradient-to-r from-indigo-500/30 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{ animation: 'pulse 3s ease-in-out infinite, drift 25s infinite ease-in-out' }}></div>
        <div className="absolute -bottom-20 left-1/4 w-48 h-48 bg-gradient-to-r from-teal-500/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animation: 'pulse 5s ease-in-out infinite, float 30s infinite ease-in-out reverse' }}></div>
        <div className="absolute top-1/2 left-1/4 w-40 h-40 bg-gradient-to-r from-pink-500/15 to-rose-500/15 rounded-full blur-2xl" style={{ animation: 'drift 35s infinite ease-in-out' }}></div>
        <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 rounded-full blur-2xl" style={{ animation: 'float 40s infinite ease-in-out reverse' }}></div>
        
        {/* Animated stars background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                opacity: Math.random() * 0.8 + 0.2
              }}
            />
          ))}
        </div>

        <div className="relative">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* Left Column - Game Info */}
            <div className="md:w-1/2">
              <div className="flex items-center">
                <div className="mr-3 p-3 bg-gradient-to-br from-blue-900/60 to-cyan-700/30 rounded-lg shadow-lg shadow-blue-900/30 border border-cyan-800/40 backdrop-blur-sm">
                  <GiSpaceship className="text-3xl text-cyan-300" />
                </div>
                <div>
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm text-cyan-300 font-sans">{t('roulette_page.header_breadcrumb')}</p>
                    <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-900/50 to-cyan-800/40 rounded-full text-cyan-200 font-display border border-cyan-600/30">{t('roulette_page.header_tag_cosmic')}</span>
                    <span className="text-xs px-2 py-0.5 bg-gradient-to-r from-indigo-900/50 to-purple-800/40 rounded-full text-purple-200 font-display border border-purple-600/30">{t('roulette_page.header_tag_live')}</span>
                  </motion.div>
                  <motion.h1
                    className="text-3xl md:text-4xl font-bold font-display bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    {t('roulette_page.header_title')}
                  </motion.h1>
                </div>
              </div>
              <motion.p
                className="text-cyan-100/80 mt-2 max-w-xl font-sans"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('roulette_page.header_description')}
              </motion.p>

              {/* Game highlights */}
              <motion.div
                className="flex flex-wrap gap-4 mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center text-sm bg-gradient-to-r from-blue-900/50 to-cyan-800/30 px-3 py-1.5 rounded-full border border-cyan-600/30 backdrop-blur-sm">
                  <FaRocket className="mr-1.5 text-cyan-400" />
                  <span className="font-sans">{t('roulette_page.highlight_zero_gravity')}</span>
                </div>
                <div className="flex items-center text-sm bg-gradient-to-r from-indigo-900/50 to-purple-800/30 px-3 py-1.5 rounded-full border border-purple-600/30 backdrop-blur-sm">
                  <GiCardRandom className="mr-1.5 text-purple-400" />
                  <span className="font-sans">{t('roulette_page.highlight_stellar_odds')}</span>
                </div>
                <div className="flex items-center text-sm bg-gradient-to-r from-teal-900/50 to-blue-800/30 px-3 py-1.5 rounded-full border border-blue-600/30 backdrop-blur-sm">
                  <Shield className="mr-1.5 text-teal-400" />
                  <span className="font-sans">{t('roulette_page.highlight_quantum_fair')}</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Stats and Controls */}
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-800/10 rounded-xl p-4 border border-cyan-800/30 shadow-lg shadow-blue-900/20 backdrop-blur-sm">
                {/* Quick stats in top row */}
                <motion.div
                  className="grid grid-cols-3 gap-2 mb-4 w-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="flex flex-col items-center p-2 bg-gradient-to-br from-blue-800/40 to-cyan-700/20 rounded-lg min-w-0 w-full border border-cyan-600/20">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-400/30 mb-1">
                      <FaChartLine className="text-cyan-300" />
                    </div>
                    <div className="text-xs text-cyan-200/70 font-sans text-center">{t('roulette_page.stats_total_bets')}</div>
                    <div className="text-cyan-100 font-display text-sm md:text-base truncate w-full text-center" title={gameStatistics.totalBets}>
                      {gameStatistics.totalBets}
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-gradient-to-br from-indigo-800/40 to-purple-700/20 rounded-lg min-w-0 w-full border border-purple-600/20">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500/30 to-purple-400/30 mb-1">
                      <FaCoins className="text-purple-300" />
                    </div>
                    <div className="text-xs text-purple-200/70 font-sans text-center">{t('roulette_page.stats_volume')}</div>
                    <div className="text-purple-100 font-display text-sm md:text-base truncate w-full text-center" title={`${gameStatistics.totalVolume} OCT`}>
                      {gameStatistics.totalVolume} OCT
                    </div>
                  </div>

                  <div className="flex flex-col items-center p-2 bg-gradient-to-br from-teal-800/40 to-blue-700/20 rounded-lg min-w-0 w-full border border-teal-600/20">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-teal-500/30 to-blue-400/30 mb-1">
                      <FaTrophy className="text-teal-300" />
                    </div>
                    <div className="text-xs text-teal-200/70 font-sans text-center">{t('roulette_page.stats_max_win')}</div>
                    <div className="text-teal-100 font-display text-sm md:text-base truncate w-full text-center" title={`${gameStatistics.maxWin} OCT`}>
                      {gameStatistics.maxWin} OCT
                    </div>
                  </div>
                </motion.div>

                {/* Quick actions */}
                <motion.div
                  className="flex flex-wrap justify-between gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <button
                    onClick={() => scrollToElement('strategy')}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-800/50 to-cyan-700/30 rounded-lg text-cyan-100 font-medium text-sm hover:from-blue-700/60 hover:to-cyan-600/40 transition-all duration-300 border border-cyan-600/30 shadow-lg shadow-blue-900/20"
                  >
                    <GiCardRandom className="mr-2 text-cyan-300" />
                    {t('roulette_page.button_stellar_guide')}
                  </button>
                  <button
                    onClick={() => scrollToElement('payouts')}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-800/50 to-purple-700/30 rounded-lg text-purple-100 font-medium text-sm hover:from-indigo-700/60 hover:to-purple-600/40 transition-all duration-300 border border-purple-600/30 shadow-lg shadow-indigo-900/20"
                  >
                    <FaCoins className="mr-2 text-purple-300" />
                    {t('roulette_page.button_cosmic_payouts')}
                  </button>
                  <button
                    onClick={() => scrollToElement('history')}
                    className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-800/50 to-blue-700/30 rounded-lg text-teal-100 font-medium text-sm hover:from-teal-700/60 hover:to-blue-600/40 transition-all duration-300 border border-teal-600/30 shadow-lg shadow-teal-900/20"
                  >
                    <FaChartLine className="mr-2 text-teal-300" />
                    {t('roulette_page.button_space_history')}
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500 via-blue-400/50 to-purple-400/30 mt-6 shadow-lg shadow-cyan-500/30"></div>
        </div>
      </div>
    );
  };

  const [events, dispatchEvents] = useReducer(eventReducer, []);
  const [bet, setBet] = useState(0);
  const [inside, dispatchInside] = useReducer(arrayReducer, new Array(148).fill(0));
  const [red, setRed] = useState(0);
  const [black, setBlack] = useState(0);
  const [odd, setOdd] = useState(0);
  const [even, setEven] = useState(0);
  const [over, setOver] = useState(0);
  const [under, setUnder] = useState(0);
  const [dozens, dispatchDozens] = useReducer(arrayReducer, [0, 0, 0]);
  const [columns, dispatchColumns] = useReducer(arrayReducer, [0, 0, 0]);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [winnings, setWinnings] = useState(-1);
  const [rollResult, setRollResult] = useState(-1);
  const [notificationIndex, setNotificationIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [recentResults, setRecentResults] = useState([]);
  const [wheelSpinning, setWheelSpinning] = useState(false);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [bettingHistory, setBettingHistory] = useState([]);
  const [error, setError] = useState(null);

  // One Chain wallet
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const isConnected = !!currentAccount;
  const account = { address };
  const connected = isConnected;
  const isWalletReady = isConnected && address;
  const [realBalance, setRealBalance] = useState('0');
  const { balance } = useToken(address); // Keep for compatibility
  const HOUSE_ADDR = CASINO_MODULE_ADDRESS;
  
  // OneChain Casino hook for game logging
  const { placeRouletteBet: logRouletteGame, getGameHistory, formatOCTAmount } = useOneChainCasino();

  useEffect(() => {
    const fetchHistory = async () => {
      if (getGameHistory && isConnected && formatOCTAmount) {
        try {
          const history = await getGameHistory(1, 50);
          console.log("Fetched history33333:", history);
          const formattedHistory = history.map(item => {
            const betAmount = parseFloat(formatOCTAmount(item.betAmount || '0'));
            const payoutAmount = parseFloat(formatOCTAmount(item.payoutAmount || '0'));
            const payout = payoutAmount - betAmount;

            return {
              id: item.transactionHash,
              result: item.resultData.winningNumber,
              amount: betAmount,
              payout: payout, // Net win/loss
              win: item.resultData.isWin,
              totalBets: betAmount, // For stats
              winningBets: item.resultData.isWin ? payoutAmount : 0, // For stats
              timestamp: item.timestamp,
              betType: item.gameConfig?.betType,
              betValue: item.gameConfig?.betValue,
              playerAddress: item.playerAddress,
              txHash: item.transactionHash,
              details: null, // On-chain history does not have detailed breakdown
              entropyProof: { // Mocking for now to avoid breaking UI
                  transactionHash: item.entropyTxHash
              },
              onechainTxHash: item.transactionHash
            };
          });
          console.log("Fetched history4444:", formattedHistory);
          // Combine with existing session history if any, and remove duplicates
          setBettingHistory(prev => {
            const combined = [...formattedHistory, ...prev];
            const unique = combined.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
            return unique.sort((a, b) => b.timestamp - a.timestamp).slice(0, 50);
          });

        } catch (error) {
          console.error("Failed to fetch betting history:", error);
          setError("Failed to load past game history.");
        }
      }
    };

    fetchHistory();
  }, [getGameHistory, isConnected, formatOCTAmount, setBettingHistory]);

  // Function to fetch real OCT balance will be defined after useSelector

  // Sound refs
  const spinSoundRef = useRef(null);
  const winSoundRef = useRef(null);
  const chipSelectRef = useRef(null);
  const chipPlaceRef = useRef(null);
  const menuClickRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const ambientSoundsRef = useRef(null);

  // Sound utility function
  const playSound = useCallback((ref) => {
    if (!ref?.current || ref.current.muted) return;
    ref.current.currentTime = 0;
    ref.current.play().catch(error => console.error("Sound play failed:", error));
  }, []);

  // Start background sounds as soon as component mounts
  useEffect(() => {
    let backgroundMusicAttempted = false;
    let ambientSoundsAttempted = false;

    const startBackgroundSounds = async () => {
      console.log("Attempting to start background sounds...");

      // Function to handle user interaction and start sounds
      const startSound = async (ref, volume, name) => {
        if (!ref.current) {
          console.log(`${name} ref not available`);
          return;
        }

        try {
          ref.current.volume = volume;
          // Load the audio
          await ref.current.load();
          console.log(`${name} loaded successfully`);

          // Try to play
          const playPromise = ref.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log(`${name} playing successfully`);
              })
              .catch((error) => {
                console.log(`${name} autoplay failed:`, error);
                // Add click event listener if not already attempted
                if (!backgroundMusicAttempted && name === "Background Music") {
                  backgroundMusicAttempted = true;
                  document.addEventListener('click', async () => {
                    try {
                      await ref.current.play();
                      console.log(`${name} started after user interaction`);
                    } catch (err) {
                      console.log(`${name} failed after user interaction:`, err);
                    }
                  }, { once: true });
                }
                if (!ambientSoundsAttempted && name === "Ambient Sounds") {
                  ambientSoundsAttempted = true;
                  document.addEventListener('click', async () => {
                    try {
                      await ref.current.play();
                      console.log(`${name} started after user interaction`);
                    } catch (err) {
                      console.log(`${name} failed after user interaction:`, err);
                    }
                  }, { once: true });
                }
              });
          }
        } catch (err) {
          console.log(`${name} error:`, err);
        }
      };

      await startSound(backgroundMusicRef, 0.3, "Background Music");
      await startSound(ambientSoundsRef, 0.2, "Ambient Sounds");
    };

    startBackgroundSounds();

    // Cleanup function
    return () => {
      console.log("Cleaning up sound effects...");
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }
      if (ambientSoundsRef.current) {
        ambientSoundsRef.current.pause();
        ambientSoundsRef.current.currentTime = 0;
      }
    };
  }, []);

  // Handle muting of all sounds
  useEffect(() => {
    console.log("Mute status changed:", isMuted);
    const audioRefs = [
      spinSoundRef,
      winSoundRef,
      chipSelectRef,
      chipPlaceRef,
      menuClickRef,
      backgroundMusicRef,
      ambientSoundsRef
    ];

    audioRefs.forEach(ref => {
      if (ref?.current) {
        ref.current.muted = isMuted;
        console.log(`Set muted=${isMuted} for audio element`);
      }
    });
  }, [isMuted]);

  useEffect(() => {
    // Remove the dev mode setting
    console.log('Environment:', process.env.NODE_ENV);
  }, []);

  // Check screen size and orientation for responsive layout
  useEffect(() => {
    const checkScreenSize = () => {
      // Check if it's a mobile device (touch screen + small width)
      const isMobile = window.innerWidth < 1024 && 'ontouchstart' in window;
      setIsSmallScreen(isMobile);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    window.addEventListener('orientationchange', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
      window.removeEventListener('orientationchange', checkScreenSize);
    };
  }, []);

  // Track recent results
  useEffect(() => {
    if (rollResult >= 0) {
      setRecentResults(prev => [rollResult, ...prev].slice(0, 10));
    }
  }, [rollResult]);

  // Handle wheel spin completion
  const handleSpinComplete = () => {
    setWheelSpinning(false);
  };

  // Add a function to toggle sound
  const toggleSound = () => {
    setIsMuted(!isMuted);
  };

  // Create theme using muiStyles
  const theme = createTheme(muiStyles["dark"]);

  // Redux state management
  const dispatch = useDispatch();
  const { userBalance, isLoading: isLoadingBalance } = useSelector((state) => state.balance);

  // Function to fetch real OCT balance
  const fetchRealBalance = useCallback(async () => {
    if (!account?.address) return;

    try {
      // For Ethereum, we can use the userBalance from Redux store
      // or fetch from the blockchain if needed
      const currentBalance = parseFloat(userBalance || '0');
      setRealBalance(currentBalance.toFixed(8));
      console.log("Real balance updated:", currentBalance.toFixed(8));
    } catch (error) {
      console.error("Error fetching real balance:", error);
      // Fallback to Redux balance
      const currentBalance = parseFloat(userBalance || '0');
      setRealBalance(currentBalance.toFixed(8));
    }
  }, [account?.address, userBalance]);

  // Fetch balance when wallet connects
  useEffect(() => {
    if (account?.address) {
      fetchRealBalance();
    }
  }, [account?.address, fetchRealBalance]);

  // insert into events
  const insertEvent = (type, oldVal, newVal, ind = 0) => {
    let newArr = [...events];
    newArr.push({ type: type, oldVal: oldVal, newVal: newVal, ind: ind });
    dispatchEvents({ type: "update", payload: newArr });
  };

  // Update the revertEvent function
  const revertEvent = useCallback((e) => {
    if (events.length > 0) {
      playSound(menuClickRef);
      const lastEvent = events[events.length - 1];

      switch (lastEvent.type) {
        case "red":
          setRed(lastEvent.oldVal);
          break;
        case "black":
          setBlack(lastEvent.oldVal);
          break;
        case "odd":
          setOdd(lastEvent.oldVal);
          break;
        case "even":
          setEven(lastEvent.oldVal);
          break;
        case "over":
          setOver(lastEvent.oldVal);
          break;
        case "under":
          setUnder(lastEvent.oldVal);
          break;
        case "dozens":
          dispatchDozens({ type: "update", ind: lastEvent.ind, val: lastEvent.oldVal });
          break;
        case "columns":
          dispatchColumns({ type: "update", ind: lastEvent.ind, val: lastEvent.oldVal });
          break;
        case "inside":
          dispatchInside({ type: "update", ind: lastEvent.ind, val: lastEvent.oldVal });
          break;
      }

      // Remove the last event from history
      dispatchEvents({ type: "update", payload: events.slice(0, -1) });
    }
  }, [events, playSound, menuClickRef]);

  // --- Bet placement effects ---
  // element refs are registered by bet areas, keyed by `${type}:${ind}`
  const betAreaRefs = useRef(new Map());
  const controlsRef = useRef(null);
  const [betFx, setBetFx] = useState(() => ({
    // key => { pulseId, rippleId, lastAt }
    byKey: {},
    // transient chip flights
    chips: []
  }));

  const registerBetArea = useCallback((key) => (el) => {
    if (!key) return;
    if (!el) {
      betAreaRefs.current.delete(key);
      return;
    }
    betAreaRefs.current.set(key, el);
  }, []);

  const triggerBetPulse = useCallback((key) => {
    if (!key) return;
    const id = `p_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    setBetFx(prev => ({
      ...prev,
      byKey: {
        ...prev.byKey,
        [key]: {
          ...(prev.byKey[key] || {}),
          pulseId: id,
          lastAt: safeNow()
        }
      }
    }));
  }, []);

  const triggerBetRipple = useCallback((key) => {
    if (!key) return;
    const id = `r_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    setBetFx(prev => ({
      ...prev,
      byKey: {
        ...prev.byKey,
        [key]: {
          ...(prev.byKey[key] || {}),
          rippleId: id,
          lastAt: safeNow()
        }
      }
    }));
  }, []);

  const spawnChipFly = useCallback((key, amount) => {
    const fromEl = controlsRef.current;
    const toEl = betAreaRefs.current.get(key);
    if (!fromEl || !toEl) return;

    const from = fromEl.getBoundingClientRect();
    const to = toEl.getBoundingClientRect();

    const chipId = `c_${Math.random().toString(36).slice(2)}_${Date.now()}`;
    const left = from.left + from.width / 2;
    const top = from.top + from.height / 2;
    const dx = (to.left + to.width / 2) - left;
    const dy = (to.top + to.height / 2) - top;

    setBetFx(prev => ({
      ...prev,
      chips: [
        ...prev.chips,
        {
          id: chipId,
          left,
          top,
          dx,
          dy,
          amount,
          createdAt: safeNow()
        }
      ]
    }));

    // Cleanup
    window.setTimeout(() => {
      setBetFx(prev => ({
        ...prev,
        chips: prev.chips.filter(c => c.id !== chipId)
      }));
      // add a small landing ripple
      triggerBetRipple(key);
      triggerBetPulse(key);
    }, 650);
  }, [triggerBetRipple, triggerBetPulse]);

  // Update the placeBet function to accumulate bets
  const placeBet = useCallback((e, type, ind = 0, newVal = bet, revert = false) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // --- Bet FX trigger (doesn't affect logic) ---
    // only for real placement (not revert) and positive amount
    if (!revert && typeof newVal === 'number' && newVal > 0) {
      const key = fxKey(type, ind);
      triggerBetPulse(key);
      // if we have ref anchors, also do a chip fly
      spawnChipFly(key, newVal);
    }

    // Initialize Yellow Network for Roulette
    if (!pythEntropyService.isInitialized) {
      console.log('🔮 PYTH ENTROPY: Initializing Roulette game...');

      pythEntropyService.initialize().then(() => {
        console.log('✅ PYTH ENTROPY: Roulette initialized');
        console.log('🎮 Network:', pythEntropyService.network);
      }).catch(error => {
        console.error('❌ PYTH ENTROPY: Initialization failed:', error);
      });
    }

    // Yellow Network SDK handles randomness - no VRF availability check needed

    if (isNaN(newVal)) {
      return;
    }

    // Play chip sound when placing a bet
    if (!revert && newVal > 0) {
      playSound(chipPlaceRef);
    }

    let oldVal = 0;
    switch (type) {
      case "red":
        oldVal = red;
        const updatedRed = revert ? newVal : red + newVal;
        if (red !== updatedRed) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedRed, ind }] });
          }
          setRed(updatedRed);
        }
        break;
      case "black":
        oldVal = black;
        const updatedBlack = revert ? newVal : black + newVal;
        if (black !== updatedBlack) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedBlack, ind }] });
          }
          setBlack(updatedBlack);
        }
        break;
      case "odd":
        oldVal = odd;
        const updatedOdd = revert ? newVal : odd + newVal;
        if (odd !== updatedOdd) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedOdd, ind }] });
          }
          setOdd(updatedOdd);
        }
        break;
      case "even":
        oldVal = even;
        const updatedEven = revert ? newVal : even + newVal;
        if (even !== updatedEven) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedEven, ind }] });
          }
          setEven(updatedEven);
        }
        break;
      case "over":
        oldVal = over;
        const updatedOver = revert ? newVal : over + newVal;
        if (over !== updatedOver) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedOver, ind }] });
          }
          setOver(updatedOver);
        }
        break;
      case "under":
        oldVal = under;
        const updatedUnder = revert ? newVal : under + newVal;
        if (under !== updatedUnder) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedUnder, ind }] });
          }
          setUnder(updatedUnder);
        }
        break;
      case "dozens":
        oldVal = dozens[ind];
        const updatedDozen = revert ? newVal : dozens[ind] + newVal;
        if (dozens[ind] !== updatedDozen) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedDozen, ind }] });
          }
          dispatchDozens({ type: "update", ind, val: updatedDozen });
        }
        break;
      case "columns":
        oldVal = columns[ind];
        const updatedColumn = revert ? newVal : columns[ind] + newVal;
        if (columns[ind] !== updatedColumn) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedColumn, ind }] });
          }
          dispatchColumns({ type: "update", ind, val: updatedColumn });
        }
        break;
      case "inside":
        oldVal = inside[ind];
        const updatedInside = revert ? newVal : inside[ind] + newVal;
        if (inside[ind] !== updatedInside) {
          if (!revert) {
            dispatchEvents({ type: "update", payload: [...events, { type, oldVal, newVal: updatedInside, ind }] });
          }
          dispatchInside({ type: "update", ind, val: updatedInside });
        }
        break;
    }
  }, [bet, events, red, black, odd, even, over, under, dozens, columns, inside, playSound, chipPlaceRef, triggerBetPulse, spawnChipFly]);

  // reset all the bets
  const reset = useCallback((e) => {
    if (e) e.preventDefault();
    playSound(menuClickRef);
    setRed(0);
    setBlack(0);
    setOdd(0);
    setEven(0);
    setOver(0);
    setUnder(0);
    dispatchDozens({ type: "reset" });
    dispatchColumns({ type: "reset" });
    dispatchInside({ type: "reset" });
    dispatchEvents({ type: "reset" });
    setRollResult(-1);
    setWinnings(-1); // Reset to -1 to indicate no result yet
  }, [playSound, menuClickRef]);

  // updating the bet size
  const handleBetChange = useCallback((e) => {
    setBet(parseFloat(e.target.value));
    playSound(chipSelectRef);
  }, [playSound, chipSelectRef]);

  // Function to close the notification
  const handleCloseNotification = () => {
    setShowNotification(false);
    setNotificationIndex(0);
  };

  const lockBet = async () => {
    // Check if wallet is connected
    if (!isConnected) {
      alert(t('roulette_page.alert_connect_wallet'));
      return;
    }

    if (total <= 0) {
      alert(t('roulette_page.alert_place_bet_first'));
      return;
    }

    // Check Redux balance instead of wallet
    const currentBalance = parseFloat(userBalance || '0'); // Balance is already in OCT
    const totalBetAmount = total;

    if (currentBalance < totalBetAmount) {
      alert(t('roulette_page.alert_insufficient_balance', { balance: currentBalance.toFixed(5), needed: totalBetAmount.toFixed(5) }));
      return;
    }

    setSubmitDisabled(true);
    setNotificationIndex(notificationSteps.PLACING_BET);
    setShowNotification(true);
    setWheelSpinning(true);

    try {
      setError(null);
      console.log('Placing bet with Redux balance:', {
        currentBalance: currentBalance,
        betAmount: totalBetAmount,
        remainingBalance: currentBalance - totalBetAmount
      });

      // Store original balance for calculation
      const originalBalance = parseFloat(userBalance || '0');
      
      // Check if user has enough balance
      if (originalBalance < totalBetAmount) {
        alert(`Insufficient balance. You have ${originalBalance.toFixed(5)} OCT but need ${totalBetAmount.toFixed(5)} OCT`);
        setSubmitDisabled(false);
        setWheelSpinning(false);
        return;
      }
      
      // Deduct bet amount immediately from balance
      const balanceAfterBet = originalBalance - totalBetAmount;
      dispatch(setBalance(balanceAfterBet.toFixed(5)));
      
      console.log("Balance deducted:", {
        originalBalance: originalBalance.toFixed(5),
        betAmount: totalBetAmount.toFixed(5),
        balanceAfterBet: balanceAfterBet.toFixed(5)
      });

      // Convert ALL bets into an array for multiple bet processing
      const allBets = [];

      // Add outside bets
      if (red > 0) {
        allBets.push({ type: BetType.COLOR, value: 0, amount: red, name: t('roulette_page.bet_name_red') }); // Red = 0
      }
      if (black > 0) {
        allBets.push({ type: BetType.COLOR, value: 1, amount: black, name: t('roulette_page.bet_name_black') }); // Black = 1
      }
      if (odd > 0) {
        allBets.push({ type: BetType.ODDEVEN, value: 1, amount: odd, name: t('roulette_page.bet_name_odd') }); // Odd
      }
      if (even > 0) {
        allBets.push({ type: BetType.ODDEVEN, value: 0, amount: even, name: t('roulette_page.bet_name_even') }); // Even
      }
      if (over > 0) {
        allBets.push({ type: BetType.HIGHLOW, value: 1, amount: over, name: t('roulette_page.bet_name_high') }); // High
      }
      if (under > 0) {
        allBets.push({ type: BetType.HIGHLOW, value: 0, amount: under, name: t('roulette_page.bet_name_low') }); // Low
      }

      // Add dozen bets
      dozens.forEach((amount, index) => {
        if (amount > 0) {
          const dozenNames = [t('roulette_page.bet_name_dozen_1'), t('roulette_page.bet_name_dozen_2'), t('roulette_page.bet_name_dozen_3')];
          allBets.push({ type: BetType.DOZEN, value: index, amount, name: dozenNames[index] });
        }
      });

      // Add column bets
      columns.forEach((amount, index) => {
        if (amount > 0) {
          const columnNames = [t('roulette_page.bet_name_column_1'), t('roulette_page.bet_name_column_2'), t('roulette_page.bet_name_column_3')];
          allBets.push({ type: BetType.COLUMN, value: index, amount, name: columnNames[index] });
        }
      });

      // Add inside bets
      inside.forEach((amount, index) => {
        if (amount > 0) {
          // inside array structure: 
          // Index 0: Number 0 (straight bet only)
          // Index 1-4: Number 1 (straight=1, split-left=2, split-bottom=3, corner=4)
          // Index 5-8: Number 2 (straight=5, split-left=6, split-bottom=7, corner=8)
          // Formula: (number-1)*4 + betType for numbers 1-36
          
          let actualNumber, betPosition;
          
          if (index === 0) {
            // Special case for number 0 - only straight bet
            actualNumber = 0;
            betPosition = 1; // straight bet
          } else {
            // For numbers 1-36
            betPosition = ((index - 1) % 4) + 1; // 1=straight, 2=split-left, 3=split-bottom, 4=corner
            actualNumber = Math.floor((index - 1) / 4) + 1; // Numbers 1-36
          }

          // Debug: Check the actual structure
          console.log(`Inside bet structure - index: ${index}, betPosition: ${betPosition}, actualNumber: ${actualNumber}`);

          // Debug: Check if this is a straight bet on a number
          if (betPosition === 1) {
            console.log(`Straight bet detected - index: ${index}, actualNumber: ${actualNumber}, amount: ${amount}`);
          }

          console.log(`Inside bet - index: ${index}, amount: ${amount}, betPosition: ${betPosition}, actualNumber: ${actualNumber}`);

          // FIXED: Use actualNumber instead of numberBase for better accuracy
          if (betPosition === 1) {
            // Straight up bet - actualNumber is the actual number (0-36)
            allBets.push({ type: BetType.NUMBER, value: actualNumber, amount, name: t('roulette_page.bet_name_number', { number: actualNumber }) });
          } else if (betPosition === 2) {
            // Left split bet - predefined split positions
            const splitMap = {
              // Left splits (n, n-3) - including 1,2,3 with 0
              1: "0,1",      // Bottom-left split with 0
              2: "0,2",      // Middle-left split with 0
              3: "0,3",      // Top-left split with 0
              
              4: "1,4",      // Bottom-left split
              7: "4,7",      // Bottom-left split
              10: "7,10",    // Bottom-left split
              13: "10,13",   // Bottom-left split
              16: "13,16",   // Bottom-left split
              19: "16,19",   // Bottom-left split
              22: "19,22",   // Bottom-left split
              25: "22,25",   // Bottom-left split
              28: "25,28",   // Bottom-left split
              31: "28,31",   // Bottom-left split
              34: "31,34",   // Bottom-left split
              
              5: "2,5",      // Middle-left split
              8: "5,8",      // Middle-left split
              11: "8,11",    // Middle-left split
              14: "11,14",   // Middle-left split
              17: "14,17",   // Middle-left split
              20: "17,20",   // Middle-left split
              23: "20,23",   // Middle-left split
              26: "23,26",   // Middle-left split
              29: "26,29",   // Middle-left split
              32: "29,32",   // Middle-left split
              35: "32,35",   // Middle-left split
              
              6: "3,6",      // Top-left split
              9: "6,9",      // Top-left split
              12: "9,12",    // Top-left split
              15: "12,15",   // Top-left split
              18: "15,18",   // Top-left split
              21: "18,21",   // Top-left split
              24: "21,24",   // Top-left split
              27: "24,27",   // Top-left split
              30: "27,30",   // Top-left split
              33: "30,33",   // Top-left split
              36: "33,36"    // Top-left split
            };
            
            const splitNumbers = splitMap[actualNumber];
            if (splitNumbers) {
              // Use the actualNumber (where bet was placed) to get split definition
              allBets.push({ type: BetType.SPLIT, value: splitNumbers, amount, name: t('roulette_page.bet_name_split', { number: actualNumber, splitNumbers: splitNumbers }) });
            }
          } else if (betPosition === 3) {
            // Bottom bet - can be either street bet or bottom split bet
            const isBottomRow = [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(actualNumber);

            if (isBottomRow) {
              // Bottom row: street bet [n, n+1, n+2]
              const streetNumbers = [actualNumber, actualNumber + 1, actualNumber + 2];
              console.log(`🎯 STREET BET DETECTED: ${actualNumber} → [${streetNumbers.join(',')}] - Amount: ${amount}`);
              allBets.push({ type: BetType.STREET, value: streetNumbers.join(','), amount, name: t('roulette_page.bet_name_street', { numbers: streetNumbers.join('-')}) });
            } else {
              // Middle/Top row: bottom split bet - use predefined values
              const bottomSplitMap = {
                2: "1,2",      // Split 2: 1,2
                3: "2,3",      // Split 3: 2,3
                5: "4,5",      // Split 5: 4,5
                6: "5,6",      // Split 6: 5,6
                8: "7,8",      // Split 8: 7,8
                9: "8,9",      // Split 9: 8,9
                11: "10,11",   // Split 11: 10,11
                12: "11,12",   // Split 12: 11,12
                14: "13,14",   // Split 14: 13,14
                15: "14,15",   // Split 15: 14,15
                17: "16,17",   // Split 17: 16,17
                18: "17,18",   // Split 18: 17,18
                20: "19,20",   // Split 20: 19,20
                21: "20,21",   // Split 21: 20,21
                23: "22,23",   // Split 23: 22,23
                24: "23,24",   // Split 24: 23,24
                26: "25,26",   // Split 26: 25,26
                27: "26,27",   // Split 27: 26,27
                29: "28,29",   // Split 29: 28,29
                30: "29,30",   // Split 30: 29,30
                32: "31,32",   // Split 32: 31,32
                33: "32,33",   // Split 33: 32,33
                35: "34,35",   // Split 35: 34,35 - Changed from street to split
                36: "35,36"    // Split 36: 35,36 - Changed from street to split
              };
              
              const splitNumbers = bottomSplitMap[actualNumber];
              if (splitNumbers) {
                allBets.push({ type: BetType.SPLIT, value: splitNumbers, amount, name: t('roulette_page.bet_name_split', { number: actualNumber, splitNumbers: splitNumbers.replace(',', '-') }) });
              } else {
                // Fallback to old calculation if not in map
                const bottomNumber = actualNumber + 3;
                allBets.push({ type: BetType.SPLIT, value: `${actualNumber},${bottomNumber}`, amount, name: t('bet_name_split_simple', { number1: actualNumber, number2: bottomNumber }) });
              }
            }
          } else if (betPosition === 5) {
            // Horizontal split bet - predefined split positions (same row, adjacent numbers)
            const horizontalSplitMap = {
              // Horizontal splits (n, n+1) - same row - FIXED VALUES
              2: "1,2",      // Split 2: 1,2
              3: "2,3",      // Split 3: 2,3
              5: "4,5",      // Split 5: 4,5
              6: "5,6",      // Split 6: 5,6
              8: "7,8",      // Split 8: 7,8
              9: "8,9",      // Split 9: 8,9
              11: "10,11",   // Split 11: 10,11
              12: "11,12",   // Split 12: 11,12
              14: "13,14",   // Split 14: 13,14
              15: "14,15",   // Split 15: 14,15
              17: "16,17",   // Split 17: 16,17
              18: "17,18",   // Split 18: 17,18
              20: "19,20",   // Split 20: 19,20
              21: "20,21",   // Split 21: 20,21
              23: "22,23",   // Split 23: 22,23
              24: "23,24",   // Split 24: 23,24
              26: "25,26",   // Split 26: 25,26
              27: "26,27",   // Split 27: 26,27
              29: "28,29",   // Split 29: 28,29
              30: "29,30",   // Split 30: 29,30
              32: "31,32",   // Split 32: 31,32
              33: "32,33",   // Split 33: 32,33
              35: "34,35",   // Split 35: 34,35
              36: "35,36"    // Split 36: 35,36
            };
            
            const horizontalSplitNumbers = horizontalSplitMap[actualNumber];
            if (horizontalSplitNumbers) {
              // Use the actualNumber (where bet was placed) to get split definition
              allBets.push({ type: BetType.SPLIT, value: horizontalSplitNumbers, amount, name: t('bet_name_split_with_numbers', { number: actualNumber, splitNumbers: horizontalSplitNumbers }) });
            }
          } else if (betPosition === 4) {
            // Corner bet (4 numbers) - predefined corner positions
            // All possible corners in roulette table (22 corners total)
            // FIXED: Correct corner values based on actual roulette table layout
            const cornerMap = {
              2: "0,1,2",      // Middle-left corner
              5: "1,2,4,5",      // Middle-left corner
              8: "4,5,7,8",      // Middle-left corner
              11: "7,8,10,11",  // Middle-left corner - FIXED
              14: "10,11,13,14", // Middle-left corner - FIXED
              17: "13,14,16,17", // Middle-left corner - FIXED
              20: "16,17,19,20", // Middle-left corner
              23: "19,20,22,23", // Middle-left corner - FIXED
              26: "22,23,25,26", // Middle-left corner
              29: "25,26,28,29", // Middle-left corner
              32: "28,29,31,32", // Middle-left corner
              35: "31,32,33,35", // Middle-right corner
              
              3: "2,3,0",      // Top-left corner
              6: "2,3,5,6",      // Top-left corner
              9: "5,6,8,9",     // Top-left corner
              12: "8,9,11,12",  // Top-left corner
              15: "11,12,14,15", // Top-left corner - FIXED
              18: "14,15,17,18", // Top-left corner
              21: "17,18,20,21", // Top-left corner
              24: "20,21,23,24", // Top-left corner
              27: "23,24,26,27", // Top-left corner
              30: "26,27,29,30", // Top-left corner
              33: "29,30,32,33", // Top-left corner
              36: "32,33,35,36"  // Top-right corner
            };

            const cornerNumbers = cornerMap[actualNumber];
            if (cornerNumbers) {
              // Use the actualNumber (where bet was placed) to get corner definition
              allBets.push({ type: BetType.CORNER, value: cornerNumbers, amount, name: t('roulette_page.bet_name_corner', { number: actualNumber, cornerNumbers: cornerNumbers }) });
            }
          }
        }
      });

      console.log("All bets to process:", allBets);
      console.log("Column bets:", columns);
      console.log("Column bet positions:");
      console.log(`  Index 0 (Top "2 To 1"): ${columns[0] > 0 ? `$${columns[0]} bet` : t('no_bet')} → ${t('column_3')} (3,6,9,12,15,18,21,24,27,30,33,36)`);
      console.log(`  Index 1 (Middle "2 To 1"): ${columns[1] > 0 ? `$${columns[1]} bet` : t('no_bet')} → ${t('column_2')} (2,5,8,11,14,17,20,23,26,29,32,35)`);
      console.log(`  Index 2 (Bottom "2 To 1"): ${columns[2] > 0 ? `$${columns[2]} bet` : t('no_bet')} → ${t('column_1')} (1,4,7,10,13,16,19,22,25,28,31,34)`);
      console.log("Inside bets:", inside);



      console.log("Game simulation with multiple bets:", allBets);

      // Simulate the game locally (no blockchain interaction)
      // Reset roll result for the new bet
      setRollResult(-1);

      // Set notification to bet placed
      setNotificationIndex(notificationSteps.BET_PLACED);

      // Simulate wheel spinning and result after delay
      setTimeout(() => {
        // Generate random winning number (0-36)
        const winningNumber = Math.floor(Math.random() * 37);
        setRollResult(winningNumber);

        // Debug: Show which column the winning number belongs to
        if (winningNumber > 0) {
          const columnNumber = winningNumber % 3;
          let columnName = "";
          if (columnNumber === 1) columnName = t("column_1");
          else if (columnNumber === 2) columnName = t("column_2");
          else if (columnNumber === 0) columnName = t("column_3");

          console.log(`🎯 WINNING NUMBER: ${winningNumber}`);
          console.log(`📊 COLUMN INFO: ${winningNumber} % 3 = ${columnNumber} → ${columnName}`);
          console.log(`🔢 COLUMN NUMBERS: ${columnName} contains: ${getColumnNumbers(columnNumber)}`);
        } else {
          console.log(`🎯 WINNING NUMBER: 0 (${t("green_no_column")})`);
        }

        // Process ALL bets and calculate total winnings
        let totalPayout = 0;
        let winningBets = [];
        let losingBets = [];

        allBets.forEach(bet => {
          const isWinner = checkWin(bet.type, bet.value, winningNumber);
          const payoutRatio = getPayoutRatio(bet.type);

          if (isWinner) {
            // payoutRatio = bahsinizi kaç katına çıkarır
            // Örnek: 35:1 = 36x, 1:1 = 2x, 2:1 = 3x
            const betPayout = bet.amount * payoutRatio; // Full payout (includes original bet)
            totalPayout += betPayout;
            winningBets.push({ ...bet, payout: betPayout, multiplier: payoutRatio });
          } else {
            losingBets.push({ ...bet, loss: bet.amount });
          }
        });

        // Calculate net result: Since we already deducted the bet amount, 
        // netResult should be just the winnings (totalPayout includes original bet)
        const netResult = totalPayout > 0 ? totalPayout : 0;
        setWinnings(netResult);
        
        console.log("🎯 WINNINGS CALCULATION:", {
          totalPayout,
          totalBetAmount,
          netResult,
          winningsState: netResult,
          explanation: "totalPayout already includes original bet, so netResult = totalPayout"
        });

        console.log("Bet results:", {
          winningNumber,
          totalBets: allBets.length,
          winningBets: winningBets.length,
          losingBets: losingBets.length,
          totalPayout,
          netResult,
          totalBetAmount
        });

        // Update user balance with final result
        // netResult = totalPayout (includes original bet since we already deducted it)
        // So we just add the total winnings to the balance after bet deduction
        const finalBalance = balanceAfterBet + netResult;
        dispatch(setBalance(finalBalance.toFixed(5)));

        console.log("Balance update:", {
          originalBalance: originalBalance.toFixed(5),
          balanceAfterBet: balanceAfterBet.toFixed(5),
          totalPayout: totalPayout.toFixed(5),
          netResult: netResult.toFixed(5),
          finalBalance: finalBalance.toFixed(5),
          explanation: "netResult = totalPayout (includes original bet), so we add full winnings"
        });

        // Add to betting history
        const newBet = {
          id: Date.now(),
          timestamp: new Date(),
          betType: t('roulette_page.bet_name_multiple', { count: allBets.length }),
          amount: totalBetAmount,
          numbers: [],
          result: winningNumber,
          win: netResult > 0,  // Use netResult to determine if it's a win
          payout: netResult > 0 ? (netResult - totalBetAmount) : -totalBetAmount,   // Net winnings (exclude original bet)
          multiplier: netResult > 0 ? (netResult / totalBetAmount).toFixed(2) : 0,
          totalBets: allBets.length, // Add totalBets field
          winningBets: winningBets.length, // Add winningBets field
          details: {
            winningBets: winningBets.map(bet => `${bet.name}: ${bet.amount} × ${bet.multiplier}x`),
            losingBets: losingBets.map(bet => `${bet.name}: -${bet.amount}`)
          }
        };

        // Generate random number using Pyth Entropy
        pythEntropyService.generateRandom('ROULETTE', {
          purpose: 'roulette_spin',
          gameType: 'ROULETTE'
        }).then(entropyResult => {
          console.log('🔮 PYTH ENTROPY: Roulette randomness generated:', entropyResult);
          
          // Add Pyth Entropy proof info to the bet result
          newBet.entropyProof = {
            requestId: entropyResult.entropyProof.requestId,
            sequenceNumber: entropyResult.entropyProof.sequenceNumber,
            randomValue: entropyResult.randomValue,
            transactionHash: entropyResult.entropyProof.transactionHash,
            monadExplorerUrl: entropyResult.entropyProof.monadExplorerUrl,
            explorerUrl: entropyResult.entropyProof.explorerUrl,
            timestamp: entropyResult.entropyProof.timestamp,
            source: 'Pyth Entropy'
          };
          
          
          // Update betting history with entropy proof
          setBettingHistory(prev => {
            const updatedHistory = [...prev];
            if (updatedHistory.length > 0) {
              updatedHistory[0] = { ...updatedHistory[0], entropyProof: newBet.entropyProof };
            }
            return updatedHistory;
          });
          
          // Fire-and-forget explorer log via casino wallet
          try {
            fetch('/api/casino-session', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                sessionId: entropyResult.entropyProof.requestId || `roulette_${Date.now()}`,
                gameType: 'ROULETTE',
                channelId: entropyResult.entropyProof.requestId || 'entropy_channel',
                valueMon: 0
              })
            })
              .then(async (r) => {
                const t = await r.text().catch(() => '');
                console.log('🎰 Casino session log (Roulette):', r.status, t);
              })
              .catch((e) => console.warn('Casino session log failed (Roulette):', e));
          } catch (e) {
            console.warn('Casino session log threw (Roulette):', e);
          }
          
          // Pyth Entropy handles randomness generation
          console.log('✅ Pyth Entropy randomness processed for Roulette');
          
          // Log to OneChain
          console.log('🔍 ONE CHAIN DEBUG:', { 
            hasLogFunction: !!logRouletteGame, 
            hasAddress: !!address,
            address: address 
          });
          
          if (logRouletteGame && address) {
            // Collect all bet numbers from all bets
            const allBetNumbers = allBets.flatMap(bet => bet.numbers || []);
            
            console.log('🎲 ONE CHAIN: Calling logRouletteGame with params:', {
              betType: newBet.betType,
              winningNumber,
              totalBetAmount,
              allBetNumbers,
              entropyValue: entropyResult.randomValue,
              entropyTxHash: entropyResult.entropyProof.transactionHash
            });
            
            logRouletteGame(
              newBet.betType, // betType (e.g., "Multiple Bets (3)")
              winningNumber, // betValue (winning number)
              totalBetAmount, // amount
              allBetNumbers, // numbers (all numbers from all bets)
              entropyResult.randomValue, // entropyValue
              entropyResult.entropyProof.transactionHash, // entropyTxHash
              { 
                winningNumber, 
                isWin: newBet.win,
                totalBets: allBets.length,
                winningBets: winningBets.length,
                netResult: netResult
              }, // resultData
              totalPayout.toString() // payoutAmount
            ).then((onechainTxHash) => {
              console.log('✅ ONE CHAIN: Roulette game logged successfully');
              console.log('📋 ONE CHAIN Transaction Hash:', onechainTxHash);
              
              // Add OneChain transaction hash to bet history
              newBet.onechainTxHash = onechainTxHash;
              
              // Update betting history with OneChain tx hash
              setBettingHistory(prev => {
                const updatedHistory = [...prev];
                if (updatedHistory.length > 0) {
                  updatedHistory[0] = { ...updatedHistory[0], onechainTxHash };
                }
                return updatedHistory;
              });
            }).catch(error => {
              console.error('❌ ONE CHAIN: Error logging Roulette game:', error);
            });
          }
        }).then(() => {
          console.log('📊 PYTH ENTROPY: Roulette game completed successfully');
        }).catch(error => {
          console.error('❌ PYTH ENTROPY: Error processing Roulette game:', error);
          // Still add the bet result even if Pyth Entropy processing fails
          newBet.entropyProof = null;
        });

        console.log("newBet object created:", {
          win: newBet.win,
          payout: newBet.payout,
          netResult,
          totalPayout,
          totalBetAmount
        });

        setBettingHistory(prev => [newBet, ...prev].slice(0, 50)); // Keep last 50 bets

        console.log("New bet added to history:", newBet); // Debug log
        console.log("Updated bettingHistory:", [newBet, ...bettingHistory].slice(0, 50)); // Debug log

        // Show result notification
        if (netResult > 0) {
          const winMessage = winningBets.length === 1
                    ? t('roulette_page.notification_win_single', { betName: winningBets[0].name, amount: (netResult - totalBetAmount).toFixed(5) })
                    : t('roulette_page.notification_win_multiple', { count: winningBets.length, amount: (netResult - totalBetAmount).toFixed(5) });

          setNotificationMessage(winMessage);
          setNotificationSeverity("success");
          setSnackbarMessage(winMessage);
        } else {
          setNotificationMessage(t('roulette_page.notification_loss', { number: winningNumber, amount: totalBetAmount.toFixed(5) }));
          setNotificationSeverity("error");
          setSnackbarMessage(t('notification_loss_long', { winningNumber: winningNumber, totalBetAmount: totalBetAmount.toFixed(5) }));
        }
        setSnackbarOpen(true);

        // Re-enable betting
        setSubmitDisabled(false);
        setWheelSpinning(false);

      }, 4000); // Wait 4 seconds for wheel animation

    } catch (error) {
      console.error("Error in lockBet:", error);
      setError(error.message || error.toString());
      setShowNotification(false);
      setWheelSpinning(false);
      alert(t('roulette_page.notification_error', { errorMessage: error.message || error.toString() }));

      // No need to refund since we don't deduct balance upfront anymore
    } finally {
      // Don't disable submit here since we removed the blockchain wait
    }
  };

  // Helper function to get bet type name for history
  const getBetTypeName = (betType, betValue) => {
    switch (betType) {
      case BetType.COLOR:
        return betValue === 1 ? t('roulette_page.color_red') : t('roulette_page.color_black');
      case BetType.ODDEVEN:
        return betValue === 1 ? t('roulette_page.bet_name_odd') : t('roulette_page.bet_name_even');
      case BetType.HIGHLOW:
        return betValue === 1 ? t('roulette_page.bet_name_high') : t('roulette_page.bet_name_low');
      case BetType.DOZEN:
        return t('roulette_page.bet_type_name_dozen', { number: betValue + 1 });
      case BetType.COLUMN:
        return t('roulette_page.bet_type_name_column', { number: betValue + 1 });
      case BetType.NUMBER:
        return t('roulette_page.bet_type_name_straight', { number: betValue });
      case BetType.SPLIT:
        return t('roulette_page.bet_type_name_split', { value: betValue });
      case BetType.STREET:
        return t('roulette_page.bet_type_name_street', { value: betValue });
      case BetType.CORNER:
        // For corner bets, betValue is already a string like "7,8,10,11"
        // Convert it to a more readable format like "7-8-10-11"
        if (typeof betValue === 'string' && betValue.includes(',')) {
          const cornerNumbers = betValue.split(',').map(n => n.trim());
          return t('roulette_page.bet_type_name_corner', { value: cornerNumbers.join('-') });
        }
        return t('roulette_page.bet_type_name_corner', { value: betValue });
      default:
        return t('roulette_page.bet_type_name_unknown');
    }
  };

  const handleWithdrawWinnings = useCallback(async (e) => {
    if (e) e.preventDefault();
    playSound(winSoundRef);

    if (!address) {
      console.error("Wallet not connected.");
      alert(t('roulette_page.please_connect_wallet'));
      return;
    }

    try {
      const amount = parseEther(winnings.toString()); // Use winnings as the amount to withdraw

      reset(e); // Reset the state after withdrawing

      // Simulate the contract interaction
      const withdrawSimulation =
        await ViemClient.publicPharosSepoliaClient.simulateContract({
          address: rouletteContractAddress,
          abi: rouletteABI,
          functionName: "withdrawTokens",
          args: [amount],
          account: address,
        });

      // Execute the contract transaction
      const withdrawResponse = await ViemClient.getWalletClient().writeContract(
        withdrawSimulation.request
      );

      if (withdrawResponse) {
        // Extract hash from response if it's an object
        const responseHash = typeof withdrawResponse === 'object' ?
          (withdrawResponse.hash || String(withdrawResponse)) :
          withdrawResponse;

        console.log("Winnings withdrawn successfully:", responseHash);
        alert(t('roulette_page.winnings_withdrawn'));
      } else {
        throw new Error("Withdrawal transaction failed.");
      }
    } catch (error) {
      console.error("Error withdrawing winnings:", error);
      alert(t('roulette_page.failed_to_withdraw', { errorMessage: error.message }));
    }
  }, [playSound, winnings, reset]);

  const config = undefined; // wagmi removed

  const contractAddress = '0xbD8Ca722093d811bF314dDAB8438711a4caB2e73'; // ✅ FIX THIS

  // Remove the custom writeContract function and use the imported one directly
  const waitForTransaction = async (hash) => {
    try {
      // Ensure hash is a string, not an object
      const hashStr = typeof hash === 'object' && hash.hash ? hash.hash : hash;
      const receipt = await waitForTransaction({
        hash: hashStr,
        chainId: 0x138b
      });
      setTransactionReceipt(receipt);
      return receipt;
    } catch (error) {
      console.error("Wait for transaction error:", error);
      throw error;
    }
  };

  // Update the checkNetwork function to focus on correct wallet detection
  const checkNetwork = async () => {
    // Ensure we're running in the browser
    if (typeof window === "undefined") return;

    console.log("Checking network...");

    try {
      // First check if user is connected via wagmi
      if (isConnected && address) {
        console.log("Wallet connected via wagmi:", address);
        setCorrectNetwork(true);
        return;
      }

      // Fall back to window.ethereum check with retry
      const checkWithRetry = async (attempts = 3) => {
        if (window.ethereum && typeof window.ethereum.request === 'function') {
          console.log("Ethereum provider found, requesting chain ID...");
          try {
            const chainId = await window.ethereum.request({ method: "eth_chainId" });
            console.log("Current chain ID:", chainId);

            // Support both Mantle Sepolia (0x138b) and Pharos Devnet (0xc352)
            const isCorrectNetwork = chainId === "0x138b" || chainId === "0xc352";
            console.log("Is correct network:", isCorrectNetwork);
            setCorrectNetwork(isCorrectNetwork);
          } catch (error) {
            console.error("Error checking chain ID:", error);
            if (attempts > 1) {
              console.log(`Retrying... (${attempts - 1} attempts left)`);
              setTimeout(() => checkWithRetry(attempts - 1), 500);
            } else {
              setCorrectNetwork(false);
            }
          }
        } else {
          console.log("Ethereum provider not available or not fully initialized");
          if (attempts > 1) {
            console.log(`Retrying... (${attempts - 1} attempts left)`);
            setTimeout(() => checkWithRetry(attempts - 1), 500);
          } else {
            setCorrectNetwork(false);
          }
        }
      };

      // Start the retry process
      checkWithRetry();
    } catch (error) {
      console.error("Error in checkNetwork:", error);
      setCorrectNetwork(false);
    }
  };

  useEffect(() => {
    // Only check when component mounts or when wallet connection changes
    if (typeof window !== "undefined") {
      console.log("Wallet connection state changed, checking network...");
      console.log("isConnected:", isConnected, "address:", address);

      checkNetwork();

      // Setup event listener if provider exists
      const setupListeners = () => {
        if (window.ethereum && typeof window.ethereum.on === 'function') {
          window.ethereum.on("chainChanged", () => {
            console.log("Chain changed, rechecking network");
            checkNetwork();
          });
          window.ethereum.on("accountsChanged", () => {
            console.log("Accounts changed, rechecking network");
            checkNetwork();
          });

          return () => {
            if (window.ethereum && typeof window.ethereum.removeListener === 'function') {
              window.ethereum.removeListener("chainChanged", checkNetwork);
              window.ethereum.removeListener("accountsChanged", checkNetwork);
            }
          };
        }
      };

      return setupListeners();
    }
  }, [isConnected, address]); // Add dependencies to run when wallet connection changes

  const switchNetwork = async () => {
    // Ensure we're running in the browser
    if (typeof window === "undefined") return;

    try {
      // Check if wallet is connected first
      if (!isConnected) {
        console.log("Wallet not connected, please connect wallet first");
        alert(t('roulette_page.connect_wallet_first_top_right'));
        return;
      }

      // Check if ethereum provider exists
      if (!window.ethereum || typeof window.ethereum.request !== 'function') {
        alert(t('roulette_page.no_eth_wallet_detected'));
        return;
      }

      console.log("Attempting to switch to Mantle Sepolia network");

      try {
        // Try Mantle Sepolia first
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x138b" }],
        });

        console.log("Successfully switched to Mantle Sepolia");
        // Set network to correct and reload after short delay
        setCorrectNetwork(true);
        setTimeout(() => window.location.reload(), 1000);
        return;
      } catch (switchError) {
        console.log("Switch network error:", switchError);

        // If network doesn't exist in wallet (error code 4902), try adding it
        if (switchError.code === 4902) {
          try {
            console.log("Adding Mantle Sepolia to wallet");
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x138b",
                  chainName: "Mantle Sepolia",
                  nativeCurrency: {
                    name: "Mantle",
                    symbol: "MNT",
                    decimals: 18,
                  },
                  rpcUrls: ["https://rpc.sepolia.mantle.xyz"],
                  blockExplorerUrls: ["https://sepolia.mantlescan.xyz"],
                },
              ],
            });

            // Try switching again after adding
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x138b" }],
              });

              console.log("Successfully switched to Mantle Sepolia after adding");
              // Set network to correct and reload after short delay
              setCorrectNetwork(true);
              setTimeout(() => window.location.reload(), 1000);
              return;
            } catch (error) {
              console.error("Error switching to Mantle after adding:", error);
            }
          } catch (addError) {
            console.error("Failed to add Mantle Sepolia:", addError);

            // If Mantle Sepolia fails, try Pharos Devnet as fallback
            try {
              console.log("Adding Pharos Devnet to wallet");
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0xc352",
                    chainName: "Pharos Devnet",
                    nativeCurrency: {
                      name: "Pharos",
                      symbol: "PHR",
                      decimals: 18,
                    },
                    rpcUrls: ["https://devnet.dplabs-internal.com"],
                    blockExplorerUrls: ["https://pharosscan.xyz"],
                  },
                ],
              });

              // Try switching to Pharos
              try {
                await window.ethereum.request({
                  method: "wallet_switchEthereumChain",
                  params: [{ chainId: "0xc352" }],
                });

                console.log("Successfully switched to Pharos Devnet");
                // Set network to correct and reload after short delay
                setCorrectNetwork(true);
                setTimeout(() => window.location.reload(), 1000);
                return;
              } catch (error) {
                console.error("Error switching to Pharos after adding:", error);
              }
            } catch (pharosError) {
              console.error("Failed to add Pharos Devnet:", pharosError);
              alert(t('roulette_page.unable_to_switch_network'));
            }
          }
        } else {
          // Handle other errors
          console.error("Failed to switch network:", switchError);
          alert(t('roulette_page.failed_to_switch_network'));
        }
      }
    } catch (error) {
      console.error("Error in switchNetwork:", error);
      alert(t('roulette_page.error_switching_network'));
    }
  };

  // Calculate total bet
  const total = useMemo(() => {
    let val = red + black + odd + even + over + under;
    val += dozens.reduce((acc, currVal) => {
      return acc + currVal;
    }, 0);
    val += columns.reduce((acc, currVal) => {
      return acc + currVal;
    }, 0);
    val += inside.reduce((acc, currVal) => {
      return acc + currVal;
    }, 0);
    return val;
  }, [red, black, odd, even, over, under, dozens, columns, inside]);

  // Update the clear bet function
  const clearBet = useCallback((e) => {
    if (e) e.preventDefault();
    playSound(menuClickRef);
    setRed(0);
    setBlack(0);
    setOdd(0);
    setEven(0);
    setOver(0);
    setUnder(0);
    dispatchDozens({ type: "reset" });
    dispatchColumns({ type: "reset" });
    dispatchInside({ type: "reset" });
    dispatchEvents({ type: "reset" });
    setWinnings(-1); // Reset winnings when clearing bets
  }, [playSound, menuClickRef]);

  // Removed handlePlaceBet function - now using lockBet with Redux balance

  // Removed placeAptBet function - now using lockBet with Redux balance

  // Helper function to get payout ratio based on bet kind
  // Payout ratio = bahsinizi kaç katına çıkarır (1:1 = 2x, 2:1 = 3x, 35:1 = 36x)
  // Helper function to get column numbers for debugging
  const getColumnNumbers = (columnModulo) => {
    const numbers = [];
    for (let i = 1; i <= 36; i++) {
      if (i % 3 === columnModulo) {
        numbers.push(i);
      }
    }
    return numbers.join(', ');
  };

  const getPayoutRatio = (kind) => {
    switch (kind) {
      case 0: return 36; // Single Number (35:1) 
      case 1: return 2;  // Color (1:1) 
      case 2: return 2;  // Odd/Even (1:1) 
      case 3: return 2;  // High/Low (1:1)
      case 4: return 3;  // Dozen (2:1) 
      case 5: return 3;  // Column (2:1)
      case 6: return 18; // Split Bet (17:1)
      case 7: return 12; // Street Bet (11:1) 
      case 8: return 9;  // Corner Bet (8:1) 
      default: return 0;
    }
  };

  // Helper function to check if a bet is a winner
  const checkWin = (kind, value, winningNumber) => {
    if (winningNumber === 0 && kind !== 0) return false;

    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    switch (kind) {
      case 0: return value === winningNumber; // Single Number
      case 1: return value === 0 ? redNumbers.includes(winningNumber) : !redNumbers.includes(winningNumber); // Color (0=Red, 1=Black)
      case 2: return value === 1 ? winningNumber % 2 !== 0 : winningNumber % 2 === 0; // Odd/Even (0=Even, 1=Odd)
      case 3: return value === 0 ? winningNumber >= 1 && winningNumber <= 18 : winningNumber >= 19 && winningNumber <= 36; // High/Low (0=Low, 1=High)
      case 4: // Dozen bets (0=1st dozen, 1=2nd dozen, 2=3rd dozen)
        return (value === 0 && winningNumber >= 1 && winningNumber <= 12) ||
          (value === 1 && winningNumber >= 13 && winningNumber <= 24) ||
          (value === 2 && winningNumber >= 25 && winningNumber <= 36);
      case 5: // Column bets (0=3rd column, 1=2nd column, 2=1st column) - REVERSED for UI
        return (value === 0 && winningNumber % 3 === 0) ||
          (value === 1 && winningNumber % 3 === 2) ||
          (value === 2 && winningNumber % 3 === 1);
      case 6: // Split bet - check if winning number matches either of two numbers in the split
        // For split bets, value is a string like "1,2" or "1,4"
        const splitNumbers = value.split(',').map(n => parseInt(n));
        return splitNumbers.includes(winningNumber);
      case 7: // Street bet - check if winning number is in the row of 3 numbers
        // For street bets, value is a string like "1,2,3"
        const streetNumbers = value.split(',').map(n => parseInt(n));
        return streetNumbers.includes(winningNumber);
      case 8: // Corner bet - check if winning number is one of 4 corner numbers
        // For corner bets, value is a string like "20,21,23,24"
        const cornerNumbers = value.split(',').map(n => parseInt(n));
        return cornerNumbers.includes(winningNumber);
      default: return false;
    }
  };

  const handleGoAgain = () => {
    console.log("Resetting game for next round...");

    // Reset core game state
    setRollResult(-1);
    setWinnings(-1); // Reset to -1 to indicate no result yet
    setSubmitDisabled(false);

    // Clear all bets from the board
    clearBet();

    // Reset the main bet amount input if you want
    setBet(0.1);
  };

  // Yellow Network SDK - no proof count needed

  return (
    <ThemeProvider theme={theme}>
      <div ref={contentRef} className="font-sans" style={{ 
        background: "linear-gradient(135deg, #000428 0%, #004e92 50%, #000428 100%)",
        minHeight: "100vh", 
        overflowX: 'hidden', 
        paddingTop: "30px",
        position: 'relative'
      }}>
        {/* Animated space background elements */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}>
          {/* Enhanced floating stars with more variety */}
          {[...Array(80)].map((_, i) => {
            const size = Math.random() * 4 + 1;
            const color = Math.random() > 0.7 ? '#87CEEB' : (Math.random() > 0.5 ? '#FFE4B5' : 'white');
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: size + 'px',
                  height: size + 'px',
                  backgroundColor: color,
                  borderRadius: '50%',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  opacity: Math.random() * 0.9 + 0.1,
                  animation: `twinkle ${Math.random() * 5 + 2}s infinite, ${Math.random() > 0.5 ? 'float' : 'drift'} ${Math.random() * 30 + 20}s infinite ease-in-out`,
                  boxShadow: `0 0 ${size * 3}px ${color}`,
                  filter: 'blur(0.5px)'
                }}
              />
            );
          })}
          
          {/* Moving nebula clouds with more complexity */}
          <div style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(0, 150, 255, 0.15) 0%, rgba(138, 43, 226, 0.05) 50%, transparent 70%)',
            borderRadius: '50%',
            left: '5%',
            top: '15%',
            animation: 'float 25s infinite ease-in-out, rotate 60s infinite linear',
            filter: 'blur(45px)',
            mixBlendMode: 'screen'
          }} />
          <div style={{
            position: 'absolute',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(138, 43, 226, 0.12) 0%, rgba(255, 0, 128, 0.05) 50%, transparent 70%)',
            borderRadius: '50%',
            right: '0%',
            top: '55%',
            animation: 'float 30s infinite ease-in-out reverse, rotate 80s infinite linear reverse',
            filter: 'blur(55px)',
            mixBlendMode: 'screen'
          }} />
          <div style={{
            position: 'absolute',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)',
            borderRadius: '50%',
            left: '70%',
            top: '30%',
            animation: 'drift 40s infinite ease-in-out',
            filter: 'blur(35px)',
            mixBlendMode: 'screen'
          }} />
          
          {/* Shooting stars */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              style={{
                position: 'absolute',
                width: '2px',
                height: '80px',
                background: 'linear-gradient(to bottom, transparent, white, transparent)',
                left: Math.random() * 100 + '%',
                top: Math.random() * 50 + '%',
                transform: `rotate(${Math.random() * 60 + 30}deg)`,
                opacity: 0,
                animation: `shootingStar ${Math.random() * 3 + 2}s ${Math.random() * 5}s infinite`,
                filter: 'blur(1px)'
              }}
            />
          ))}
          
          <style jsx>{`
            @keyframes twinkle {
              0% { opacity: 0.2; transform: scale(1); }
              50% { opacity: 1; transform: scale(1.2); }
              100% { opacity: 0.2; transform: scale(1); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              25% { transform: translateY(-20px) translateX(10px); }
              50% { transform: translateY(10px) translateX(-10px); }
              75% { transform: translateY(-10px) translateX(5px); }
            }
            @keyframes chipFloat {
              0%, 100% { transform: translate(-50%, -50%) translateY(0px); }
              50% { transform: translate(-50%, -50%) translateY(-3px); }
            }
            @keyframes chipGlow {
              0% { box-shadow: 0 0 20px rgba(0, 200, 255, 0.6), 0 4px 15px rgba(0, 100, 200, 0.4); }
              100% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 6px 20px rgba(0, 150, 255, 0.6); }
            }
            @keyframes wheelGlow {
              0% { box-shadow: 0 0 30px rgba(0, 200, 255, 0.6), 0 0 60px rgba(0, 150, 255, 0.4); }
              100% { box-shadow: 0 0 50px rgba(0, 255, 255, 1), 0 0 100px rgba(0, 200, 255, 0.6); }
            }
            @keyframes ripple {
              0% { transform: scale(0.8); opacity: 0.8; }
              50% { transform: scale(1.1); opacity: 0.4; }
              100% { transform: scale(1.2); opacity: 0; }
            }
            @keyframes resultAppear {
              0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
              50% { transform: translate(-50%, -50%) scale(1.2); }
              100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            @keyframes resultPulse {
              0%, 100% { opacity: 0.5; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.1); }
            }
            @keyframes drift {
              0%, 100% { transform: translateY(0px) translateX(0px); }
              33% { transform: translateY(-30px) translateX(20px); }
              66% { transform: translateY(20px) translateX(-30px); }
            }
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes shootingStar {
              0% { opacity: 0; transform: translateX(0) translateY(0) rotate(45deg); }
              10% { opacity: 1; }
              20% { opacity: 0; transform: translateX(100px) translateY(100px) rotate(45deg); }
              100% { opacity: 0; }
            }
            @keyframes winnerPulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
            @keyframes winnerGlow {
              0% { box-shadow: 0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 150, 255, 0.5); }
              100% { box-shadow: 0 0 50px rgba(0, 255, 255, 1), 0 0 100px rgba(0, 150, 255, 0.7); }
            }
            @keyframes winnerRipple {
              0% { opacity: 0.6; transform: scale(0.9); }
              50% { opacity: 0.3; transform: scale(1.1); }
              100% { opacity: 0.6; transform: scale(0.9); }
            }
            @keyframes winnerRotate {
              0% { transform: rotate(0deg) scale(1.1); }
              100% { transform: rotate(360deg) scale(1.1); }
            }
            @keyframes chipFly {
              0% {
                transform: translate(-50%, -50%) translate3d(0, 0, 0) scale(1);
                opacity: 0.95;
                filter: blur(0px);
              }
              70% {
                transform: translate(-50%, -50%) translate3d(calc(var(--dx) * 0.92), calc(var(--dy) * 0.92), 0) scale(1.15);
                opacity: 1;
                filter: blur(0px);
              }
              100% {
                transform: translate(-50%, -50%) translate3d(var(--dx), var(--dy), 0) scale(0.9);
                opacity: 0;
                filter: blur(1px);
              }
            }
          `}</style>
        </div>
        {/* Audio elements */}
        <audio ref={spinSoundRef} src="/sounds/ball-spin.mp3" preload="auto" />
        <audio ref={winSoundRef} src="/sounds/win-chips.mp3" preload="auto" />
        <audio ref={chipSelectRef} src="/sounds/chip-select.mp3" preload="auto" />
        <audio ref={chipPlaceRef} src="/sounds/chip-put.mp3" preload="auto" />
        <audio ref={menuClickRef} src="/sounds/menu.mp3" preload="auto" />
        <audio ref={backgroundMusicRef} src="/sounds/background-music.mp3" preload="auto" loop />
        <audio ref={ambientSoundsRef} src="/sounds/ambient-sounds.mp3" preload="auto" loop />

        {/* Page Header */}
        <RouletteHeader />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            pt: { xs: 0, md: 1 },
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: "100vw",
            px: 0, // Remove any padding
          }}
        >

          {/* Chip fly overlay */}
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 10000
            }}
          >
            {betFx.chips.map((chip) => (
              <Box
                key={chip.id}
                sx={{
                  position: 'absolute',
                  left: chip.left,
                  top: chip.top,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, rgba(34,211,238,0.9) 35%, rgba(37,99,235,0.9) 100%)',
                  boxShadow: '0 0 14px rgba(34,211,238,0.8), 0 0 30px rgba(37,99,235,0.35)',
                  animation: 'chipFly 650ms cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards',
                  '--dx': `${chip.dx}px`,
                  '--dy': `${chip.dy}px`,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: '1px solid rgba(34,211,238,0.25)'
                  }
                }}
                title={typeof chip.amount === 'number' ? `${chip.amount}` : ''}
              />
            ))}
          </Box>

          {/* Balance Display */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              py: 1,
              mt: 1,
              mb: 2,
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              gap: 1,
              maxWidth: '98%',
              mx: 'auto'
            }}
          >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <FaCoins className="text-yellow-400" />
                {t('roulette_page.balance_label')} {isConnected ? t('roulette_page.balance_value', { balance: parseFloat(userBalance || '0').toFixed(5) }) : t('roulette_page.balance_connect_wallet')}
              </Typography>
          </Box>

          {/* Recent Results Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflowX: 'auto',
              py: 0.75,
              mt: 1,
              mb: 2,
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '8px',
              gap: 1,
              maxWidth: '98%', // Increased from 90% to 98%
              mx: 'auto'
            }}
          >
            <Typography
              variant="body2"
              sx={{
                mr: 1.5,
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '20px',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              {t('roulette_page.recent_results')}
            </Typography>
            {recentResults.length === 0 ? (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '20px',
                  opacity: 0.8
                }}
              >
                {t('roulette_page.no_results_yet')}
              </Typography>
            ) : (
              recentResults.map((num, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    backgroundColor: num === 0 ? '#14D854' :
                      [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num) ? '#d82633' : '#000',
                    border: '1px solid rgba(255,255,255,0.2)',
                    position: 'relative',
                    animation: idx === 0 ? 'resultAppear 0.5s ease-out' : 'none',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      borderRadius: '50%',
                      border: num === 0 ? '1px solid rgba(20, 216, 84, 0.6)' :
                        [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(num) ? '1px solid rgba(216, 38, 51, 0.6)' : '1px solid rgba(0, 0, 0, 0.6)',
                      animation: idx === 0 ? 'resultPulse 1s ease-in-out infinite' : 'none',
                      opacity: idx === 0 ? 0.8 : 0
                    }
                  }}
                >
                  {num}
                </Box>
              ))
            )}
          </Box>

          {/* Mobile Landscape Overlay */}
          {isPortrait && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.95)',
                zIndex: 999999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
                textAlign: 'center',
                padding: '20px',
                // Ensure overlay is on top of everything
                '& *': {
                  zIndex: 'inherit !important'
                }
              }}
            >
              <Box sx={{ fontSize: '48px', marginBottom: '20px' }}>📱 ↻</Box>
              <Typography variant="h4" sx={{ marginBottom: '16px', fontWeight: 'bold' }}>
                {t('roulette_page.rotate_device_title')}
              </Typography>
              <Typography variant="h6" sx={{ marginBottom: '12px' }}>
                {t('roulette_page.rotate_device_subtitle')}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '300px' }}>
                {t('roulette_page.rotate_device_description')}
              </Typography>

              {/* Desktop Site Mode Instructions */}
              <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: '300px', mt: 2, color: '#FFD700' }}>
                {t('roulette_page.desktop_mode_suggestion')}
              </Typography>

              <Box sx={{
                mt: 3,
                p: 2,
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }}>
                <Typography variant="body2">
                  {t('roulette_page.autorotate_tip')}
                </Typography>
              </Box>
            </Box>
          )}

          {/* Responsive Grid Layout */}
          <Box
            sx={{
              width: '100%',
              maxWidth: '100vw', // Full viewport width
              // Hide content when portrait overlay is shown
              display: isPortrait ? 'none' : 'block',
              ...(isSmallScreen && !isPortrait && {
                overflowX: 'auto',
                overflowY: 'hidden',
                pb: 2,
                '&::-webkit-scrollbar': {
                  height: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.5)',
                  },
                },
              })
            }}
          >
            <Grid
              container
              sx={{
                mt: { xs: 1.5, md: 4 },
                mx: { xs: 2, sm: 4, md: 6 }, // Increased margins for better spacing
                px: { xs: 1, sm: 2 }, // Added padding back
                minWidth: isSmallScreen && !isPortrait ? '700px' : 'auto',
                width: 'auto', // Auto width instead of 100%
                ...(isSmallScreen && !isPortrait && {
                  transform: 'scale(0.85)',
                  transformOrigin: 'top center',
                  width: '120%',
                  mx: '-10%',
                })
              }}
              columns={isSmallScreen ? 7 : 14} // Back to 14 columns
            >
              <Grid md={1}>
                <GridZero inside={inside} placeBet={placeBet} />
              </Grid>
              <Grid md={4} container columns={12}>
                {firstThird.map((val, ind) => (
                  <Grid md={3} key={`first-third-${val.val}`}>
                    <GridInside
                      insideNumber={val.val}
                      red={val?.red}
                      topEdge={ind < 4}
                      placeBet={placeBet}
                      straightup={inside[(val.val - 1) * 4 + 1]}
                      splitleft={inside[(val.val - 1) * 4 + 2]}
                      splitbottom={inside[(val.val - 1) * 4 + 3]}
                      corner={inside[(val.val - 1) * 4 + 4]}
                      isWinner={rollResult === val.val}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid md={4} container columns={12}>
                {secondThird.map((val, ind) => (
                  <Grid md={3} key={`second-third-${val.val}`}>
                    <GridInside
                      insideNumber={val.val}
                      red={val?.red}
                      topEdge={ind < 4}
                      placeBet={placeBet}
                      straightup={inside[(val.val - 1) * 4 + 1]}
                      splitleft={inside[(val.val - 1) * 4 + 2]}
                      splitbottom={inside[(val.val - 1) * 4 + 3]}
                      corner={inside[(val.val - 1) * 4 + 4]}
                      isWinner={rollResult === val.val}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid md={4} container columns={12}>
                {thirdThird.map((val, ind) => (
                  <Grid md={3} key={`third-third-${val.val}`}>
                    <GridInside
                      insideNumber={val.val}
                      red={val?.red}
                      topEdge={ind < 4}
                      placeBet={placeBet}
                      straightup={inside[(val.val - 1) * 4 + 1]}
                      splitleft={inside[(val.val - 1) * 4 + 2]}
                      splitbottom={inside[(val.val - 1) * 4 + 3]}
                      corner={inside[(val.val - 1) * 4 + 4]}
                      isWinner={rollResult === val.val}
                    />
                  </Grid>
                ))}
              </Grid>
              <Grid md={1} sx={{ display: "flex", alignItems: "stretch" }}>
                <Box
                  sx={{ display: "flex", flexDirection: "column", width: "100%" }}
                >
                  <GridColumnBet
                    topCard={true}
                    columns={columns}
                    index={0}
                    bet={bet}
                    placeBet={placeBet}
                  />
                  <GridColumnBet
                    columns={columns}
                    index={1}
                    bet={bet}
                    placeBet={placeBet}
                  />
                  <GridColumnBet
                    bottomCard={true}
                    columns={columns}
                    index={2}
                    bet={bet}
                    placeBet={placeBet}
                  />
                </Box>
              </Grid>

              <Grid md={1} />
              <Grid md={4}>
                <GridOutsideBet onClick={(e) => placeBet(e, "dozens", 0)}>
                  <Typography variant="h5">{t('roulette_page.bet_1st_12')}</Typography>
                  {dozens[0] > 0 && (
                    <BetBox
                      betValue={dozens[0]}
                      betType={t("bet_type_1st_12")}
                      onClick={(e) => placeBet(e, "dozens", 0)}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={4}>
                <GridOutsideBet onClick={(e) => placeBet(e, "dozens", 1)}>
                  <Typography variant="h5">{t('roulette_page.bet_2nd_12')}</Typography>
                  {dozens[1] > 0 && (
                    <BetBox
                      betValue={dozens[1]}
                      betType={t("bet_type_2nd_12")}
                      onClick={(e) => placeBet(e, "dozens", 1)}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={4}>
                <GridOutsideBet
                  rightCard={true}
                  onClick={(e) => placeBet(e, "dozens", 2)}
                >
                  <Typography variant="h5">{t('roulette_page.bet_3rd_12')}</Typography>
                  {dozens[2] > 0 && (
                    <BetBox
                      betValue={dozens[2]}
                      betType={t("bet_type_3rd_12")}
                      onClick={(e) => placeBet(e, "dozens", 2)}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid
                md={1}
                sx={{
                  borderLeft: (theme) => `10px solid ${theme.palette.dark.card}`,
                }}
              />

              <Grid md={1} />
              <Grid md={2}>
                <GridOutsideBet onClick={(e) => placeBet(e, "under")}>
                  <Typography variant="h5">{t('roulette_page.bet_1_to_18')}</Typography>
                  {under > 0 && (
                    <BetBox
                      betValue={under}
                      betType={t("bet_type_under")}
                      onClick={(e) => placeBet(e, "under")}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={2}>
                <GridOutsideBet onClick={(e) => placeBet(e, "even")}>
                  <Typography variant="h5">{t('roulette_page.bet_even')}</Typography>
                  {even > 0 && (
                    <BetBox
                      betValue={even}
                      betType={t("bet_type_even")}
                      onClick={(e) => placeBet(e, "even")}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={2}>
                <GridOutsideBet betType="red" onClick={(e) => placeBet(e, "red")}>
                  {red > 0 && (
                    <BetBox
                      betValue={red}
                      betType={t('roulette_page.bet_red')}
                      onClick={(e) => placeBet(e, "red")}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={2}>
                <GridOutsideBet betType="black" onClick={(e) => placeBet(e, "black")}>
                  {black > 0 && (
                    <BetBox
                      betValue={black}
                      betType={t('roulette_page.bet_black')}
                      onClick={(e) => placeBet(e, "black")}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={2}>
                <GridOutsideBet onClick={(e) => placeBet(e, "odd")}>
                  <Typography variant="h5">{t('roulette_page.bet_odd')}</Typography>
                  {odd > 0 && (
                    <BetBox
                      betValue={odd}
                      betType={t("bet_type_odd")}
                      onClick={(e) => placeBet(e, "odd")}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid md={2}>
                <GridOutsideBet
                  rightCard={true}
                  onClick={(e) => placeBet(e, "over")}
                >
                  <Typography variant="h5">{t('roulette_page.bet_19_to_36')}</Typography>
                  {over > 0 && (
                    <BetBox
                      betValue={over}
                      betType={t("bet_type_over")}
                      onClick={(e) => placeBet(e, "over")}
                    />
                  )}
                </GridOutsideBet>
              </Grid>
              <Grid
                md={1}
                sx={{
                  borderLeft: (theme) => `10px solid ${theme.palette.dark.card}`,
                }}
              />
            </Grid>
          </Box>



          <Box
            sx={{
              mt: 2,
              display: isPortrait ? 'none' : 'flex', // Hide when portrait
              flexDirection: { xs: isSmallScreen && !isPortrait ? 'row' : 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              justifyContent: "center",
              mb: 5,
              gap: isSmallScreen && !isPortrait ? 2 : 4,
              ...(isSmallScreen && !isPortrait && {
                flexWrap: 'wrap',
                px: 2,
              })
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                mb: { xs: isSmallScreen && !isPortrait ? 1 : 3, md: 0 },
                alignItems: isSmallScreen && !isPortrait ? 'center' : 'flex-start'
              }}
            >
              <Typography
                variant={isSmallScreen && !isPortrait ? "h4" : "h3"}
                color="text.accent"
                sx={{ mb: isSmallScreen && !isPortrait ? 1 : 0 }}
              >
                {t('roulette_page.roulette_title')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <TooltipWide title={<Typography>{rouletteTutorial}</Typography>}>
                  <Box
                    sx={{ display: "flex", alignItems: "center", cursor: 'pointer' }}
                    color="text.secondary"
                    onClick={() => setShowHelp(!showHelp)}
                  >
                    <Typography variant="h6">{t('roulette_page.tutorial')}</Typography>
                    <InfoIcon sx={{ ml: 1 }} />
                  </Box>
                </TooltipWide>
                <TooltipWide
                  title={
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      {rouletteOdds.map((v, ind) => (
                        <Typography key={`tutorial-odds-${ind}`}>{v}</Typography>
                      ))}
                    </Box>
                  }
                >
                  <Box
                    sx={{ display: "flex", alignItems: "center", cursor: 'pointer' }}
                    color="text.secondary"
                  >
                    <Typography variant="h6">{t('roulette_page.odds')}</Typography>
                    <InfoIcon sx={{ ml: 1 }} />
                  </Box>
                </TooltipWide>
              </Box>

              {/* Animated Roulette Wheel */}
              <RouletteWheel
                spinning={wheelSpinning}
                result={rollResult}
                onSpinComplete={handleSpinComplete}
                onSpinStart={() => playSound(spinSoundRef)}
                onWin={() => playSound(winSoundRef)}
                isSmallScreen={isSmallScreen}
                isPortrait={isPortrait}
              />
            </Box>

            {/* Yellow Network Status */}
            <Box sx={{
              display: "flex",
              flexDirection: "column",
              width: { xs: isSmallScreen && !isPortrait ? 'auto' : '100%', md: 'auto' },
              maxWidth: { xs: isSmallScreen && !isPortrait ? '300px' : '400px', md: 'none' },
              minWidth: isSmallScreen && !isPortrait ? '250px' : 'auto',
              mb: 2,
              p: 2,
              background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)',
              border: '1px solid rgba(255, 193, 7, 0.3)',
              borderRadius: '12px'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Shield size={16} style={{ color: '#FFC107' }} />
                <Typography variant="subtitle2" sx={{ color: '#FFC107', fontWeight: 'bold' }}>
                  {t('roulette_page.pyth_entropy')}
                </Typography>
              </Box>
              
              {!isConnected ? (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Button
                    onClick={() => {
                      if (window.ethereum) {
                        window.ethereum.request({ method: 'eth_requestAccounts' });
                      }
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
                      color: 'white',
                      px: 2,
                      py: 1,
                      fontSize: '0.8rem',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFB300 0%, #F57C00 100%)',
                      }
                    }}
                  >
                    {t('roulette_page.connect_wallet_button')}
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="h6" sx={{ 
                    color: '#10B981',
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    {t('pyth_entropy_title')}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.8rem',
                    textAlign: 'center',
                    mt: 1
                  }}>
                    {t('roulette_page.on_chain_randomness')}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Betting Controls */}
            <Box
              ref={controlsRef}
              sx={{
                display: "flex",
                flexDirection: "column",
                width: { xs: isSmallScreen && !isPortrait ? 'auto' : '100%', md: 'auto' },
                maxWidth: { xs: isSmallScreen && !isPortrait ? '300px' : '400px', md: 'none' },
                minWidth: isSmallScreen && !isPortrait ? '250px' : 'auto',
              }}
            >
              <TextFieldCurrency
                label={t('roulette_page.bet_amount')}
                variant="standard"
                value={bet}
                handleChange={handleBetChange}
                step="0.001"
                min="0.001"
              />

              <Typography color="white" sx={{ opacity: 0.8 }}>
                {t('roulette_page.current_bet_total', { total: total.toFixed(5) })}
              </Typography>

              {/* Quick Bet Buttons */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {[0.001, 0.01, 0.1, 1, 2, 5].map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setBet(amount)}
                    sx={{
                      minWidth: '50px',
                      height: '35px',
                      py: 0,
                      backgroundColor: bet === amount ? '#10B981' : 'rgba(255,255,255,0.1)', // Seçili için yeşil
                      color: bet === amount ? 'white' : 'white', // Her iki durumda da beyaz yazı
                      fontSize: '0.9rem',
                      fontWeight: bet === amount ? 'bold' : 'normal', // Seçili için kalın yazı
                      border: bet === amount ? '2px solid #34D399' : '1px solid rgba(255,255,255,0.2)', // Seçili için yeşil border
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: bet === amount ? '#059669' : 'rgba(255,255,255,0.2)',
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }
                    }}
                  >
                    {amount}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                ml: { xs: 0, md: 3 },
                mt: { xs: 0, md: 1 },
              }}
            >
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title={<Typography>{t('roulette_page.undo_last_bet')}</Typography>}>
                  <span>
                    <IconButton
                      disabled={events.length === 0 || submitDisabled}
                      onClick={revertEvent}
                    >
                      <UndoIcon />
                    </IconButton>
                  </span>
                </Tooltip>
                <Tooltip title={<Typography>{t('roulette_page.clear_bet')}</Typography>}>
                  <span>
                    <IconButton
                      disabled={submitDisabled}
                      onClick={clearBet}
                    >
                      <ClearIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>

              <Box sx={{ mt: 3 }}>
                {rollResult >= 0 ? (
                  <Box>
                    <Button onClick={handleGoAgain}>{t('roulette_page.go_again')}</Button>
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <Typography variant="h5">
                        {t('roulette_page.result_label')} <span style={{
                          color: rollResult === 0 ? '#14D854' :
                            [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36].includes(rollResult) ? '#d82633' : 'white'
                        }}>{rollResult}</span>
                      </Typography>

                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Button
                      disabled={total === 0 || submitDisabled}
                      loading={submitDisabled}
                      onClick={lockBet}
                    >
                      {total > 0 ? t('roulette_page.place_bet_total', { total: total.toFixed(5) }) : t('roulette_page.place_bet_oct')}
                    </Button>
                    {submitDisabled && rollResult < 0 && (
                      <Typography color="white" sx={{ opacity: 0.8 }}>
                        {t('roulette_page.rolling_die')}
                      </Typography>
                    )}
                    {total > 0 && !submitDisabled && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                        {(() => {
                          const activeBetCount = [red, black, odd, even, over, under].filter(x => x > 0).length +
                            dozens.filter(x => x > 0).length +
                            columns.filter(x => x > 0).length +
                            inside.filter(x => x > 0).length;
                          return activeBetCount > 1
                            ? t('roulette_page.bets_selected', { count: activeBetCount })
                            : t('roulette_page.one_bet_selected');
                        })()}
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>

            {/* Stats Only */}
            <Box sx={{ width: { xs: '100%', md: '300px' }, mt: { xs: 4, md: 0 } }}>
              <Typography variant="h6" color="white" sx={{ mb: 2, fontWeight: 'bold' }}>
                {t('roulette_page.stats')}
              </Typography>
              <Box sx={{
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: 2,
                p: 2,
                minHeight: 300,
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <BettingStats history={bettingHistory} t={t} />
              </Box>
            </Box>
          </Box>
        </Box>


        {/* Help Modal for Mobile */}
        {showHelp && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2
            }}
            onClick={() => setShowHelp(false)}
          >
            <Box
              sx={{
                backgroundColor: 'bg.light',
                p: 3,
                borderRadius: 2,
                maxWidth: 600,
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Typography variant="h5" sx={{ mb: 2 }}>{t('roulette_page.how_to_play_roulette')}</Typography>
              <Typography paragraph>{rouletteTutorial}</Typography>
              <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>{t('roulette_page.payout_odds')}</Typography>
              {rouletteOdds.map((odd, index) => (
                <Typography key={index} paragraph>
                  {odd}
                </Typography>
              ))}
              <Button
                onClick={() => setShowHelp(false)}
                sx={{ mt: 2 }}
              >
                {t('roulette_page.close')}
              </Button>
            </Box>
          </Box>
        )}

        {/* New enhanced sections */}
        <Box sx={{
          mt: 8,
          px: { xs: 2, md: 8 },
          mx: 'auto',
          maxWidth: '1600px',
          display: isPortrait ? 'none' : 'block' // Hide when portrait
        }}>
          {/* Section Header */}
          <Typography
            variant="h4"
            sx={{
              mb: 5,
              textAlign: 'center',
              fontWeight: 'bold',
              background: 'linear-gradient(90deg, #d82633, #681DDB)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '1px',
              textShadow: '0 4px 8px rgba(0,0,0,0.5)'
            }}
          >
            {t('roulette_page.master_european_roulette')}
          </Typography>

          {/* Video and Description Section */}
          <Grid container spacing={4} sx={{ mb: 7 }}>
            {/* Video on left */}
            <Grid xs={12} md={6}>
              
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  paddingTop: { xs: '56.25%', md: '56.25%' },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                  border: '2px solid rgba(104, 29, 219, 0.4)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)',
                    border: '2px solid rgba(216, 38, 51, 0.5)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '-3px',
                    left: '-3px',
                    right: '-3px',
                    bottom: '-3px',
                    borderRadius: '20px',
                    background: 'linear-gradient(45deg, #d82633, #681DDB, #14D854, #d82633)',
                    backgroundSize: '400% 400%',
                    zIndex: -1,
                    filter: 'blur(10px)',
                    opacity: 0.7,
                    animation: 'gradient 15s ease infinite',
                    '@keyframes gradient': {
                      '0%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                      '100%': { backgroundPosition: '0% 50%' }
                    }
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    py: 1.5,
                    background: 'linear-gradient(to bottom, rgba(9, 0, 5, 0.8), rgba(9, 0, 5, 0))',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2
                  }}
                >
                </Box>
                <iframe
                  src={`https://www.youtube.com/embed/${gameData.youtube}?si=${gameData.youtube}`}
                  title={t('roulette_page.youtube_tutorial_title', { title: gameData.title })}
                  style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '12px',
                    zIndex: 1
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            </Grid>

            {/* Description on right */}
            <Grid xs={12} md={6}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, rgba(9, 0, 5, 0.6) 0%, rgba(9, 0, 5, 0.3) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  p: { xs: 2.5, md: 3 },
                  minHeight: '280px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  border: '1px solid rgba(104, 29, 219, 0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '5px',
                    height: '100%',
                    background: 'linear-gradient(to bottom, #d82633, #681DDB)',
                  }
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 'bold',
                    background: 'linear-gradient(90deg, #FFFFFF, #FFA500)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    display: 'inline-block'
                  }}
                >
                  {t('roulette_page.european_roulette')}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 2.5,
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.92)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {t('roulette_page.european_roulette_description_1')}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    mb: 1,
                    lineHeight: 1.8,
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.92)',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                  }}
                >
                  {t('roulette_page.european_roulette_description_2')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* First row - Strategy Guide and Win Probabilities (most important for players) */}
          <Grid container spacing={4} sx={{ mb: 6, pt: 4 }}>
            <Grid xs={12} md={7}>
              <div id="strategy" className="scroll-mt-16">
                <StrategyGuide />
              </div>
            </Grid>
            <Grid xs={12} md={5}>
              <WinProbabilities />
            </Grid>
          </Grid>

          {/* Second row - Roulette Payout (full width for clarity) */}
          <Grid container spacing={4} sx={{ mb: 6, pt: 4 }}>
            <Grid xs={12}>
              <div id="payouts" className="scroll-mt-16">
                <RoulettePayout />
              </div>
            </Grid>
          </Grid>

          {/* Third row - Roulette History and Leaderboard */}
          <Grid container spacing={4} sx={{ mb: 6, pt: 4 }}>
            <Grid xs={12} md={12}>
              <div id="history" className="scroll-mt-16">
                <RouletteHistory bettingHistory={bettingHistory} />
              </div>
            </Grid>
          </Grid>

          {/* Decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '400px',
              left: '-50px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(104, 29, 219, 0.4) 0%, rgba(104, 29, 219, 0) 70%)',
              filter: 'blur(50px)',
              zIndex: -1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '800px',
              right: '-100px',
              width: '350px',
              height: '350px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(216, 38, 51, 0.3) 0%, rgba(216, 38, 51, 0) 70%)',
              filter: 'blur(70px)',
              zIndex: -1,
            }}
          />
        </Box>

        <Snackbar
          open={showNotification}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          sx={{ zIndex: 10001 }}
        >
          <MuiAlert
            onClose={handleCloseNotification}
            severity={notificationIndex === notificationSteps.RESULT_READY ? (winnings > 0 ? "success" : "error") : "info"}
            elevation={6}
            variant="filled"
            sx={{ width: '100%', backgroundColor: 'background.paper', color: 'text.primary' }}
          >
            {notificationMessage}
            {notificationIndex === notificationSteps.RESULT_READY && (
              <Typography>
                {winnings > 0
                  ? t('roulette_page.notification_win', { amount: winnings.toFixed(4) })
                  : winnings < 0
                  ? t('roulette_page.notification_lose', { amount: Math.abs(winnings).toFixed(4) })
                  : t('roulette_page.notification_break_even')}
              </Typography>
            )}
          </MuiAlert>
        </Snackbar>

        {/* Sound control button - fix IconButton nesting */}
        <Box sx={{ position: 'fixed', top: 15, right: 15, zIndex: 100 }}>
          <IconButton
            onClick={toggleSound}
            sx={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
            }}
            aria-label={isMuted ? t('roulette_page.unmute_sound') : t('roulette_page.mute_sound')}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </IconButton>
        </Box>

        {/* Snackbar for lightweight messages (snackbarOpen) */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MuiAlert
            onClose={() => setSnackbarOpen(false)}
            severity="info"
            elevation={6}
            variant="filled"
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>

        {/* Pyth Entropy handles randomness generation */}

      </div>
    </ThemeProvider>
  );
}