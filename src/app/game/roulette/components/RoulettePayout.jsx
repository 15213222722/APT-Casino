"use client";
import React from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import Grid from "@mui/material/Unstable_Grid2";
import { FaCoins, FaExclamationTriangle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const RoulettePayout = () => {
  const { t } = useTranslation();

  const payoutData = [
    { 
      betType: t('roulette_payout.bet_types.straight_up.name'), 
      description: t('roulette_payout.bet_types.straight_up.description'), 
      payout: '35:1', 
      probability: 2.7, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.straight_up.examples', { returnObjects: true }),
      color: '#14D854'
    },
    { 
      betType: t('roulette_payout.bet_types.split.name'), 
      description: t('roulette_payout.bet_types.split.description'), 
      payout: '17:1', 
      probability: 5.4, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.split.examples', { returnObjects: true }),
      color: '#F94144'
    },
    { 
      betType: t('roulette_payout.bet_types.street.name'), 
      description: t('roulette_payout.bet_types.street.description'), 
      payout: '11:1', 
      probability: 8.1, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.street.examples', { returnObjects: true }),
      color: '#4895EF'
    },
    { 
      betType: t('roulette_payout.bet_types.corner.name'), 
      description: t('roulette_payout.bet_types.corner.description'), 
      payout: '8:1', 
      probability: 10.8, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.corner.examples', { returnObjects: true }),
      color: '#3A0CA3'
    },
    { 
      betType: t('roulette_payout.bet_types.six_line.name'), 
      description: t('roulette_payout.bet_types.six_line.description'), 
      payout: '5:1', 
      probability: 16.2, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.six_line.examples', { returnObjects: true }),
      color: '#F72585'
    },
    { 
      betType: t('roulette_payout.bet_types.dozen.name'), 
      description: t('roulette_payout.bet_types.dozen.description'), 
      payout: '2:1', 
      probability: 32.4, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.dozen.examples', { returnObjects: true }),
      color: '#4361EE'
    },
    { 
      betType: t('roulette_payout.bet_types.column.name'), 
      description: t('roulette_payout.bet_types.column.description'), 
      payout: '2:1', 
      probability: 32.4, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.column.examples', { returnObjects: true }),
      color: '#4CC9F0'
    },
    { 
      betType: t('roulette_payout.bet_types.red_black.name'), 
      description: t('roulette_payout.bet_types.red_black.description'), 
      payout: '1:1', 
      probability: 48.6, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.red_black.examples', { returnObjects: true }),
      color: '#00d4ff'
    },
    { 
      betType: t('roulette_payout.bet_types.odd_even.name'), 
      description: t('roulette_payout.bet_types.odd_even.description'), 
      payout: '1:1', 
      probability: 48.6, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.odd_even.examples', { returnObjects: true }),
      color: '#0066ff'
    },
    { 
      betType: t('roulette_payout.bet_types.high_low.name'), 
      description: t('roulette_payout.bet_types.high_low.description'), 
      payout: '1:1', 
      probability: 48.6, 
      houseEdge: 2.7,
      examples: t('roulette_payout.bet_types.high_low.examples', { returnObjects: true }),
      color: '#7209B7'
    }
  ];

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
        <FaCoins color="#00d4ff" size={22} />
        <span style={{ background: 'linear-gradient(90deg, #FFFFFF, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('roulette_payout.title')}
        </span>
      </Typography>
      
      <Typography 
        variant="body2" 
        color="rgba(255,255,255,0.7)"
        sx={{ mb: 3, mt: 1 }}
      >
        {t('roulette_payout.description')}
      </Typography>
      
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: '650px' }}>
          <Grid container sx={{ 
            py: 1, 
            px: 2, 
            borderRadius: '8px 8px 0 0',
            background: 'linear-gradient(90deg, rgba(0, 150, 255, 0.2), rgba(0, 200, 255, 0.2))',
            mb: 1
          }}>
            <Grid xs={2.5}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">{t('roulette_payout.headers.bet_type')}</Typography>
            </Grid>
            <Grid xs={3}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">{t('roulette_payout.headers.description')}</Typography>
            </Grid>
            <Grid xs={1.5} sx={{ textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">{t('roulette_payout.headers.payout')}</Typography>
            </Grid>
            <Grid xs={1.5} sx={{ textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">{t('roulette_payout.headers.win_percentage')}</Typography>
            </Grid>
            <Grid xs={3.5} sx={{ textAlign: 'center' }}>
              <Typography fontWeight="bold" fontSize="0.85rem" color="white">{t('roulette_payout.headers.examples')}</Typography>
            </Grid>
          </Grid>
          
          <Divider sx={{ borderColor: 'rgba(0, 150, 255, 0.15)', mb: 1 }} />
          
          {payoutData.map((item, index) => (
            <React.Fragment key={index}>
              <Grid container sx={{ 
                py: 1.5, 
                px: 2, 
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 150, 255, 0.1)',
                  transform: 'translateX(4px)'
                }
              }}>
                <Grid xs={2.5}>
                  <Typography 
                    fontWeight="medium" 
                    color="white" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      '&::before': {
                        content: '""',
                        display: 'inline-block',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: item.color,
                        marginRight: '8px',
                        boxShadow: `0 0 8px ${item.color}`
                      }
                    }}
                  >
                    {item.betType}
                  </Typography>
                </Grid>
                <Grid xs={3}>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">{item.description}</Typography>
                </Grid>
                <Grid xs={1.5} sx={{ textAlign: 'center' }}>
                  <Chip 
                    label={item.payout} 
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(0, 200, 255, 0.15)',
                      color: '#00d4ff',
                      minWidth: '55px',
                      border: '1px solid rgba(0, 200, 255, 0.2)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}
                  />
                </Grid>
                <Grid xs={1.5} sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="body2" 
                    fontWeight="medium"
                    sx={{
                      color: item.probability > 30 ? '#14D854' : item.probability > 10 ? '#00a8cc' : '#00d4ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5
                    }}
                  >
                    {item.probability}%
                  </Typography>
                </Grid>
                <Grid xs={3.5}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
                    {Array.isArray(item.examples) && item.examples.map((example, idx) => (
                      <Chip 
                        key={idx}
                        label={example} 
                        size="small"
                        sx={{ 
                          height: 20,
                          fontSize: '0.7rem',
                          backgroundColor: `${item.color}20`,
                          color: 'white',
                          border: `1px solid ${item.color}40`
                        }}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>
              {index !== payoutData.length - 1 && (
                <Divider sx={{ borderColor: 'rgba(0, 150, 255, 0.05)' }} />
              )}
            </React.Fragment>
          ))}
        </Box>
      </Box>
      
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 1,
          alignItems: 'center',
          mt: 3, 
          p: 2,
          borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 200, 255, 0.15) 100%)',
          border: '1px solid rgba(0, 200, 255, 0.1)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}
      >
        <FaExclamationTriangle color="#00d4ff" size={16} style={{ flexShrink: 0 }} />
        <Typography variant="body2" color="rgba(255,255,255,0.8)">
          {t('roulette_payout.footer_note')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RoulettePayout;