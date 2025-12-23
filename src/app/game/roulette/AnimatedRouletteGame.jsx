import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { enhancedAnimations, animationClasses, injectAnimationStyles } from './enhanced-styles';

// 粒子效果组件
const ParticleExplosion = ({ active, x, y, count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 200,
    y: (Math.random() - 0.5) * 200,
    delay: Math.random() * 0.5,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)]
  }));

  if (!active) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        left: x,
        top: y,
        width: 1,
        height: 1,
        pointerEvents: 'none',
        zIndex: 9999
      }}
    >
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="particle"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 6,
            height: 6,
            backgroundColor: particle.color,
            borderRadius: '50%'
          }}
          initial={{ 
            x: 0, 
            y: 0, 
            opacity: 1, 
            scale: 1 
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0
          }}
          transition={{
            duration: 1,
            delay: particle.delay,
            ease: "easeOut"
          }}
        />
      ))}
    </Box>
  );
};

// 动画筹码组件
const AnimatedChip = ({ amount, position, onAnimationComplete }) => {
  return (
    <motion.div
      className="animated-chip"
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: 40,
        height: 40,
        background: 'radial-gradient(circle, #FFD700, #FFA500)',
        border: '2px solid #FFF',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000',
        fontWeight: 'bold',
        fontSize: '12px',
        zIndex: 100,
        pointerEvents: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}
      initial={{ 
        scale: 0.5, 
        opacity: 0,
        x: '-50%',
        y: '-50%'
      }}
      animate={{ 
        scale: 1, 
        opacity: 1 
      }}
      exit={{ 
        scale: 0, 
        opacity: 0 
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      onAnimationComplete={onAnimationComplete}
    >
      {amount}
    </motion.div>
  );
};

// 获胜数字高亮组件
const WinningNumberHighlight = ({ number, isWinner, position }) => {
  return (
    <motion.div
      className={`winning-number ${isWinner ? 'number-win' : ''}`}
      style={{
        position: 'absolute',
        ...position,
        width: 50,
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: isWinner ? '3px solid #FFD700' : '2px solid rgba(255,255,255,0.3)',
        backgroundColor: isWinner ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
        zIndex: isWinner ? 10 : 1
      }}
      animate={{
        scale: isWinner ? [1, 1.3, 1.1, 1] : 1,
        rotate: isWinner ? [0, 5, -5, 0] : 0,
        boxShadow: isWinner ? 
          ['0 0 0 rgba(255,215,0,0)', '0 0 20px rgba(255,215,0,0.8)', '0 0 10px rgba(255,215,0,0.4)', '0 0 0 rgba(255,215,0,0)'] : 
          '0 0 0 rgba(255,255,255,0)'
      }}
      transition={{
        duration: isWinner ? 1.5 : 0.3,
        repeat: isWinner ? 2 : 0,
        repeatType: "reverse"
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          color: isWinner ? '#FFD700' : '#FFF',
          textShadow: isWinner ? '0 0 10px rgba(255,215,0,0.8)' : 'none'
        }}
      >
        {number}
      </Typography>
    </motion.div>
  );
};

// 主游戏动画控制器
const AnimatedRouletteGame = ({ 
  onPlaceBet,
  children,
  gameState,
  result,
  spinning
}) => {
  const [particles, setParticles] = useState({ active: false, x: 0, y: 0 });
  const [animatedChips, setAnimatedChips] = useState([]);
  const [winningNumbers, setWinningNumbers] = useState([]);
  const gameAreaRef = useRef(null);

  // 注入动画样式
  useEffect(() => {
    injectAnimationStyles();
  }, []);

  // 处理投注动画
  const handlePlaceBet = useCallback((betInfo) => {
    const { amount, position } = betInfo;
    
    // 创建动画筹码
    const chipId = Date.now();
    const newChip = {
      id: chipId,
      amount,
      position,
      key: chipId
    };
    
    setAnimatedChips(prev => [...prev, newChip]);
    
    // 触发粒子效果
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      setParticles({
        active: true,
        x: position.x + rect.left,
        y: position.y + rect.top
      });
    }
    
    // 调用原始投注函数
    onPlaceBet && onPlaceBet(betInfo);
    
    // 清理动画元素
    setTimeout(() => {
      setAnimatedChips(prev => prev.filter(chip => chip.id !== chipId));
      setParticles(prev => ({ ...prev, active: false }));
    }, 1000);
  }, [onPlaceBet]);

  // 处理游戏结果动画
  useEffect(() => {
    if (result !== null && result !== undefined) {
      setWinningNumbers([result]);
      
      // 滚动到结果区域
      const resultElement = document.getElementById('game-result');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [result]);

  // 转轮旋转动画
  const wheelVariants = {
    spinning: {
      rotate: spinning ? 360 * 10 : 0,
      transition: {
        duration: 4,
        ease: "linear",
        repeat: spinning ? Infinity : 0
      }
    },
    stopped: {
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box ref={gameAreaRef} sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* 粒子爆炸效果 */}
      <AnimatePresence>
        {particles.active && (
          <ParticleExplosion 
            active={particles.active}
            x={particles.x}
            y={particles.y}
          />
        )}
      </AnimatePresence>

      {/* 动画筹码 */}
      <AnimatePresence>
        {animatedChips.map(chip => (
          <AnimatedChip
            key={chip.key}
            amount={chip.amount}
            position={chip.position}
            onAnimationComplete={() => {
              setAnimatedChips(prev => prev.filter(c => c.id !== chip.id));
            }}
          />
        ))}
      </AnimatePresence>

      {/* 游戏内容区域 */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {children}
      </Box>

      {/* 获胜数字显示 */}
      <AnimatePresence>
        {winningNumbers.map(num => (
          <WinningNumberHighlight
            key={num}
            number={num}
            isWinner={true}
            position={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        ))}
      </AnimatePresence>

      {/* 游戏状态指示器 */}
      <AnimatePresence>
        {spinning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              background: 'rgba(0,0,0,0.8)',
              color: '#FFD700',
              padding: '10px 20px',
              borderRadius: '20px',
              border: '2px solid #FFD700',
              zIndex: 100
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              🎰 SPINNING...
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AnimatedRouletteGame;

export { ParticleExplosion, AnimatedChip, WinningNumberHighlight };