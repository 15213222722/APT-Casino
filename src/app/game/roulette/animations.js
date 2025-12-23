// 轮盘游戏动画配置和工具函数
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';

// 定义关键帧动画
const spinKeyframe = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const bounceKeyframe = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

const pulseKeyframe = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
`;

const floatKeyframe = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const shakeKeyframe = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  10%, 30%, 50%, 70%, 90% {
    transform: translateX(-5px);
  }
  20%, 40%, 60%, 80% {
    transform: translateX(5px);
  }
`;

const glowKeyframe = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.6);
  }
`;

const rouletteBallKeyframe = keyframes`
  0% {
    transform: rotate(0deg) translateX(120px) rotate(0deg);
  }
  100% {
    transform: rotate(360deg) translateX(120px) rotate(-360deg);
  }
`;

// 动画持续时间常量
export const ANIMATION_DURATION = {
  FAST: '0.2s',
  NORMAL: '0.4s',
  SLOW: '0.8s',
  SPIN: '4s'
};

// 缓动函数常量
export const EASING = {
  EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
};

// 创建动画样式组件
export const AnimatedChip = styled('div')({
  animation: `${bounceKeyframe} ${ANIMATION_DURATION.NORMAL} ${EASING.EASE_OUT}`,
});

export const PulsingBet = styled('div')({
  animation: `${pulseKeyframe} ${ANIMATION_DURATION.SLOW} infinite ${EASING.EASE_IN_OUT}`,
});

export const FloatingElement = styled('div')({
  animation: `${floatKeyframe} 3s ease-in-out infinite`,
});

export const ShakingElement = styled('div')({
  animation: `${shakeKeyframe} 0.5s ease-in-out`,
});

export const GlowingElement = styled('div')({
  animation: `${glowKeyframe} 2s ease-in-out infinite`,
});

export const SpinningWheel = styled('div')({
  animation: `${spinKeyframe} ${ANIMATION_DURATION.SPIN} linear`,
});

// 数字高亮动画
export const NumberHighlight = styled('div')({
  animation: `${pulseKeyframe} 1s ease-in-out`,
  '&.winner': {
    animation: `${glowKeyframe} 1.5s ease-in-out infinite`,
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    border: '2px solid #FFD700',
  }
});

// 投注成功动画
export const BetSuccessAnimation = styled('div')({
  position: 'relative',
  '&::after': {
    content: '✓',
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    width: '20px',
    height: '20px',
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '12px',
    animation: `${bounceKeyframe} ${ANIMATION_DURATION.FAST} ${EASING.BOUNCE}`,
  }
});

// 获胜动画
export const WinAnimation = styled('div')({
  animation: `${pulseKeyframe} 0.6s ease-in-out 3`,
  color: '#FFD700',
  textShadow: '0 0 10px rgba(255, 215, 0, 0.8)',
});

// 粒子效果容器
export const ParticleContainer = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  overflow: 'hidden',
});

// 粒子样式
export const Particle = styled('div')({
  position: 'absolute',
  width: '6px',
  height: '6px',
  backgroundColor: '#FFD700',
  borderRadius: '50%',
  animation: `${floatKeyframe} 2s ease-out forwards`,
});

// 动画工具函数
export const animationUtils = {
  // 创建粒子爆炸效果
  createParticleExplosion: (container, x, y, count = 20) => {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.className = Particle.toString();
      
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 50 + Math.random() * 50;
      const lifetime = 1000 + Math.random() * 1000;
      
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.animationDuration = lifetime + 'ms';
      
      container.appendChild(particle);
      
      // 清理粒子
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, lifetime);
    }
  },

  // 数字出现动画
  animateNumberAppearance: (element) => {
    element.style.transform = 'scale(0)';
    element.style.transition = 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 10);
  },

  // 投注筹码动画
  animateChipPlacement: (chip, targetElement) => {
    const chipRect = chip.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    
    chip.style.position = 'fixed';
    chip.style.left = chipRect.left + 'px';
    chip.style.top = chipRect.top + 'px';
    chip.style.zIndex = '1000';
    chip.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    
    setTimeout(() => {
      chip.style.left = (targetRect.left + targetRect.width / 2) + 'px';
      chip.style.top = (targetRect.top + targetRect.height / 2) + 'px';
      chip.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }, 10);
  },

  // 轮盘旋转到指定数字
  spinWheelToNumber: (wheelElement, targetNumber, duration = 4000) => {
    const segmentAngle = 360 / 37; // 37个数字 (0-36)
    const baseRotations = 10; // 基础旋转圈数
    const targetAngle = segmentAngle * targetNumber;
    const finalRotation = (baseRotations * 360) + (360 - targetAngle);
    
    wheelElement.style.transition = `transform ${duration}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`;
    wheelElement.style.transform = `rotate(${finalRotation}deg)`;
  }
};

export default {
  ANIMATION_DURATION,
  EASING,
  animationUtils
};