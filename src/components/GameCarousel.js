"use client";
import { useState, useRef, useEffect } from "react";
import GradientBorderButton from "@/components/GradientBorderButton";
import Image from "next/image";
import Link from "next/link";
import { FaArrowLeft, FaArrowRight, FaUsers, FaBolt, FaFire } from "react-icons/fa6";
import HeaderText from "@/components/HeaderText";
import GameStats from "@/components/GameStats";

// Game data with more details
const FEATURED_GAMES = [
  {
    id: 'roulette',
    title: 'Roulette',
    description: 'Spin the wheel and test your luck',
    image: '/images/games/roulette.png',
    path: '/game/roulette',
    players: 142,
    categories: ['featured', 'table'],
    badge: 'POPULAR',
    badgeColor: 'from-[#0066FF] to-[#00A3FF]',
    isNew: false,
    isHot: true,
  },
  {
    id: 'mines',
    title: 'Mines',
    description: 'Navigate through the minefield and collect gems',
    image: '/images/games/mines.png',
    path: '/game/mines',
    players: 156,
    categories: ['featured', 'instant'],
    badge: 'HOT',
    badgeColor: 'from-[#4DA6FF] to-[#00A3FF]',
    isNew: false,
    isHot: true,
  },
  {
    id: 'wheel',
    title: 'Spin Wheel',
    description: 'Spin the wheel of fortune for amazing prizes',
    image: '/images/games/spin_the_wheel.png',
    path: '/game/wheel',
    players: 98,
    categories: ['featured', 'instant'],
    badge: 'FEATURED',
    badgeColor: 'from-[#0066FF] to-[#4DA6FF]',
    isNew: false,
    isHot: true,
  },
  {
    id: 'plinko',
    title: 'Plinko',
    description: 'Drop the ball and watch it bounce to big wins',
    image: '/images/games/plinko.png',
    path: '/game/plinko',
    players: 134,
    categories: ['featured', 'instant'],
    badge: 'POPULAR',
    badgeColor: 'from-[#00A3FF] to-[#66B3FF]',
    isNew: false,
    isHot: true,
  }
];

// Available category filters
const CATEGORIES = [
  { id: 'all', label: 'All Games' },
  { id: 'featured', label: 'Featured' },
  { id: 'table', label: 'Table Games' },
  { id: 'instant', label: 'Instant Win' },
];

const GameCarousel = () => {
  const scrollContainerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [visibleGames, setVisibleGames] = useState(FEATURED_GAMES);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoPlayRef = useRef(null);

  // Filter games when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      setVisibleGames(FEATURED_GAMES);
    } else {
      setVisibleGames(FEATURED_GAMES.filter(game => 
        game.categories.includes(activeCategory)
      ));
    }
  }, [activeCategory]);

  // Check if scroll arrows should be visible and update current slide
  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Calculate current slide based on scroll position
      const cardWidth = 410 + 16; // Card width + gap
      const newCurrentSlide = Math.round(scrollLeft / cardWidth);
      setCurrentSlide(newCurrentSlide);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
      
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, [visibleGames]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || visibleGames.length <= 1) return;

    const autoPlay = () => {
      if (!scrollContainerRef.current || isDragging) return;
      
      const container = scrollContainerRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      
      // Check if we've reached the end
      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        // Scroll back to beginning
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        // Scroll to next card
        container.scrollBy({ left: 420, behavior: 'smooth' });
      }
    };

    // Start auto-play
    autoPlayRef.current = setInterval(autoPlay, 4000); // Change card every 4 seconds

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, visibleGames, isDragging]);

  // Pause auto-play on user interaction
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  // Handle manual scrolling
  const handleScrollLeft = () => {
    pauseAutoPlay();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -420, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    pauseAutoPlay();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 420, behavior: "smooth" });
    }
  };

  // Mouse drag scrolling
  const handleMouseDown = (e) => {
    // 只对直接容器启用拖拽，忽略按钮点击
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    pauseAutoPlay();
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Handle touch events for mobile
  const handleTouchStart = () => {
    pauseAutoPlay();
  };

  // Game card component
  const GameCard = ({ game }) => (
    <div className="flex-shrink-0 w-[330px] sm:w-[370px] md:w-[410px] p-0.5 bg-gradient-to-br from-[#0066FF]/5 to-[#00A3FF]/5 rounded-xl h-[280px] transform transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl group">
      <div className="bg-[#001F3F]/10 backdrop-blur-sm flex p-4 md:p-5 w-full h-full rounded-xl relative overflow-hidden border border-[#0066FF]/30 z-10">
        <div className="flex flex-col justify-between z-10 w-3/5 h-full">
          {/* Game badge */}
          {game.badge && (
            <span className={`p-1 px-2 w-fit bg-gradient-to-r ${game.badgeColor} font-display text-white text-xs font-medium rounded-md flex items-center gap-1`}>
              {game.isNew && <FaBolt className="text-xs" />}
              {game.isHot && <FaFire className="text-xs" />}
              {game.badge}
            </span>
          )}
          
          <div className="flex flex-col justify-center flex-1">
            <div className="flex items-center gap-1 mb-1">
              <h3 className="text-lg md:text-xl font-display font-bold text-white group-hover:bg-gradient-to-r group-hover:from-[#0066FF] group-hover:to-[#00A3FF] group-hover:bg-clip-text group-hover:text-transparent transition-all">
                {game.title}
              </h3>
              {/* Live indicator for specific games */}
              {(game.id === 'roulette' || game.id === 'plinko' || game.id === 'mines' || game.id === 'wheel') && (
                <div className="flex items-center gap-1 bg-[#0066FF]/20 border border-[#00A3FF]/30 px-1 py-0.5 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse"></div>
                  <span className="text-[#4DA6FF] text-xs font-medium">LIVE</span>
                </div>
              )}
            </div>
            <p className="text-xs text-white/80 line-clamp-2 mb-2">{game.description}</p>
            
            {/* Live player count */}
            <div className="flex items-center gap-1 text-white/70">
              <FaUsers className="text-[#00A3FF] text-xs" />
              <span className="text-xs">{game.players} players</span>
            </div>
          </div>
          
          <div className="w-full">
            <Link href={game.path}>
              <div className="bg-gradient-to-r from-red-magic to-blue-magic hover:from-blue-magic hover:to-red-magic rounded-sm p-0.5 cursor-pointer transition-all w-full">
                <div className="bg-[#070005] rounded-sm px-2.5 py-1.5 justify-center font-display flex items-center text-white text-sm font-medium h-full">
                  Play Now
                </div>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="absolute -right-1 bottom-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <Image
            src={game.image}
            width={160}
            height={180}
            quality={100}
            priority
            alt={`${game.title} game`}
            className="object-contain drop-shadow-lg"
            style={{ objectFit: 'contain' }}
          />
        </div>
        

      </div>
    </div>
  );

  return (
    <div className="pt-12 pb-6 mx-auto px-4 relative overflow-hidden">
      {/* Multi-layered animated background with unique theme */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        {/* Deep space grid with animated stars */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 20% 30% at 20% 20%, #FF006E 0%, transparent 50%),
              radial-gradient(ellipse 25% 35% at 80% 80%, #8338EC 0%, transparent 50%),
              radial-gradient(ellipse 30% 40% at 50% 50%, #3A86FF 0%, transparent 40%),
              linear-gradient(135deg, #0a0118 0%, #1a0033 40%, #2d1b69 70%, #0a0118 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(131, 56, 236, 0.03) 2px,
                rgba(131, 56, 236, 0.03) 4px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(58, 134, 255, 0.03) 2px,
                rgba(58, 134, 255, 0.03) 4px
              )
            `
          }}
        />
        
        {/* Animated star particles */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(60)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
                boxShadow: `0 0 ${2 + Math.random() * 4}px rgba(255, 255, 255, 0.8)`,
                opacity: 0.3 + Math.random() * 0.7
              }}
            />
          ))}
        </div>
        
        {/* Floating nebula clouds */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full opacity-30 blur-3xl"
              style={{
                width: `${200 + Math.random() * 300}px`,
                height: `${200 + Math.random() * 300}px`,
                left: `${-10 + Math.random() * 120}%`,
                top: `${-10 + Math.random() * 120}%`,
                background: `radial-gradient(circle, ${['#FF006E', '#8338EC', '#3A86FF', '#FB5607'][i % 4]}40 0%, transparent 70%)`,
                animation: `nebulaFloat ${15 + Math.random() * 10}s infinite alternate ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Gaming dice cubes */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={`dice-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `diceRoll ${10 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 8}s`,
              }}
            >
              <div
                className="w-6 h-6 border border-[#FF006E]/40 rounded-sm"
                style={{
                  background: `linear-gradient(135deg, rgba(255, 0, 110, 0.2) 0%, rgba(131, 56, 236, 0.1) 100%)`,
                  transform: `scale(${0.8 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`,
                }}
              >
                {/* Dice dots */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {[...Array([1, 4, 3, 6, 2, 5][i % 6])].map((_, j) => (
                    <div
                      key={j}
                      className="absolute w-1 h-1 bg-white/40 rounded-full"
                      style={{
                        top: `${[50, 20, 20, 20, 35, 20][Math.floor(j / [1, 2, 3, 2, 1, 2][i % 6])]}%`,
                        left: `${[50, 30, 30, 30, 50, 30][j % [1, 2, 3, 2, 1, 2][i % 6]]}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Card suit symbols */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(16)].map((_, i) => (
            <div
              key={`suit-${i}`}
              className="absolute text-2xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `suitFloat ${8 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 6}s`,
                color: ['#FF006E', '#8338EC', '#3A86FF', '#FB5607'][i % 4],
                transform: `scale(${0.5 + Math.random() * 0.5})`,
              }}
            >
              {['♠', '♥', '♦', '♣'][i % 4]}
            </div>
          ))}
        </div>
        
        {/* Slot machine reels */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`reel-${i}`}
              className="absolute opacity-35"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `reelSpin ${12 + Math.random() * 10}s infinite linear ${Math.random() * 10}s`,
              }}
            >
              <div
                className="w-8 h-10 border border-[#3A86FF]/40 rounded"
                style={{
                  background: `linear-gradient(180deg, rgba(58, 134, 255, 0.2) 0%, rgba(251, 86, 7, 0.1) 100%)`,
                }}
              >
                <div className="flex flex-col justify-around h-full py-1">
                  {['🍒', '🍋', '🔔', '💎'][i % 4].split('').map((emoji, j) => (
                    <div key={j} className="text-center text-xs">{emoji}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Plasma field overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-50"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 20% 30%,
                transparent 0,
                transparent 10px,
                rgba(255, 0, 110, 0.05) 10px,
                rgba(255, 0, 110, 0.05) 20px
              ),
              repeating-radial-gradient(
                circle at 80% 70%,
                transparent 0,
                transparent 15px,
                rgba(131, 56, 236, 0.05) 15px,
                rgba(131, 56, 236, 0.05) 30px
              )
            `
          }}
        />
      </div>

      {/* Content container with relative positioning */}
      <div className="relative z-10">
      </div>
      
      <div className="mb-12 flex flex-col md:flex-row items-center justify-center relative z-10">
        <div className="text-center md:text-left md:max-w-2xl">
          <HeaderText
            header="Featured Games"
            description="Experience our premium selection of games with the highest payout rates and player counts"
          />
        </div>
        <div className="mt-6 md:mt-0">
          <GameStats />
        </div>
      </div>
      
      {/* Category filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-2xl mx-auto relative z-10">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
              activeCategory === category.id
                ? 'bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white font-medium'
                : 'bg-white/10 text-white/70 hover:bg-[#0066FF]/20'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Carousel container with scroll controls */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Left scroll arrow - only shown when content is scrolled */}
        {showLeftArrow && (
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#001F3F]/90 backdrop-blur-sm hover:bg-[#0066FF]/20 border border-[#00A3FF]/30 h-10 w-10 rounded-full flex items-center justify-center"
            aria-label="Scroll left"
          >
            <FaArrowLeft className="text-white text-sm" />
          </button>
        )}
        
        {/* Right scroll arrow - only shown when more content is available */}
        {showRightArrow && (
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#001F3F]/90 backdrop-blur-sm hover:bg-[#0066FF]/20 border border-[#00A3FF]/30 h-10 w-10 rounded-full flex items-center justify-center"
            aria-label="Scroll right"
          >
            <FaArrowRight className="text-white text-sm" />
          </button>
        )}

        {/* Game cards container */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto custom-scrollbar pb-4 pl-1 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
        >
          <div className="flex gap-4 mx-auto">
            {visibleGames.length > 0 ? (
              visibleGames.map(game => (
                <div key={game.id} className="snap-start">
                  <GameCard game={game} />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center w-full py-10">
                <p className="text-white/70 text-lg">No games found in this category</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dots navigation for mobile - simplified version */}
      <div className="flex gap-1.5 justify-center mt-6 max-w-2xl mx-auto relative z-10">
        {visibleGames.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              pauseAutoPlay();
              if (scrollContainerRef.current) {
                const cardWidth = 410 + 16; // Card width + gap
                scrollContainerRef.current.scrollLeft = index * cardWidth;
              }
            }}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-[#00A3FF] w-4'
                : 'bg-white/30'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* View all games button */}
      <div className="text-center mt-10 max-w-7xl mx-auto relative z-10">
        <Link href="/game">
          <GradientBorderButton className="px-8">
            View All Games
          </GradientBorderButton>
        </Link>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes nebulaFloat {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.1); }
          100% { transform: translate(-20px, 30px) scale(0.9); }
        }
        
        @keyframes diceRoll {
          0% { transform: rotateX(0deg) rotateY(0deg) translate(0, 0); opacity: 0.3; }
          25% { transform: rotateX(180deg) rotateY(90deg) translate(20px, -30px); opacity: 0.6; }
          50% { transform: rotateX(360deg) rotateY(180deg) translate(-15px, 20px); opacity: 0.8; }
          75% { transform: rotateX(540deg) rotateY(270deg) translate(10px, -15px); opacity: 0.5; }
          100% { transform: rotateX(720deg) rotateY(360deg) translate(0, 0); opacity: 0.3; }
        }
        
        @keyframes suitFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-40px) translateX(15px) rotate(90deg); opacity: 0.5; }
          50% { transform: translateY(-60px) translateX(-10px) rotate(180deg); opacity: 0.7; }
          75% { transform: translateY(-30px) translateX(5px) rotate(270deg); opacity: 0.4; }
          100% { transform: translateY(0) translateX(0) rotate(360deg); opacity: 0.3; }
        }
        
        @keyframes reelSpin {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
          25% { transform: translateY(-30px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-60px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-30px) rotate(270deg); opacity: 0.5; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.35; }
        }
      `}</style>
    </div>
  );
};

export default GameCarousel;