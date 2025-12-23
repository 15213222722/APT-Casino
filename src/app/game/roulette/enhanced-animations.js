// 增强版轮盘游戏动画系统
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';

// 新增关键帧动画
const chipFlyKeyframe = keyframes`
  0% {
    transform: translate(0, 0) scale(1) rotate(0deg);
    opacity: 1;
  }
  20% {
    transform: translate(20px, -30px) scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  50% {
    transform: translate(50px, -60px) scale(1.1) rotate(360deg);
    opacity: 0.6;
  }
  100% {
    transform: translate(var(--target-x), var(--target-y)) scale(0.8) rotate(720deg);
    opacity: 1;
  }
`;

const numberRevealKeyframe = keyframes`
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
    filter: blur(10px);
  }
  50% {
    transform: scale(1.3) rotate(-90deg);
    opacity: 0.7;
    filter: blur(2px);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
    filter: blur(0px);
  }
`;

const rouletteBall3DKeyframe = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg) translateZ(0px);
  }
  25% {
    transform: rotateX(90deg) rotateY(90deg) translateZ(20px);
  }
  50% {
    transform: rotateX(180deg) rotateY(180deg) translateZ(40px);
  }
  75% {
    transform: rotateX(270deg) rotateY(270deg) translateZ(20px);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) translateZ(0px);
  }
`;

const celebrationExplosionKeyframe = keyframes`
  0% {
    transform: scale(0) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.5) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(2) rotate(360deg);
    opacity: 0;
  }
`;

const betAreaGlowKeyframe = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
    border-color: rgba(255, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 0, 0, 0.8), inset 0 0 25px rgba(255, 0, 0, 0.2);
    border-color: rgba(255, 0, 0, 0.8);
  }
`;

const blackBetGlowKeyframe = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
    border-color: rgba(0, 0, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.8), inset 0 0 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(0, 0, 0, 0.8);
  }
`;

const wheelSpinBlurKeyframe = keyframes`
  0% {
    filter: blur(0px);
  }
  50% {
    filter: blur(2px);
  }
  100% {
    filter: blur(0px);
  }
`;

const confettiFallKeyframe = keyframes`
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
`;

// 增强版动画持续时间
export const ENHANCED_ANIMATION_DURATION = {
  CHIP_FLY: '0.8s',
  NUMBER_REVEAL: '0.6s',
  BALL_ROLL: '4s',
  CELEBRATION: '2s',
  BET_HIGHLIGHT: '1.5s',
  CONFETTI: '3s'
};

// 增强版缓动函数
export const ENHANCED_EASING = {
  CHIP_FLY: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  NUMBER_REVEAL: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  BALL_ROLL: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)',
  CELEBRATION: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
};

// 增强版动画组件
export const FlyingChip = styled('div')({
  position: 'fixed',
  zIndex: 1000,
  pointerEvents: 'none',
  animation: `${chipFlyKeyframe} ${ENHANCED_ANIMATION_DURATION.CHIP_FLY} ${ENHANCED_EASING.CHIP_FLY}`,
  '--target-x': '0px',
  '--target-y': '0px'
});

export const NumberReveal = styled('div')({
  animation: `${numberRevealKeyframe} ${ENHANCED_ANIMATION_DURATION.NUMBER_REVEAL} ${ENHANCED_EASING.NUMBER_REVEAL}`,
});

export const RouletteBall3D = styled('div')({
  animation: `${rouletteBall3DKeyframe} ${ENHANCED_ANIMATION_DURATION.BALL_ROLL} linear`,
  transformStyle: 'preserve-3d',
});

export const CelebrationExplosion = styled('div')({
  position: 'absolute',
  animation: `${celebrationExplosionKeyframe} ${ENHANCED_ANIMATION_DURATION.CELEBRATION} ${ENHANCED_EASING.CELEBRATION}`,
});

export const RedBetHighlight = styled('div')({
  animation: `${betAreaGlowKeyframe} ${ENHANCED_ANIMATION_DURATION.BET_HIGHLIGHT} ease-in-out infinite`,
  border: '2px solid transparent',
  borderRadius: '4px',
});

export const BlackBetHighlight = styled('div')({
  animation: `${blackBetGlowKeyframe} ${ENHANCED_ANIMATION_DURATION.BET_HIGHLIGHT} ease-in-out infinite`,
  border: '2px solid transparent',
  borderRadius: '4px',
});

export const SpinningWheelBlur = styled('div')({
  animation: `${wheelSpinBlurKeyframe} 0.1s linear infinite`,
});

export const ConfettiPiece = styled('div')({
  position: 'fixed',
  width: '10px',
  height: '10px',
  zIndex: 9999,
  animation: `${confettiFallKeyframe} ${ENHANCED_ANIMATION_DURATION.CONFETTI} linear forwards`,
});

// 高级动画工具函数
export const advancedAnimationUtils = {
  // 创建飞行筹码动画
  createFlyingChip: (startX, startY, targetX, targetY, color = '#FFD700') => {
    const chip = document.createElement('div');
    chip.className = FlyingChip.toString();
    chip.style.left = startX + 'px';
    chip.style.top = startY + 'px';
    chip.style.width = '30px';
    chip.style.height = '30px';
    chip.style.background = `radial-gradient(circle, ${color}, #FFA500)`;
    chip.style.borderRadius = '50%';
    chip.style.setProperty('--target-x', (targetX - startX) + 'px');
    chip.style.setProperty('--target-y', (targetY - startY) + 'px');
    
    document.body.appendChild(chip);
    
    setTimeout(() => {
      if (chip.parentNode) {
        chip.parentNode.removeChild(chip);
      }
    }, 800);
    
    return chip;
  },

  // 创建数字揭示动画
  revealWinningNumber: (element, number) => {
    element.classList.add(NumberReveal.toString());
    element.textContent = number;
    
    setTimeout(() => {
      element.classList.remove(NumberReveal.toString());
    }, 600);
  },

  // 创建庆祝爆炸效果
  createCelebrationExplosion: (x, y, color = '#FFD700') => {
    for (let i = 0; i < 12; i++) {
      const explosion = document.createElement('div');
      explosion.className = CelebrationExplosion.toString();
      explosion.style.left = x + 'px';
      explosion.style.top = y + 'px';
      explosion.style.width = '20px';
      explosion.style.height = '20px';
      explosion.style.background = color;
      explosion.style.borderRadius = '50%';
      explosion.style.transform = `rotate(${i * 30}deg)`;
      explosion.style.transformOrigin = '10px 10px';
      
      document.body.appendChild(explosion);
      
      setTimeout(() => {
        if (explosion.parentNode) {
          explosion.parentNode.removeChild(explosion);
        }
      }, 2000);
    }
  },

  // 创建五彩纸屑效果
  createConfettiStorm: (count = 50) => {
    const colors = ['#FFD700', '#FF0000', '#000000', '#FFFFFF', '#00FF00'];
    
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement('div');
      confetti.className = ConfettiPiece.toString();
      confetti.style.left = Math.random() * window.innerWidth + 'px';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 4000);
    }
  },

  // 高亮投注区域
  highlightBetArea: (element, isRed) => {
    const highlightClass = isRed ? RedBetHighlight : BlackBetHighlight;
    element.classList.add(highlightClass.toString());
    
    setTimeout(() => {
      element.classList.remove(highlightClass.toString());
    }, 1500);
  },

  // 轮盘旋转模糊效果
  addWheelSpinEffect: (wheelElement) => {
    wheelElement.classList.add(SpinningWheelBlur.toString());
    
    setTimeout(() => {
      wheelElement.classList.remove(SpinningWheelBlur.toString());
    }, 4000);
  }
};

export default {
  ENHANCED_ANIMATION_DURATION,
  ENHANCED_EASING,
  advancedAnimationUtils
};