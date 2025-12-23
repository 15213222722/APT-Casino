// 增强的轮盘游戏动画样式
import { keyframes } from '@mui/system';

// 定义动画关键帧
const chipFlyKeyframe = keyframes`
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(0.8) translateY(-20px);
    opacity: 0.8;
  }
  100% {
    transform: scale(0.6) translateY(-40px);
    opacity: 0;
  }
`;

const betPulseKeyframe = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0.7);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(255, 215, 0, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 215, 0, 0);
  }
`;

const numberWinKeyframe = keyframes`
  0% {
    transform: scale(1);
    background-color: transparent;
  }
  25% {
    transform: scale(1.2);
    background-color: rgba(255, 215, 0, 0.5);
  }
  50% {
    transform: scale(1.1);
    background-color: rgba(255, 215, 0, 0.3);
  }
  75% {
    transform: scale(1.15);
    background-color: rgba(255, 215, 0, 0.4);
  }
  100% {
    transform: scale(1);
    background-color: rgba(255, 215, 0, 0.2);
  }
`;

const shakeKeyframe = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const countUpKeyframe = keyframes`
  0% {
    transform: scale(1.2);
    color: #FFD700;
  }
  100% {
    transform: scale(1);
    color: inherit;
  }
`;

const particleKeyframe = keyframes`
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
`;

// 导出动画样式对象
export const enhancedAnimations = {
  // 筹码飞行动画
  chipFly: {
    animation: `${chipFlyKeyframe} 0.6s ease-out forwards`
  },
  
  // 投注脉冲动画
  betPulse: {
    animation: `${betPulseKeyframe} 0.8s ease-out`
  },
  
  // 获胜数字动画
  numberWin: {
    animation: `${numberWinKeyframe} 1.5s ease-in-out`
  },
  
  // 摇摆动画（错误提示）
  shake: {
    animation: `${shakeKeyframe} 0.5s ease-in-out`
  },
  
  // 计数上升动画
  countUp: {
    animation: `${countUpKeyframe} 0.6s ease-out`
  },
  
  // 粒子效果
  particle: {
    animation: `${particleKeyframe} 1s ease-out forwards`
  }
};

// CSS 类名映射
export const animationClasses = {
  chipFly: 'chip-fly-animation',
  betPulse: 'bet-pulse-animation',
  numberWin: 'number-win-animation',
  shake: 'shake-animation',
  countUp: 'count-up-animation',
  particle: 'particle-animation'
};

// 动态样式注入
export const injectAnimationStyles = () => {
  if (typeof document === 'undefined') return;
  
  const styleId = 'roulette-animations';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes chipFly {
      ${chipFlyKeyframe.toString().replace(/keyframes\s+\w+\s*{/, '').replace(/}$/, '')}
    }
    
    @keyframes betPulse {
      ${betPulseKeyframe.toString().replace(/keyframes\s+\w+\s*{/, '').replace(/}$/, '')}
    }
    
    @keyframes numberWin {
      ${numberWinKeyframe.toString().replace(/keyframes\s+\w+\s*{/, '').replace(/}$/, '')}
    }
    
    @keyframes shake {
      ${shakeKeyframe.toString().replace(/keyframes\s+\w+\s*{/, '').replace(/}$/, '')}
    }
    
    @keyframes countUp {
      ${countUpKeyframe.toString().replace(/keyframes\s+\w+\s*{/, '').replace(/}$/, '')}
    }
    
    @keyframes particle {
      ${particleKeyframe.toString().replace(/keyframes\s+\w+\s*{/, '').replace(/}$/, '')}
    }
    
    .${animationClasses.chipFly} {
      animation: ${chipFlyKeyframe} 0.6s ease-out forwards;
    }
    
    .${animationClasses.betPulse} {
      animation: ${betPulseKeyframe} 0.8s ease-out;
    }
    
    .${animationClasses.numberWin} {
      animation: ${numberWinKeyframe} 1.5s ease-in-out;
    }
    
    .${animationClasses.shake} {
      animation: ${shakeKeyframe} 0.5s ease-in-out;
    }
    
    .${animationClasses.countUp} {
      animation: ${countUpKeyframe} 0.6s ease-out;
    }
    
    .${animationClasses.particle} {
      animation: ${particleKeyframe} 1s ease-out forwards;
    }
    
    .temp-chip {
      position: fixed;
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, #FFD700, #FFA500);
      border: 2px solid #FFF;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-weight: bold;
      font-size: 12px;
      z-index: 9999;
      pointer-events: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    
    .bet-indicator {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 8px;
      height: 8px;
      background: #FFD700;
      border-radius: 50%;
      opacity: 0;
    }
    
    .pulse-animation {
      animation: ${betPulseKeyframe} 0.8s ease-out;
    }
    
    #total-bet-display.count-up-animation {
      animation: ${countUpKeyframe} 0.6s ease-out;
    }
  `;
  
  document.head.appendChild(style);
};