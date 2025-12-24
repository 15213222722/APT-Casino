'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import GradientBorderButton from './GradientBorderButton';

const UpcomingTournaments = () => {
  const { t } = useTranslation();
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: t('upcoming_tournaments.poker_championship'),
      game: t('upcoming_tournaments.poker'),
      prizePool: 25000,
      entryFee: 50,
      startsIn: 172800, // 48 hours in seconds
      participants: 68,
      maxParticipants: 100,
      image: '/images/games/poker.png'
    },
    {
      id: 2,
      name: t('upcoming_tournaments.fortune_tiger_tournament'),
      game: t('upcoming_tournaments.fortune_tiger'),
      prizePool: 15000,
      entryFee: 25,
      startsIn: 86400, // 24 hours in seconds
      participants: 112,
      maxParticipants: 200,
      image: '/images/games/fortune-tiger.png'
    },
    {
      id: 3,
      name: t('upcoming_tournaments.roulette_challenge'),
      game: t('upcoming_tournaments.roulette'),
      prizePool: 10000,
      entryFee: 15,
      startsIn: 43200, // 12 hours in seconds
      participants: 87,
      maxParticipants: 150,
      image: '/images/games/roulette.png'
    }
  ]);
  
  // Update countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setTournaments(prev => 
        prev.map(tournament => ({
          ...tournament,
          startsIn: Math.max(0, tournament.startsIn - 1)
        }))
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return t('upcoming_tournaments.started');
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (days > 0) {
      return `${t('upcoming_tournaments.day_format', { count: days })} ${t('upcoming_tournaments.hour_format', { count: hours })} ${t('upcoming_tournaments.minute_format', { count: minutes })}`;
    } else if (hours > 0) {
      return `${t('upcoming_tournaments.hour_format', { count: hours })} ${t('upcoming_tournaments.minute_format', { count: minutes })} ${t('upcoming_tournaments.second_format', { count: remainingSeconds })}`;
    } else {
      return `${t('upcoming_tournaments.minute_format', { count: minutes })} ${t('upcoming_tournaments.second_format', { count: remainingSeconds })}`;
    }
  };
  
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Competition & Arena background - Epic Battle Stadium Theme */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        {/* Arena stadium background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 25% 35% at 30% 25%, #FFD700 0%, transparent 50%),
              radial-gradient(ellipse 30% 40% at 70% 75%, #DC143C 0%, transparent 50%),
              radial-gradient(ellipse 35% 45% at 50% 50%, #4169E1 0%, transparent 40%),
              linear-gradient(135deg, #0d0d1a 0%, #1a0f2e 40%, #2d1b4e 70%, #0d0d1a 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(255, 215, 0, 0.02) 3px,
                rgba(255, 215, 0, 0.02) 6px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(220, 20, 60, 0.02) 3px,
                rgba(220, 20, 60, 0.02) 6px
              )
            `
          }}
        />
        
        {/* Animated arena spotlights */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`spotlight-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                width: `${80 + Math.random() * 120}px`,
                height: `${300 + Math.random() * 200}px`,
                animation: `spotlightSweep ${12 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 6}s`,
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  background: `linear-gradient(to bottom, 
                    rgba(255, 215, 0, 0.15) 0%, 
                    rgba(255, 215, 0, 0.05) 50%, 
                    transparent 100%)`,
                  transform: `rotate(${-30 + Math.random() * 60}deg)`,
                  filter: 'blur(2px)',
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Floating trophy icons */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={`trophy-${i}`}
              className="absolute text-3xl opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `trophyFloat ${15 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 7}s`,
                transform: `scale(${0.4 + Math.random() * 0.4})`,
                color: ['#FFD700', '#DC143C', '#4169E1', '#C0C0C0'][i % 4],
              }}
            >
              🏆
            </div>
          ))}
        </div>
        
        {/* Championship rings */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`ring-${i}`}
              className="absolute opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: '40px',
                height: '40px',
                border: '3px solid',
                borderColor: ['#FFD700', '#DC143C', '#4169E1'][i % 3],
                borderRadius: '50%',
                animation: `ringSpin ${20 + Math.random() * 10}s infinite linear ${Math.random() * 10}s`,
                boxShadow: `0 0 15px ${['rgba(255, 215, 0, 0.6)', 'rgba(220, 20, 60, 0.6)', 'rgba(65, 105, 225, 0.6)'][i % 3]}`,
              }}
            />
          ))}
        </div>
        
        {/* Energy barriers */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={`barrier-${i}`}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${150 + Math.random() * 100}px`,
                height: '2px',
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  ${['#FFD700', '#DC143C', '#4169E1'][i % 3]} 50%, 
                  transparent 100%)`,
                animation: `barrierPulse ${3 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Competitive battle lines */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={`battle-${i}`}
              className="absolute w-px opacity-15"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                height: `${50 + Math.random() * 100}px`,
                background: `linear-gradient(to bottom, 
                  transparent 0%, 
                  ${['#FFD700', '#DC143C', '#4169E1'][i % 3]} 50%, 
                  transparent 100%)`,
                animation: `battleRise ${8 + Math.random() * 6}s infinite ease-out ${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Arena grid pattern */}
        <div 
          className="absolute inset-0 w-full h-full opacity-30"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 20px,
                rgba(255, 215, 0, 0.03) 20px,
                rgba(255, 215, 0, 0.03) 21px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 20px,
                rgba(220, 20, 60, 0.03) 20px,
                rgba(220, 20, 60, 0.03) 21px
              )
            `
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 mr-4"></div>
            <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase">{t('upcoming_tournaments.compete_win')}</span>
            <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 bg-gradient-to-r from-white via-indigo-400/80 to-cyan-400/80 bg-clip-text text-transparent">
            {t('upcoming_tournaments.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('upcoming_tournaments.subtitle')}
          </p>
        </div>
        
        {/* View all link */}
        <div className="flex justify-center mb-12">
          <Link href="/tournaments">
            <div className="group inline-flex items-center gap-2 px-6 py-3 border border-indigo-500/30 rounded-full bg-indigo-500/10 backdrop-blur-sm hover:border-indigo-400/50 hover:bg-indigo-500/20 transition-all duration-300 cursor-pointer">
              <span className="text-indigo-300 group-hover:text-white transition-colors">{t('upcoming_tournaments.view_all')}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-300 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="group relative">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
              
              <div className="relative bg-[#0F172A]/90 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden hover:border-indigo-400/40 transition-all duration-300">
                {/* Header */}
                <div className="relative h-40 p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-blue-600/30"></div>
                  
                  {/* Hexagon pattern overlay */}
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        repeating-linear-gradient(
                          30deg,
                          transparent,
                          transparent 10px,
                          rgba(255, 255, 255, 0.05) 10px,
                          rgba(255, 255, 255, 0.05) 11px
                        )
                      `
                    }}
                  />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-500/80 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                        {tournament.game}
                      </span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <h3 className="text-white text-xl font-bold leading-tight group-hover:text-indigo-300 transition-colors">
                      {tournament.name}
                    </h3>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-500/10 rounded-xl p-3 border border-indigo-500/20">
                      <p className="text-indigo-400 text-xs font-medium mb-1">{t('upcoming_tournaments.prize_pool')}</p>
                      <p className="text-white font-bold text-lg">${tournament.prizePool.toLocaleString()}</p>
                    </div>
                    <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20">
                      <p className="text-cyan-400 text-xs font-medium mb-1">{t('upcoming_tournaments.entry_fee')}</p>
                      <p className="text-white font-bold text-lg">{tournament.entryFee} OCT</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-white/50 text-sm mb-1">{t('upcoming_tournaments.participants')}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white font-semibold">
                          {tournament.participants}/{tournament.maxParticipants}
                        </p>
                        <div className="flex -space-x-1">
                          {[...Array(Math.min(3, tournament.participants))].map((_, i) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400 border-2 border-[#0F172A]"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-1">{t('upcoming_tournaments.starts_in')}</p>
                      <p className="text-white font-bold text-lg">
                        {formatTimeRemaining(tournament.startsIn)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress section */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-white/50 text-sm">{t('upcoming_tournaments.registration_progress')}</p>
                      <p className="text-indigo-400 text-sm font-medium">
                        {Math.round((tournament.participants / tournament.maxParticipants) * 100)}%
                      </p>
                    </div>
                    <div className="w-full h-3 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${(tournament.participants / tournament.maxParticipants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Register button */}
                  <div className="pt-2">
                    <GradientBorderButton classes="w-full group/btn">
                      <div className="w-full text-center font-semibold group-hover/btn:scale-105 transition-transform">
                        {t('upcoming_tournaments.register_now')}
                      </div>
                    </GradientBorderButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes spotlightSweep {
          0% { transform: rotate(-45deg) translateY(-50px); opacity: 0; }
          25% { opacity: 0.6; }
          50% { transform: rotate(45deg) translateY(0px); opacity: 1; }
          75% { opacity: 0.6; }
          100% { transform: rotate(135deg) translateY(50px); opacity: 0; }
        }
        
        @keyframes trophyFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.3; }
          25% { transform: translateY(-30px) translateX(15px) rotate(90deg) scale(1.1); opacity: 0.5; }
          50% { transform: translateY(-50px) translateX(-10px) rotate(180deg) scale(1.2); opacity: 0.7; }
          75% { transform: translateY(-20px) translateX(5px) rotate(270deg) scale(1.1); opacity: 0.4; }
          100% { transform: translateY(0) translateX(0) rotate(360deg) scale(1); opacity: 0.3; }
        }
        
        @keyframes ringSpin {
          0% { transform: scale(1) rotate(0deg); opacity: 0.2; }
          25% { transform: scale(1.3) rotate(90deg); opacity: 0.4; }
          50% { transform: scale(1.5) rotate(180deg); opacity: 0.6; }
          75% { transform: scale(1.3) rotate(270deg); opacity: 0.4; }
          100% { transform: scale(1) rotate(360deg); opacity: 0.2; }
        }
        
        @keyframes barrierPulse {
          0%, 100% { opacity: 0.1; transform: scaleX(0.8); }
          50% { opacity: 0.4; transform: scaleX(1.2); }
        }
        
        @keyframes battleRise {
          0% { transform: translateY(100px); opacity: 0; }
          20% { opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
          80% { opacity: 0.3; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default UpcomingTournaments; 