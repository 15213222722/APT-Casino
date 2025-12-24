"use client";
import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, CircularProgress, Fade } from '@mui/material';
import { FaHistory, FaChartLine, FaFire, FaExclamationCircle, FaCoins, FaInfoCircle, FaTrophy, FaDice, FaExternalLinkAlt } from 'react-icons/fa';
import oneChainClientService from '../../../../services/OneChainClientService.js';

// Utility function to format OCT amounts with proper decimal precision
const formatMONAmount = (amount) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  // Round to 6 decimal places to avoid floating point precision issues
  return parseFloat(amount.toFixed(6));
};



// Function to calculate statistics from bet history
const calculateStats = (bets) => {
  const totalBets = bets.length;
  const totalWagered = bets.reduce((sum, bet) => sum + bet.amount, 0);
  const totalWon = bets.reduce((sum, bet) => sum + bet.payout, 0);
  const winCount = bets.filter(bet => bet.win).length;
  const winRate = totalBets > 0 ? (winCount / totalBets) * 100 : 0;
  const netProfit = totalWon - totalWagered;
  const roi = totalWagered > 0 ? (netProfit / totalWagered) * 100 : 0;

  // Get most common results
  const resultCounts = {};
  bets.forEach(bet => {
    resultCounts[bet.result] = (resultCounts[bet.result] || 0) + 1;
  });

  const mostCommonResults = Object.entries(resultCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([number, count]) => ({
      number: parseInt(number),
      count: count
    }));

  // Find biggest win
  const biggestWin = bets.reduce((max, bet) => bet.payout > max.payout ? bet : max, { payout: 0 });

  return {
    totalBets,
    totalWagered,
    totalWon,
    winRate,
    netProfit,
    roi,
    mostCommonResults,
    biggestWin: biggestWin.payout > 0 ? biggestWin : null
  };
};

const RouletteHistory = ({ bettingHistory = [] }) => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bets, setBets] = useState([]);

  // Update bets when bettingHistory prop changes
  React.useEffect(() => {
    if (bettingHistory && bettingHistory.length > 0) {
      setBets(bettingHistory);
    }
  }, [bettingHistory]);

  const stats = calculateStats(bets);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const formatTime = (timeString) => {
    let date;
    if (timeString instanceof Date) {
      date = timeString;
    } else if (typeof timeString === 'string') {
      // Check if it's a timestamp string (numeric) or ISO string
      if (/^\d+$/.test(timeString)) {
        // It's a numeric timestamp string, convert to number first
        date = new Date(parseInt(timeString));
      } else {
        // It's an ISO date string
        date = new Date(timeString);
      }
    } else if (typeof timeString === 'number') {
      date = new Date(timeString);
    } else {
      return '--:--';
    }
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '--:--';
    }
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timeString) => {
    let date;
    if (timeString instanceof Date) {
      date = timeString;
    } else if (typeof timeString === 'string') {
      // Check if it's a timestamp string (numeric) or ISO string
      if (/^\d+$/.test(timeString)) {
        // It's a numeric timestamp string, convert to number first
        date = new Date(parseInt(timeString));
      } else {
        // It's an ISO date string
        date = new Date(timeString);
      }
    } else if (typeof timeString === 'number') {
      date = new Date(timeString);
    } else {
      return '--';
    }
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return '--';
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Determine color based on roulette number
  const getNumberColor = (num) => {
    if (num === 0) return '#14D854'; // Green for zero
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
    return redNumbers.includes(num) ? '#d82633' : '#000'; // Traditional red or black
  };

  /**
   * Open One Chain explorer for game transaction
   * @param {string} txHash - One Chain transaction hash
   */
  const openOneChainExplorer = (txHash) => {
    if (txHash) {
      const explorerUrl = oneChainClientService.getExplorerUrl(txHash);
      window.open(explorerUrl, '_blank');
    }
  };

  /**
   * Open Arbitrum Sepolia explorer for entropy transaction
   * @param {string} txHash - Arbitrum Sepolia transaction hash
   */
  const openArbitrumExplorer = (txHash) => {
    if (txHash) {
      const explorerUrl = `https://sepolia.arbiscan.io/tx/${txHash}`;
      window.open(explorerUrl, '_blank');
    }
  };

  return (
    <Paper
      elevation={5}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(0, 20, 60, 0.9) 0%, rgba(0, 40, 80, 0.85) 100%)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(0, 200, 255, 0.2)',
        mb: 5,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0, 150, 255, 0.3)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '5px',
          background: 'linear-gradient(90deg, #00d4ff, #0066ff)',
        }
      }}
    >
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{
          borderBottom: '1px solid rgba(0, 200, 255, 0.3)',
          pb: 1.5,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          color: 'white',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        <FaHistory color="#00d4ff" size={22} />
        <span style={{ background: 'linear-gradient(90deg, #FFFFFF, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Space History
        </span>
      </Typography>

      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        sx={{
          mb: 3,
          '& .MuiTabs-indicator': {
            backgroundColor: '#00d4ff',
            height: '3px',
            borderRadius: '3px'
          }
        }}
      >
        <Tab
          label="Recent Bets"
          icon={<FaDice size={16} />}
          iconPosition="start"
          sx={{
            color: tabValue === 0 ? 'white' : 'rgba(255,255,255,0.6)',
            textTransform: 'none',
            fontWeight: tabValue === 0 ? 'bold' : 'normal',
            '&.Mui-selected': {
              color: 'white',
            }
          }}
        />
        <Tab
          label="Statistics"
          icon={<FaChartLine size={16} />}
          iconPosition="start"
          sx={{
            color: tabValue === 1 ? 'white' : 'rgba(255,255,255,0.6)',
            textTransform: 'none',
            fontWeight: tabValue === 1 ? 'bold' : 'normal',
            '&.Mui-selected': {
              color: 'white',
            }
          }}
        />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress size={40} sx={{ color: '#0066ff' }} />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <Fade in={true}>
              <TableContainer
                sx={{
                  maxHeight: 400,
                  borderRadius: 2,
                  overflow: 'auto',
                  border: '1px solid rgba(0, 150, 255, 0.2)',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: 'rgba(0, 150, 255, 0.4)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: 'rgba(0, 150, 255, 0.6)',
                  }
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{
                      '& th': {
                        background: 'linear-gradient(90deg, rgba(0, 150, 255, 0.3), rgba(0, 200, 255, 0.2))',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        borderBottom: 'none',
                      }
                    }}>
                      <TableCell>Time</TableCell>
                      <TableCell>Bet Type</TableCell>
                      <TableCell align="center">Amount</TableCell>
                      <TableCell align="center">Result</TableCell>
                      <TableCell align="right">Payout</TableCell>
                      <TableCell align="center">Verification</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bets.map((bet) => (
                      <TableRow
                        key={bet.id}
                        sx={{
                          '&:hover': { backgroundColor: 'rgba(0, 150, 255, 0.1)' },
                          '& td': {
                            color: 'rgba(255,255,255,0.8)',
                            borderColor: 'rgba(0, 150, 255, 0.1)',
                            transition: 'all 0.2s ease'
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <TableCell>
                          <Box>
                            <Typography variant="body2" fontWeight="medium">
                              {formatTime(bet.time || bet.timestamp)}
                            </Typography>
                            <Typography variant="caption" color="rgba(255,255,255,0.5)">
                              {formatDate(bet.time || bet.timestamp)}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={bet.betType || bet.type || 'Unknown'}
                              size="small"
                              sx={{
                                fontSize: '0.75rem',
                                bgcolor: 'rgba(0, 150, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(0, 150, 255, 0.2)',
                                mb: 1
                              }}
                            />
                            {/* Show bet details if available */}
                            {bet.details && (
                              <Box sx={{ mt: 1 }}>
                                {bet.details.winningBets && bet.details.winningBets.length > 0 && (
                                  <Box sx={{ mb: 0.5 }}>
                                    {bet.details.winningBets.slice(0, 2).map((winBet, idx) => (
                                      <Typography
                                        key={idx}
                                        variant="caption"
                                        color="#14D854"
                                        sx={{
                                          display: 'block',
                                          fontSize: '0.7rem',
                                          fontWeight: 'medium'
                                        }}
                                      >
                                        ✓ {winBet}
                                      </Typography>
                                    ))}
                                    {bet.details.winningBets.length > 2 && (
                                      <Typography
                                        variant="caption"
                                        color="rgba(0, 180, 216, 0.7)"
                                        sx={{ fontSize: '0.65rem' }}
                                      >
                                        +{bet.details.winningBets.length - 2} more
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                                {bet.details.losingBets && bet.details.losingBets.length > 0 && (
                                  <Box>
                                    {bet.details.losingBets.slice(0, 2).map((loseBet, idx) => (
                                      <Typography
                                        key={idx}
                                        variant="caption"
                                        color="#00d4ff"
                                        sx={{
                                          display: 'block',
                                          fontSize: '0.7rem',
                                          fontWeight: 'medium'
                                        }}
                                      >
                                        ✗ {loseBet}
                                      </Typography>
                                    ))}
                                    {bet.details.losingBets.length > 2 && (
                                      <Typography
                                        variant="caption"
                                        color="rgba(0, 200, 255, 0.7)"
                                        sx={{ fontSize: '0.65rem' }}
                                      >
                                        +{bet.details.losingBets.length - 2} more
                                      </Typography>
                                    )}
                                  </Box>
                                )}
                              </Box>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center">{formatMONAmount(bet.amount || bet.totalBetAmount || 0)} OCT</TableCell>
                        <TableCell align="center">
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor: getNumberColor(bet.result || bet.winningNumber),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              margin: '0 auto',
                              border: '1px solid rgba(255,255,255,0.2)',
                              boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                            }}
                          >
                            <Typography variant="body2" fontWeight="bold" color="white">
                              {bet.result !== undefined ? bet.result : bet.winningNumber !== undefined ? bet.winningNumber : '?'}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            sx={{
                              color: bet.win ? '#14D854' : 'rgba(255,255,255,0.6)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: 0.5
                            }}
                          >
                            {bet.payout >= 0 ? (
                              <>
                                <FaCoins size={12} color="#14D854" />
                                +{formatMONAmount(bet.payout || bet.netResult || 0)} OCT
                              </>
                            ) : bet.payout < 0 ? (
                              <>
                                <FaCoins size={12} color="#ff4d4d" />
                                {formatMONAmount(bet.payout || bet.netResult || 0)} OCT
                              </>
                            ) : '-'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          {bet.entropyProof || bet.transactionHash || bet.onechainTxHash ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ color: '#FFC107', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                  {bet.entropyProof?.sequenceNumber && bet.entropyProof.sequenceNumber !== '0' ? String(bet.entropyProof.sequenceNumber) : ''}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center' }}>
                                {/* One Chain Explorer Link */}
                                {(bet.transactionHash || bet.onechainTxHash) && (
                                  <Box
                                    onClick={() => openOneChainExplorer(bet.transactionHash || bet.onechainTxHash)}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      cursor: 'pointer',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                      border: '1px solid rgba(76, 175, 80, 0.3)',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  >
                                    <FaExternalLinkAlt size={10} color="#4CAF50" />
                                    <Typography variant="caption" sx={{ color: '#4CAF50', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                      One Chain
                                    </Typography>
                                  </Box>
                                )}
                                {/* Arbitrum Sepolia Entropy Link */}
                                {(bet.entropyProof?.arbiscanUrl || bet.entropyTxHash || bet.arbitrumEntropyTxHash) && (
                                  <Box
                                    onClick={() => {
                                      if (bet.entropyProof?.arbiscanUrl) {
                                        window.open(bet.entropyProof.arbiscanUrl, '_blank');
                                      } else {
                                        openArbitrumExplorer(bet.entropyTxHash || bet.arbitrumEntropyTxHash);
                                      }
                                    }}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      cursor: 'pointer',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                                      border: '1px solid rgba(33, 150, 243, 0.3)',
                                      transition: 'all 0.2s ease',
                                      '&:hover': {
                                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                                        transform: 'scale(1.05)'
                                      }
                                    }}
                                  >
                                    <FaExternalLinkAlt size={10} color="#2196F3" />
                                    <Typography variant="caption" sx={{ color: '#2196F3', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                      Entropy
                                    </Typography>
                                  </Box>
                                )}

                              </Box>
                            </Box>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CircularProgress size={16} sx={{ color: '#0066ff' }} />
                              <Typography variant="caption" sx={{ color: '#0066ff' }}>
                                Generating...
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Fade>
          )}

          {tabValue === 1 && (
            <Fade in={true}>
              <Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
                  <Box
                    sx={{
                      flex: 1,
                      minWidth: '150px',
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0, 150, 255, 0.1) 100%)',
                      border: '1px solid rgba(0, 150, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 150, 255, 0.2)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                        }}
                      >
                        <FaChartLine color="#0066ff" size={16} />
                      </Box>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Total Bets</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{stats.totalBets}</Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: '150px',
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0, 160, 180, 0.1) 100%)',
                      border: '1px solid rgba(0, 160, 180, 0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 160, 180, 0.2)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                        }}
                      >
                        <FaFire color="#00a8cc" size={16} />
                      </Box>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Win Rate</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{stats.winRate.toFixed(1)}%</Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: '150px',
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0, 200, 255, 0.1) 100%)',
                      border: '1px solid rgba(0, 200, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 200, 255, 0.2)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                        }}
                      >
                        <FaCoins color="#00d4ff" size={16} />
                      </Box>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Total Wagered</Typography>
                    </Box>
                    <Typography variant="h4" fontWeight="bold" color="white" sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{formatMONAmount(stats.totalWagered)} OCT</Typography>
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: '150px',
                      p: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0, 180, 216, 0.1) 100%)',
                      border: '1px solid rgba(0, 180, 216, 0.2)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 6px 15px rgba(0,0,0,0.2)',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 180, 216, 0.2)',
                          boxShadow: '0 3px 6px rgba(0,0,0,0.2)',
                        }}
                      >
                        <FaCoins color="#14D854" size={16} />
                      </Box>
                      <Typography variant="body2" color="rgba(255,255,255,0.7)">Net Profit</Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color={stats.netProfit >= 0 ? '#14D854' : '#00d4ff'}
                      sx={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                    >
                      {stats.netProfit >= 0 ? '+' : ''}{formatMONAmount(stats.netProfit)} OCT
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                  <Box
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(0, 150, 255, 0.15)',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: '#00a8cc',
                      }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="white" sx={{ mb: 2 }}>Hot Numbers</Typography>

                    {stats.mostCommonResults.length > 0 ? (
                      <Box sx={{ display: 'flex', gap: 3 }}>
                        {stats.mostCommonResults.map((result, index) => (
                          <Box key={index} sx={{ textAlign: 'center' }}>
                            <Box
                              sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                backgroundColor: getNumberColor(result.number),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 12px',
                                border: '2px solid rgba(255,255,255,0.2)',
                                boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                                position: 'relative',
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  top: '-8px',
                                  right: '-8px',
                                  width: '22px',
                                  height: '22px',
                                  borderRadius: '50%',
                                  backgroundColor: '#00a8cc',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '12px',
                                  fontWeight: 'bold',
                                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                }
                              }}
                              data-count={result.count}
                            >
                              <Typography variant="h5" fontWeight="bold" color="white" sx={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>{result.number}</Typography>
                            </Box>
                            <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ fontWeight: 'medium' }}>
                              {result.count} time{result.count !== 1 ? 's' : ''}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="rgba(255,255,255,0.5)" sx={{ fontStyle: 'italic' }}>
                        Not enough data
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      p: 3,
                      borderRadius: 2,
                      backgroundColor: 'rgba(0,0,0,0.2)',
                      border: '1px solid rgba(0, 150, 255, 0.15)',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        backgroundColor: '#14D854',
                      }
                    }}
                  >
                    <Typography variant="subtitle1" fontWeight="bold" color="white" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FaTrophy color="#00a8cc" size={16} />
                      Biggest Win
                    </Typography>

                    {stats.biggestWin ? (
                      <Box sx={{ position: 'relative' }}>
                        <Typography
                          variant="h3"
                          fontWeight="bold"
                          color="#14D854"
                          sx={{
                            textShadow: '0 2px 5px rgba(0,0,0,0.5)',
                            position: 'relative',
                            zIndex: 2
                          }}
                        >
                          {stats.biggestWin.payout} OCT
                        </Typography>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -10,
                            right: -10,
                            width: 80,
                            height: 80,
                            opacity: 0.2,
                            zIndex: 1
                          }}
                        >
                          <FaCoins color="#14D854" size={80} />
                        </Box>
                        <Typography variant="body2" color="rgba(255,255,255,0.7)" sx={{ mt: 1, position: 'relative', zIndex: 2 }}>
                          Your largest single payout so far
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaExclamationCircle color="#00a8cc" />
                        <Typography variant="body2" color="rgba(255,255,255,0.7)">
                          No wins recorded yet. Keep playing!
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 150, 255, 0.15) 100%)',
                    border: '1px solid rgba(0, 150, 255, 0.15)',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <FaInfoCircle color="#0066ff" style={{ flexShrink: 0 }} />
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    These statistics cover your most recent {stats.totalBets} bets with a lifetime ROI of {stats.roi.toFixed(1)}%.
                  </Typography>
                </Box>
              </Box>
            </Fade>
          )}
        </>
      )}
    </Paper>
  );
};

export default RouletteHistory; 