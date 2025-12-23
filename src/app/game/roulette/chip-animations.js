// 筹码飞行动画系统 - 专门用于展示投注过程的视觉效果
// Pure vanilla JS implementation - no React dependencies

class ChipAnimationSystem {
  constructor() {
    this.activeAnimations = new Map();
    this.animationContainer = null;
    this.isInitialized = false;

    // Don't initialize immediately - wait for DOM to be ready
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        // DOM is already ready
        this.init();
      }
    }
  }

  init() {
    if (this.isInitialized) {
      return;
    }

    // 确保 body 已经存在
    if (!document.body) {
      console.warn('⚠️ Document body not ready, deferring initialization');
      setTimeout(() => this.init(), 100);
      return;
    }

    // 创建全局动画容器 - 确保在最顶层
    if (!document.getElementById('chip-animation-container')) {
      this.animationContainer = document.createElement('div');
      this.animationContainer.id = 'chip-animation-container';
      this.animationContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 2147483647;
        overflow: visible;
        isolation: isolate;
      `;
      document.body.appendChild(this.animationContainer);
      console.log('✅ 筹码动画容器已创建');
    } else {
      this.animationContainer = document.getElementById('chip-animation-container');
      console.log('✅ 使用现有的筹码动画容器');
    }

    this.isInitialized = true;
  }

  // 创建单个筹码飞行动画
  createFlyingChip(startX, startY, endX, endY, value, betType, onComplete) {
    console.log('🎯 createFlyingChip called:', { startX, startY, endX, endY, value, betType });

    // Ensure initialization
    if (!this.isInitialized || !this.animationContainer) {
      console.log('⚠️ Animation system not initialized, initializing now...');
      this.init();

      // If still not initialized, give up
      if (!this.animationContainer) {
        console.error('❌ Failed to initialize animation container');
        if (onComplete) onComplete();
        return null;
      }
    }

    console.log('✅ Animation container ready:', this.animationContainer);

    const chipId = `chip-${Date.now()}-${Math.random()}`;

    // 创建筹码元素
    const chip = document.createElement('div');
    chip.id = chipId;
    chip.className = 'flying-chip';
    chip.style.cssText = `
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle at 30% 30%, #FFD700, #FFA500);
      border: 3px solid #FF8C00;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 12px;
      color: black;
      box-shadow: 0 4px 12px rgba(255, 215, 0, 0.6);
      transform: translate(${startX - 20}px, ${startY - 20}px);
      z-index: 2147483647;
      will-change: transform, opacity;
    `;
    chip.textContent = String(value);

    console.log('💫 Chip element created:', chip);

    // 添加筹码光晕效果
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,215,0,0.4), transparent);
      animation: pulse 1s infinite;
    `;
    chip.appendChild(glow);

    this.animationContainer.appendChild(chip);
    console.log('✅ Chip appended to container. Container children count:', this.animationContainer.children.length);

    // 计算飞行路径（贝塞尔曲线）
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const curvature = distance * 0.3; // 曲线高度

    console.log('📏 Flight path calculated:', { deltaX, deltaY, distance, curvature });

    // 控制点（创建弧形轨迹）
    const controlX = startX + deltaX * 0.5;
    const controlY = startY + deltaY * 0.5 - curvature;

    // 动画关键帧
    const keyframes = [
      {
        transform: `translate(${startX - 20}px, ${startY - 20}px) rotate(0deg) scale(1)`,
        opacity: 1
      },
      {
        transform: `translate(${controlX - 20}px, ${controlY - 20}px) rotate(180deg) scale(1.2)`,
        opacity: 0.9,
        offset: 0.5
      },
      {
        transform: `translate(${endX - 20}px, ${endY - 20}px) rotate(360deg) scale(1)`,
        opacity: 1
      }
    ];

    console.log('🎬 Starting animation with keyframes');

    // 添加粒子拖尾效果
    this.createParticleTrail(startX, startY, endX, endY);

    const finish = () => {
      console.log('🏁 Animation finished for chip:', chipId);

      // 到达目标后添加放置效果
      this.createChipPlacementEffect(endX, endY, value, betType);

      // 移除筹码元素
      setTimeout(() => {
        if (chip.parentNode) {
          chip.parentNode.removeChild(chip);
          console.log('🗑️ Chip removed from container');
        }
      }, 200);

      if (onComplete) onComplete();
    };

    // 执行飞行动画（优先 Web Animations API，失败则降级 CSS transition）
    if (typeof chip.animate === 'function') {
      const animation = chip.animate(keyframes, {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        fill: 'forwards'
      });

      animation.onfinish = finish;
      this.activeAnimations.set(chipId, { chip, animation });
      console.log('📝 Animation registered. Total active animations:', this.activeAnimations.size);
      return chipId;
    }

    // Fallback path
    console.warn('⚠️ Web Animations API not available - falling back to CSS transition');
    const duration = 1000;
    chip.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity ${duration}ms ease-out`;

    requestAnimationFrame(() => {
      chip.style.transform = `translate(${endX - 20}px, ${endY - 20}px) rotate(360deg) scale(1)`;
      chip.style.opacity = '1';
    });

    setTimeout(finish, duration);
    this.activeAnimations.set(chipId, { chip, animation: null });
    console.log('📝 Animation registered (fallback). Total active animations:', this.activeAnimations.size);
    return chipId;
  }

  // 创建粒子拖尾效果
  createParticleTrail(startX, startY, endX, endY) {
    const particleCount = 8;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #FFD700;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2147483646;
      `;

      this.animationContainer.appendChild(particle);
      particles.push(particle);

      // 随机偏移路径
      const progress = i / particleCount;
      const trailX = startX + (endX - startX) * progress + (Math.random() - 0.5) * 20;
      const trailY = startY + (endY - startY) * progress + (Math.random() - 0.5) * 20;

      particle.style.transform = `translate(${trailX - 2}px, ${trailY - 2}px)`;

      // 粒子淡出动画
      if (typeof particle.animate === 'function') {
        particle.animate([
          { opacity: 0.8, transform: `translate(${trailX - 2}px, ${trailY - 2}px) scale(1)` },
          { opacity: 0, transform: `translate(${trailX - 2}px, ${trailY - 2}px) scale(0)` }
        ], {
          duration: 600,
          delay: i * 50,
          easing: 'ease-out'
        }).onfinish = () => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        };
      } else {
        // Minimal fallback: just remove after timeout
        setTimeout(() => {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 600 + i * 50);
      }
    }
  }

  // 创建筹码放置效果
  createChipPlacementEffect(x, y, value, betType) {
    const effect = document.createElement('div');
    effect.style.cssText = `
      position: absolute;
      left: ${x - 20}px;
      top: ${y - 20}px;
      width: 40px;
      height: 40px;
      border: 2px solid #FFD700;
      border-radius: 50%;
      pointer-events: none;
      z-index: 2147483645;
    `;

    this.animationContainer.appendChild(effect);

    // 扩散波纹效果
    if (typeof effect.animate === 'function') {
      const ripple = effect.animate([
        {
          transform: 'scale(0.5)',
          opacity: 1,
          borderWidth: '3px'
        },
        {
          transform: 'scale(2)',
          opacity: 0,
          borderWidth: '1px'
        }
      ], {
        duration: 600,
        easing: 'ease-out'
      });

      ripple.onfinish = () => {
        if (effect.parentNode) {
          effect.parentNode.removeChild(effect);
        }
      };
    } else {
      setTimeout(() => {
        if (effect.parentNode) effect.parentNode.removeChild(effect);
      }, 600);
    }

    // 数字弹出效果
    const numberPopup = document.createElement('div');
    numberPopup.textContent = `+${value}`;
    numberPopup.style.cssText = `
      position: absolute;
      left: ${x - 15}px;
      top: ${y - 30}px;
      color: #FFD700;
      font-weight: bold;
      font-size: 14px;
      pointer-events: none;
      z-index: 2147483646;
      text-shadow: 0 0 4px rgba(0,0,0,0.8);
    `;

    this.animationContainer.appendChild(numberPopup);

    if (typeof numberPopup.animate === 'function') {
      numberPopup.animate([
        { transform: 'translateY(0px)', opacity: 1 },
        { transform: 'translateY(-20px)', opacity: 0 }
      ], {
        duration: 1000,
        easing: 'ease-out'
      }).onfinish = () => {
        if (numberPopup.parentNode) {
          numberPopup.parentNode.removeChild(numberPopup);
        }
      };
    } else {
      setTimeout(() => {
        if (numberPopup.parentNode) numberPopup.parentNode.removeChild(numberPopup);
      }, 1000);
    }
  }

  // 批量创建多个筹码同时飞行
  createMultipleChipFlight(positions, bets, onAllComplete) {
    const totalChips = positions.length;
    let completedChips = 0;

    positions.forEach((pos, index) => {
      setTimeout(() => {
        this.createFlyingChip(
          pos.startX, pos.startY,
          pos.endX, pos.endY,
          bets[index].value,
          bets[index].type,
          () => {
            completedChips++;
            if (completedChips === totalChips && onAllComplete) {
              onAllComplete();
            }
          }
        );
      }, index * 100); // 每个筹码延迟100ms发射
    });
  }

  // 清除所有动画
  clearAllAnimations() {
    this.activeAnimations.forEach(({ chip, animation }) => {
      if (animation && typeof animation.cancel === 'function') {
        animation.cancel();
      }
      if (chip && chip.parentNode) {
        chip.parentNode.removeChild(chip);
      }
    });
    this.activeAnimations.clear();
  }
}

// 投注过程延长管理器
class BettingProcessManager {
  constructor() {
    this.isProcessing = false;
    this.processDuration = 1500; // 延长到1.5秒
  }

  async processBetWithEffects(betFunction, ...args) {
    if (this.isProcessing) return;

    this.isProcessing = true;

    // 显示投注处理状态
    this.showBettingState('placing');

    // 延长处理时间以展示动画
    await new Promise(resolve => setTimeout(resolve, 300));

    // 执行实际投注逻辑
    const result = betFunction(...args);

    // 显示投注确认状态
    this.showBettingState('confirmed');

    await new Promise(resolve => setTimeout(resolve, 400));

    // 隐藏投注状态
    this.hideBettingState();

    this.isProcessing = false;
    return result;
  }

  showBettingState(state) {
    const overlay = document.getElementById('betting-state-overlay') || this.createOverlay();

    switch (state) {
      case 'placing':
        overlay.innerHTML = `
          <div style="color: #FFD700; font-size: 18px; font-weight: bold;">
            投注中...
            <div style="margin-top: 10px; font-size: 14px; color: #FFF;">
              筹码飞行中，请稍候
            </div>
          </div>
        `;
        break;
      case 'confirmed':
        overlay.innerHTML = `
          <div style="color: #00FF00; font-size: 18px; font-weight: bold;">
            ✓ 投注确认
            <div style="margin-top: 10px; font-size: 14px; color: #FFF;">
              筹码已放置
            </div>
          </div>
        `;
        break;
    }

    overlay.style.display = 'flex';
  }

  hideBettingState() {
    const overlay = document.getElementById('betting-state-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'betting-state-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      padding: 20px 40px;
      border-radius: 10px;
      border: 2px solid #FFD700;
      z-index: 2147483647;
      display: none;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(5px);
    `;
    document.body.appendChild(overlay);
    return overlay;
  }
}

// 导出单例实例
export const chipAnimationSystem = new ChipAnimationSystem();
export const bettingProcessManager = new BettingProcessManager();

// 添加CSS动画关键帧
if (typeof document !== 'undefined') {
  if (!document.getElementById('chip-animation-styles')) {
    const style = document.createElement('style');
    style.id = 'chip-animation-styles';
    style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }

    @keyframes chipFloat {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-3px); }
    }

    .chip-float {
      animation: chipFloat 2s ease-in-out infinite;
    }
  `;
    document.head.appendChild(style);
  }
}
