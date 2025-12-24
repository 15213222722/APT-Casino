'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import HeaderText from "@/components/HeaderText";
import Image from "next/image";
import MagicBorder from "./MagicBorder";
import Link from "next/link";
import { FaFire, FaUsers, FaTrophy, FaStar, FaBolt, FaChevronRight } from "react-icons/fa";

const MostPlayed = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleGames, setVisibleGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [featuredGameIndex, setFeaturedGameIndex] = useState(0);
  
  const games = [
    { 
      name: t('most_played.game_roulette'), 
      img: "/images/games/roulette.png", 
      link: "/game/roulette",
      players: 842,
      categories: ["featured", "table"],
      isHot: true,
      winRate: "97.3%",
    },
    { 
      name: t('most_played.game_plinko'), 
      img: "/images/games/plinko.png", 
      link: "/game/plinko",
      players: 534,
      categories: ["instant", "featured"],
      isHot: true,
      winRate: "97.1%",
    },
    { 
      name: t('most_played.game_mines'), 
      img: "/images/games/mines.png", 
      link: "/game/mines",
      players: 456,
      categories: ["featured", "instant"],
      isHot: true,
      winRate: "97.1%",
    },
    { 
      name: t('most_played.game_spin_wheel'), 
      img: "/images/games/spin_the_wheel.png", 
      link: "/game/wheel",
      players: 398,
      categories: ["featured", "instant"],
      isHot: true,
      winRate: "96.8%",
    },
  ];
  
  const filters = [
    { id: "all", label: t('most_played.filter_all') },
    { id: "featured", label: t('most_played.filter_featured') },
    { id: "table", label: t('most_played.filter_table') },
    { id: "slots", label: t('most_played.filter_slots') },
    { id: "card", label: t('most_played.filter_card') },
    { id: "instant", label: t('most_played.filter_instant') },
    { id: "jackpot", label: t('most_played.filter_jackpot') },
  ];
  
  // Filter games when active filter changes
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (activeFilter === "all") {
        setVisibleGames(games);
      } else {
        setVisibleGames(games.filter(game => game.categories.includes(activeFilter)));
      }
      setIsLoading(false);
    }, 300);
  }, [activeFilter]);
  
  // Rotate featured game
  useEffect(() => {
    // Only feature games with "featured" category
    const featuredGames = games.filter(game => game.categories.includes("featured"));
    
    const interval = setInterval(() => {
      setFeaturedGameIndex(prev => (prev + 1) % featuredGames.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const featuredGames = games.filter(game => game.categories.includes("featured"));
  const currentFeaturedGame = featuredGames[featuredGameIndex];
  
  return (
    <section className="w-full h-full relative overflow-hidden">
      {/* Multi-layered animated blue space casino background */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        {/* Deep blue space gradient with stars */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 20% 25% at 25% 15%, #0066FF 0%, transparent 50%),
              radial-gradient(ellipse 30% 35% at 75% 85%, #00A3FF 0%, transparent 50%),
              radial-gradient(ellipse 25% 30% at 50% 50%, #3A86FF 0%, transparent 40%),
              linear-gradient(135deg, #000814 0%, #001D3D 30%, #003566 60%, #000814 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 2px,
                rgba(0, 102, 255, 0.03) 2px,
                rgba(0, 102, 255, 0.03) 4px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 163, 255, 0.03) 2px,
                rgba(0, 163, 255, 0.03) 4px
              )
            `
          }}
        />
        
        {/* Animated star particles */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(80)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 4}s infinite ${Math.random() * 2}s`,
                boxShadow: `0 0 ${2 + Math.random() * 6}px rgba(0, 163, 255, 0.9)`,
                opacity: 0.4 + Math.random() * 0.6
              }}
            />
          ))}
        </div>
        
        {/* Floating nebula clouds with blue theme */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={`nebula-${i}`}
              className="absolute rounded-full opacity-40 blur-3xl"
              style={{
                width: `${200 + Math.random() * 400}px`,
                height: `${200 + Math.random() * 400}px`,
                left: `${-10 + Math.random() * 120}%`,
                top: `${-10 + Math.random() * 120}%`,
                background: `radial-gradient(circle, ${['#0066FF', '#00A3FF', '#3A86FF', '#0077B6'][i % 4]}40 0%, transparent 70%)`,
                animation: `nebulaFloat ${20 + Math.random() * 15}s infinite alternate ${Math.random() * 8}s`,
              }}
            />
          ))}
        </div>
        
        {/* Casino dice with blue glow */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(15)].map((_, i) => (
            <div
              key={`dice-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `diceRoll ${12 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 10}s`,
              }}
            >
              <div
                className="w-6 h-6 border border-[#0066FF]/50 rounded-sm"
                style={{
                  background: `linear-gradient(135deg, rgba(0, 102, 255, 0.3) 0%, rgba(0, 163, 255, 0.1) 100%)`,
                  transform: `scale(${0.8 + Math.random() * 0.8}) rotate(${Math.random() * 360}deg)`,
                  boxShadow: `0 0 ${5 + Math.random() * 10}px rgba(0, 163, 255, 0.5)`
                }}
              >
                {/* Dice dots */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {[...Array([1, 4, 3, 6, 2, 5][i % 6])].map((_, j) => (
                    <div
                      key={j}
                      className="absolute w-1 h-1 bg-white/60 rounded-full"
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
        
        {/* Card suit symbols with blue theme */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={`suit-${i}`}
              className="absolute text-2xl opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `suitFloat ${10 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 8}s`,
                color: ['#0066FF', '#00A3FF', '#3A86FF', '#0077B6'][i % 4],
                transform: `scale(${0.6 + Math.random() * 0.5})`,
                textShadow: `0 0 ${5 + Math.random() * 10}px currentColor`
              }}
            >
              {['♠', '♥', '♦', '♣'][i % 4]}
            </div>
          ))}
        </div>
        
        {/* Slot machine reels with blue theme */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={`reel-${i}`}
              className="absolute opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `reelSpin ${15 + Math.random() * 12}s infinite linear ${Math.random() * 12}s`,
              }}
            >
              <div
                className="w-8 h-10 border border-[#0066FF]/50 rounded"
                style={{
                  background: `linear-gradient(180deg, rgba(0, 102, 255, 0.3) 0%, rgba(0, 163, 255, 0.1) 100%)`,
                  boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(0, 163, 255, 0.6)`
                }}
              >
                <div className="flex flex-col justify-around h-full py-1">
                  {['🎰', '💎', '🌟', '🔵'][i % 4].split('').map((emoji, j) => (
                    <div key={j} className="text-center text-xs">{emoji}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Plasma field overlay with blue theme */}
        <div 
          className="absolute inset-0 w-full h-full opacity-60"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 25% 25%,
                transparent 0,
                transparent 10px,
                rgba(0, 102, 255, 0.08) 10px,
                rgba(0, 102, 255, 0.08) 20px
              ),
              repeating-radial-gradient(
                circle at 75% 75%,
                transparent 0,
                transparent 15px,
                rgba(0, 163, 255, 0.08) 15px,
                rgba(0, 163, 255, 0.08) 30px
              )
            `
          }}
        />
      </div>
      
      <div className="mb-12 text-center max-w-3xl mx-auto relative z-10">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-[#0066FF]/30 shadow-2xl">
          <HeaderText
            header={t('most_played.header_title')}
            description={t('most_played.header_description')}
          />
        </div>
      </div>
      
      {/* Featured Game Spotlight */}
      {currentFeaturedGame && (
        <div className="mb-16 overflow-hidden relative z-10 flex justify-center px-4">
          <div className="w-full max-w-7xl">
            <div className="p-[1px] bg-gradient-to-r from-[#0066FF] to-[#00A3FF] rounded-xl shadow-2xl">
              <div className="bg-black/70 backdrop-blur-lg rounded-xl p-4 md:p-8 border border-[#00A3FF]/20">
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center">
                  <div className="md:w-3/5 relative">
                    <MagicBorder>
                      <div className="aspect-[4/3] w-full relative overflow-hidden rounded-lg">
                        <Image
                          src={currentFeaturedGame.img}
                          alt={currentFeaturedGame.name}
                          fill
                          quality={100}
                          className="rounded-lg object-cover"
                          style={{ objectFit: 'cover' }}
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white text-xs font-bold py-1 px-2 rounded-full flex items-center gap-1 border border-[#00A3FF]/50 shadow-lg shadow-[#00A3FF]/30">
                          <FaFire className="text-yellow-300" /> {t('most_played.top_pick')}
                        </div>
                      </div>
                    </MagicBorder>
                  </div>
                  
                  <div className="md:w-3/5 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                      <h3 className="font-display text-3xl md:text-4xl font-bold text-white">
                        {currentFeaturedGame.name}
                      </h3>
                      {/* Live indicator for specific games */}
                      {(currentFeaturedGame.name === 'Roulette' || currentFeaturedGame.name === 'Plinko' || currentFeaturedGame.name === 'Mines' || currentFeaturedGame.name === 'Spin Wheel') && (
                        <div className="flex items-center gap-1.5 bg-green-900/30 border border-green-500/30 px-2 py-0.5 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-green-400 text-xs font-medium">{t('most_played.live')}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-6">
                      <div className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full text-sm">
                        <FaUsers className="text-green-400" />
                        <span>{t('most_played.players', { count: currentFeaturedGame.players })}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/10 px-4 py-2 rounded-full text-sm">
                        <FaTrophy className="text-yellow-400" />
                        <span>{t('most_played.win_rate', { rate: currentFeaturedGame.winRate })}</span>
                      </div>
                    </div>
                    
                    <p className="text-white/80 mb-8 max-w-3xl text-lg">
                      {t('most_played.featured_game_description', { gameName: currentFeaturedGame.name })}
                    </p>
                    
                    <Link href={typeof currentFeaturedGame.link === 'string' ? currentFeaturedGame.link : `/game/${currentFeaturedGame.name.toLowerCase().replace(/\s+/g, '-')}`}>
                      <button className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] hover:from-[#00A3FF] hover:to-[#0066FF] transition-all duration-300 text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 border border-[#00A3FF]/50 shadow-lg shadow-[#00A3FF]/30">
                        {t('most_played.play_game_now', { gameName: currentFeaturedGame.name })} <FaChevronRight />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Game Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 relative z-10">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-sm border ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white border-[#00A3FF]/50 shadow-lg shadow-[#00A3FF]/30'
                : 'bg-black/40 text-white/70 hover:bg-[#0066FF]/20 border-[#0066FF]/30'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Games Grid with Loading State */}
      <div className={`transition-opacity duration-300 relative z-10 ${isLoading ? 'opacity-50' : 'opacity-100'} px-4`}>
        <div className="flex justify-center max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6 w-full">
            {visibleGames.map((game, i) => (
              <div 
                key={i} 
                className="group relative flex flex-col transition-all duration-300 hover:translate-y-[-8px]"
              >
                <Link href={typeof game.link === 'string' ? game.link : `/game/${game.name.toLowerCase().replace(/\s+/g, '-')}`} className="block w-full">
                  <MagicBorder>
                    <div className="aspect-[1/1] relative overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={game.img}
                        alt={game.name}
                        fill
                        quality={90}
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                        style={{ objectFit: 'cover' }}
                      />
                      
                      {/* Game metrics floating indicators */}
                      <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-xs py-1 px-2 rounded-full flex items-center gap-1.5">
                        <FaUsers className="text-green-400" />
                        <span>{game.players}</span>
                      </div>
                      
                      {game.isHot && (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white text-xs py-1 px-2 rounded-full flex items-center gap-1.5 border border-[#00A3FF]/50">
                          <FaFire className="text-yellow-300" /> {t('most_played.hot')}
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                          <span className="text-xs bg-black/60 backdrop-blur-sm border border-[#00A3FF]/40 px-2 py-1 rounded-full">
                            {t('most_played.rtp', { rate: game.winRate })}
                          </span>
                          <span className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#00A3FF]/50">
                            <FaBolt /> {t('most_played.play')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </MagicBorder>
                  
                  <div className="mt-3 flex flex-col items-center">
                    <div className="flex items-center gap-2 justify-center">
                      <h3 className="font-display text-sm md:text-base font-semibold tracking-wide text-white text-center">
                        {game.name}
                      </h3>
                      {/* Live indicator for specific games */}
                      {(game.name === 'Roulette' || game.name === 'Plinko' || game.name === 'Mines' || game.name === 'Spin Wheel') && (
                        <div className="flex items-center gap-1 bg-green-900/30 border border-green-500/30 px-1.5 py-0.5 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-green-400 text-[10px] font-medium">{t('most_played.live')}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-1 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-[10px]" />
                      ))}
                    </div>
                    <span className="mt-2 inline-block py-1 px-2 text-xs rounded-full bg-gradient-to-r from-red-magic to-blue-magic text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {t('most_played.play_now')}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Empty state if no games found */}
      {!isLoading && visibleGames.length === 0 && (
        <div className="text-center py-12 bg-black/40 backdrop-blur-md rounded-xl border border-[#0066FF]/30 relative z-10">
          <div className="text-white/50 mb-4 text-6xl">🎮</div>
          <h3 className="text-xl text-white mb-2">{t('most_played.no_games_found')}</h3>
          <p className="text-white/70 mb-4">{t('most_played.try_another_category')}</p>
          <button
            onClick={() => setActiveFilter("all")}
            className="bg-gradient-to-r from-[#0066FF] to-[#00A3FF] text-white px-4 py-2 rounded-full text-sm border border-[#00A3FF]/50"
          >
            {t('most_played.view_all_games')}
          </button>
        </div>
      )}
      
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes nebulaFloat {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.2); }
          100% { transform: translate(-30px, 40px) scale(0.8); }
        }
        
        @keyframes diceRoll {
          0% { transform: rotateX(0deg) rotateY(0deg) translate(0, 0); opacity: 0.4; }
          25% { transform: rotateX(180deg) rotateY(90deg) translate(25px, -35px); opacity: 0.7; }
          50% { transform: rotateX(360deg) rotateY(180deg) translate(-20px, 25px); opacity: 0.9; }
          75% { transform: rotateX(540deg) rotateY(270deg) translate(15px, -20px); opacity: 0.6; }
          100% { transform: rotateX(720deg) rotateY(360deg) translate(0, 0); opacity: 0.4; }
        }
        
        @keyframes suitFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-50px) translateX(20px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-70px) translateX(-15px) rotate(180deg); opacity: 0.8; }
          75% { transform: translateY(-40px) translateX(8px) rotate(270deg); opacity: 0.5; }
          100% { transform: translateY(0) translateX(0) rotate(360deg); opacity: 0.4; }
        }
        
        @keyframes reelSpin {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
          25% { transform: translateY(-40px) rotate(90deg); opacity: 0.7; }
          50% { transform: translateY(-80px) rotate(180deg); opacity: 0.9; }
          75% { transform: translateY(-40px) rotate(270deg); opacity: 0.6; }
          100% { transform: translateY(0) rotate(360deg); opacity: 0.4; }
        }
      `}</style>
    </section>
  );
};

export default MostPlayed;