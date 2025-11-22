"use client";
import React from 'react';
import { Box, Typography, Paper, Chip, IconButton, Tooltip } from '@mui/material';
import { OpenInNew, Verified, Security } from '@mui/icons-material';
import oneChainClientService from '../services/OneChainClientService.js';

const BettingHistory = ({ history }) => {
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

  const formatTxHash = (hash) => {
    if (!hash) return 'N/A';
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: 2,
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary">
          Betting History
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            icon={<Security />}
            label="One Chain"
            color="success"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<Security />}
            label="Entropy"
            color="info"
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
      {history.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="text.secondary">
            No betting history yet
          </Typography>
        </Box>
      ) : (
        history.map((bet, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
              p: 1.5,
              borderRadius: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              },
              borderLeft: bet.won ? '4px solid #4caf50' : '4px solid #f44336'
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                {bet.type}
              </Typography>
              <Typography variant="body1" color="text.primary">
                {bet.amount} OCT
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(bet.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="body1" 
                fontWeight="bold"
                color={bet.won ? 'success.main' : 'error.main'}
              >
                {bet.won ? '+' : '-'}{bet.payout} OCT
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 0.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                  Result:
                </Typography>
                <Tooltip title={
                  bet.transactionHash || bet.onechainTxHash 
                    ? 'One Chain Verified - Click to view' 
                    : bet.vrfDetails?.transactionHash 
                    ? 'Entropy Verified - Click to view' 
                    : 'Result'
                }>
                  <Box
                    sx={{
                      position: 'relative',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: 'white',
                      fontWeight: 'bold',
                      backgroundColor: bet.roll === 0 ? '#14D854' : 
                        [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(bet.roll) ? '#d82633' : '#333',
                      cursor: (bet.transactionHash || bet.onechainTxHash) ? 'pointer' : 'default',
                      '&:hover': {
                        transform: (bet.transactionHash || bet.onechainTxHash) ? 'scale(1.1)' : 'none'
                      }
                    }}
                    onClick={() => {
                      if (bet.transactionHash || bet.onechainTxHash) {
                        openOneChainExplorer(bet.transactionHash || bet.onechainTxHash);
                      }
                    }}
                  >
                    {bet.roll}
                    {(bet.transactionHash || bet.onechainTxHash) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          right: -2,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#4CAF50',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Verified sx={{ fontSize: 6, color: 'white' }} />
                      </Box>
                    )}
                    {(bet.entropyTxHash || bet.arbitrumEntropyTxHash || bet.vrfDetails?.transactionHash) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -2,
                          left: -2,
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: '#2196F3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openArbitrumExplorer(bet.entropyTxHash || bet.arbitrumEntropyTxHash || bet.vrfDetails?.transactionHash);
                        }}
                      >
                        <Verified sx={{ fontSize: 6, color: 'white' }} />
                      </Box>
                    )}
                  </Box>
                </Tooltip>
              </Box>
              
              {/* One Chain Transaction Details */}
              {(bet.transactionHash || bet.onechainTxHash) && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    One Chain:
                  </Typography>
                  <Tooltip title="Click to verify on One Chain Explorer">
                    <Chip
                      label={formatTxHash(bet.transactionHash || bet.onechainTxHash)}
                      size="small"
                      variant="outlined"
                      color="success"
                      icon={<Verified />}
                      onClick={() => openOneChainExplorer(bet.transactionHash || bet.onechainTxHash)}
                      sx={{ 
                        fontSize: '0.6rem', 
                        height: 20,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        }
                      }}
                    />
                  </Tooltip>
                </Box>
              )}
              
              {/* Entropy Transaction Details */}
              {(bet.entropyTxHash || bet.arbitrumEntropyTxHash || bet.vrfDetails?.transactionHash) && (
                <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                    Entropy:
                  </Typography>
                  <Tooltip title="Click to verify on Arbitrum Sepolia Explorer">
                    <Chip
                      label={formatTxHash(bet.entropyTxHash || bet.arbitrumEntropyTxHash || bet.vrfDetails?.transactionHash)}
                      size="small"
                      variant="outlined"
                      color="info"
                      icon={<Verified />}
                      onClick={() => openArbitrumExplorer(bet.entropyTxHash || bet.arbitrumEntropyTxHash || bet.vrfDetails?.transactionHash)}
                      sx={{ 
                        fontSize: '0.6rem', 
                        height: 20,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(33, 150, 243, 0.1)'
                        }
                      }}
                    />
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Box>
        ))
      )}
    </Paper>
  );
};

export default BettingHistory; 