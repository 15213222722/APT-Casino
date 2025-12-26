"use client";
import React, { useState } from 'react';
import { Box, Typography, Paper, Accordion, AccordionSummary, AccordionDetails, Avatar, Chip, Divider, Fade } from '@mui/material';
import { FaLightbulb, FaChevronDown, FaStar, FaExclamationTriangle, FaChartLine, FaQuestion, FaCalculator, FaBookOpen, FaCheck, FaTimes } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const StrategyGuide = () => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const strategies = [
    {
      id: 'strategy-1',
      title: t('strategy_guide.strategies.martingale.title'),
      difficulty: t('strategy_guide.strategies.martingale.difficulty'),
      effectiveness: 4,
      risk: 'High',
      color: '#00d4ff',
      description: t('strategy_guide.strategies.martingale.description'),
      pros: t('strategy_guide.strategies.martingale.pros', { returnObjects: true }),
      cons: t('strategy_guide.strategies.martingale.cons', { returnObjects: true }),
      example: t('strategy_guide.strategies.martingale.example')
    },
    {
      id: 'strategy-2',
      title: t('strategy_guide.strategies.dalembert.title'),
      difficulty: t('strategy_guide.strategies.dalembert.difficulty'),
      effectiveness: 3,
      risk: 'Medium',
      color: '#0066ff',
      description: t('strategy_guide.strategies.dalembert.description'),
      pros: t('strategy_guide.strategies.dalembert.pros', { returnObjects: true }),
      cons: t('strategy_guide.strategies.dalembert.cons', { returnObjects: true }),
      example: t('strategy_guide.strategies.dalembert.example')
    },
    {
      id: 'strategy-3',
      title: t('strategy_guide.strategies.fibonacci.title'),
      difficulty: t('strategy_guide.strategies.fibonacci.difficulty'),
      effectiveness: 3,
      risk: 'Medium',
      color: '#7209B7',
      description: t('strategy_guide.strategies.fibonacci.description'),
      pros: t('strategy_guide.strategies.fibonacci.pros', { returnObjects: true }),
      cons: t('strategy_guide.strategies.fibonacci.cons', { returnObjects: true }),
      example: t('strategy_guide.strategies.fibonacci.example')
    },
    {
      id: 'strategy-4',
      title: t('strategy_guide.strategies.james_bond.title'),
      difficulty: t('strategy_guide.strategies.james_bond.difficulty'),
      effectiveness: 2,
      risk: 'High',
      color: '#4361EE',
      description: t('strategy_guide.strategies.james_bond.description'),
      pros: t('strategy_guide.strategies.james_bond.pros', { returnObjects: true }),
      cons: t('strategy_guide.strategies.james_bond.cons', { returnObjects: true }),
      example: t('strategy_guide.strategies.james_bond.example')
    },
    {
      id: 'strategy-5',
      title: t('strategy_guide.strategies.oscar_grind.title'),
      difficulty: t('strategy_guide.strategies.oscar_grind.difficulty'),
      effectiveness: 3,
      risk: 'Low',
      color: '#14D854',
      description: t('strategy_guide.strategies.oscar_grind.description'),
      pros: t('strategy_guide.strategies.oscar_grind.pros', { returnObjects: true }),
      cons: t('strategy_guide.strategies.oscar_grind.cons', { returnObjects: true }),
      example: t('strategy_guide.strategies.oscar_grind.example')
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
        height: '100%',
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
        <FaBookOpen color="#00d4ff" size={22} />
        <span style={{ background: 'linear-gradient(90deg, #FFFFFF, #00d4ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {t('strategy_guide.title')}
        </span>
      </Typography>
      
      <Typography 
        variant="body2" 
        color="rgba(255,255,255,0.7)"
        sx={{ mb: 3 }}
      >
        {t('strategy_guide.description')}
      </Typography>

      {strategies.map((strategy, index) => (
        <Fade 
          in={true} 
          key={strategy.id}
          style={{ 
            transformOrigin: '0 0 0',
            transitionDelay: `${index * 100}ms`
          }}
        >
          <Accordion 
            expanded={expanded === strategy.id} 
            onChange={handleChange(strategy.id)}
            sx={{
              backgroundColor: 'transparent',
              backgroundImage: 'none',
              boxShadow: 'none',
              mb: 2,
              '&:before': {
                display: 'none',
              },
              '& .MuiAccordionSummary-root': {
                background: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(${parseInt(strategy.color.slice(1, 3), 16)}, ${parseInt(strategy.color.slice(3, 5), 16)}, ${parseInt(strategy.color.slice(5, 7), 16)}, 0.2) 100%)`,
                borderRadius: expanded === strategy.id ? '12px 12px 0 0' : '12px',
                border: `1px solid ${strategy.color}50`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.4)',
                }
              },
              '& .MuiAccordionDetails-root': {
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderRadius: '0 0 12px 12px',
                borderLeft: `1px solid ${strategy.color}50`,
                borderRight: `1px solid ${strategy.color}50`,
                borderBottom: `1px solid ${strategy.color}50`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  backgroundColor: strategy.color,
                }
              }
            }}
          >
            <AccordionSummary
              expandIcon={<FaChevronDown color="white" />}
              aria-controls={`${strategy.id}-content`}
              id={`${strategy.id}-header`}
              sx={{
                '& .MuiAccordionSummary-expandIconWrapper': {
                  color: 'white',
                  transition: 'transform 0.3s',
                  transform: expanded === strategy.id ? 'rotate(180deg)' : 'rotate(0deg)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: strategy.color,
                    width: 40,
                    height: 40,
                    boxShadow: `0 0 10px ${strategy.color}80`,
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <FaLightbulb />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h6" 
                    color="white" 
                    fontWeight="bold" 
                    sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}
                  >
                    {strategy.title}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip 
                      label={strategy.difficulty} 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(0,0,0,0.3)', 
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.1)',
                        height: 24
                      }} 
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="caption" color="rgba(255,255,255,0.7)">
                        {t('strategy_guide.effectiveness')}:
                      </Typography>
                      {[...Array(5)].map((_, i) => (
                        <FaStar 
                          key={i} 
                          size={12} 
                          color={i < strategy.effectiveness ? '#00a8cc' : 'rgba(255,255,255,0.2)'} 
                        />
                      ))}
                    </Box>
                    <Chip 
                      label={`${t('strategy_guide.risk')}: ${strategy.risk}`} 
                      size="small" 
                      sx={{ 
                        bgcolor: strategy.risk === 'High' ? 'rgba(0, 200, 255, 0.2)' : 
                                strategy.risk === 'Medium' ? 'rgba(0, 160, 180, 0.2)' : 
                                'rgba(0, 180, 216, 0.2)', 
                        color: strategy.risk === 'High' ? '#00d4ff' : 
                               strategy.risk === 'Medium' ? '#00a8cc' : 
                               '#14D854',
                        border: `1px solid ${strategy.risk === 'High' ? '#00d4ff40' : 
                                          strategy.risk === 'Medium' ? '#00a8cc40' : 
                                          '#14D85440'}`,
                        height: 24
                      }} 
                    />
                  </Box>
                </Box>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph color="rgba(255,255,255,0.9)" sx={{ mb: 2 }}>
                {strategy.description}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
                <Box 
                  sx={{ 
                    flex: 1, 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: 'rgba(0, 180, 216, 0.1)', 
                    border: '1px solid rgba(0, 180, 216, 0.2)'
                  }}
                >
                  <Typography variant="subtitle2" color="#14D854" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FaCheck color="#14D854" />
                    {t('strategy_guide.advantages')}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {strategy.pros.map((pro, i) => (
                      <Typography component="li" key={i} variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 0.5 }}>
                        {pro}
                      </Typography>
                    ))}
                  </Box>
                </Box>
                
                <Box 
                  sx={{ 
                    flex: 1, 
                    p: 2, 
                    borderRadius: 2, 
                    backgroundColor: 'rgba(0, 200, 255, 0.1)', 
                    border: '1px solid rgba(0, 200, 255, 0.2)'
                  }}
                >
                  <Typography variant="subtitle2" color="#00d4ff" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FaTimes color="#00d4ff" />
                    {t('strategy_guide.disadvantages')}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    {strategy.cons.map((con, i) => (
                      <Typography component="li" key={i} variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 0.5 }}>
                        {con}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </Box>
              
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: 'rgba(0, 160, 180, 0.1)', 
                  border: '1px solid rgba(0, 160, 180, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2
                }}
              >
                <FaCalculator color="#00a8cc" style={{ marginTop: '3px' }} />
                <Box>
                  <Typography variant="subtitle2" color="#00a8cc" sx={{ mb: 1 }}>
                    {t('strategy_guide.example')}:
                  </Typography>
                  <Typography variant="body2" color="rgba(255,255,255,0.8)">
                    {strategy.example}
                  </Typography>
                </Box>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Fade>
      ))}
      
      <Box 
        sx={{ 
          mt: 2, 
          p: 2, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, rgba(0, 150, 255, 0.05) 0%, rgba(0, 200, 255, 0.15) 100%)',
          border: '1px solid rgba(0, 200, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}
      >
        <FaExclamationTriangle color="#00d4ff" size={20} style={{ flexShrink: 0 }} />
        <Typography variant="body2" color="rgba(255,255,255,0.8)">
          <strong>{t('strategy_guide.important')}:</strong> {t('strategy_guide.important_text')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StrategyGuide;