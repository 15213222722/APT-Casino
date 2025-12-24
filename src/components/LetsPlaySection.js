import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import LaunchGameButton from "./LaunchGameButton";
import EthereumConnectWalletButton from "./EthereumConnectWalletButton";
import { FaUsers, FaTrophy, FaCoins } from "react-icons/fa";

export default function LetsPlaySection() {
  const { t } = useTranslation();

  // Stats with animation
  const [stats, setStats] = useState([
    { icon: <FaUsers className="text-blue-400" />, value: 0, target: 12000, label: t('lets_play_section.players') },
    { icon: <FaTrophy className="text-cyan-400" />, value: 0, target: 25000, label: t('lets_play_section.winners') },
    { icon: <FaCoins className="text-yellow-400" />, value: 0, target: 1000000, label: t('lets_play_section.oct_wagered') }
  ]);
  
  // Animate stats when component mounts
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prevStats => 
        prevStats.map(stat => ({
          ...stat,
          value: stat.value >= stat.target ? stat.target : stat.value + Math.ceil(stat.target / 100)
        }))
      );
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="letsplay" className="relative py-24 md:py-32 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-36 bg-black overflow-hidden">
      {/* Space themed animated background */}
      <div className="absolute inset-0">
        {/* Space gradient background */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"></div>
        
        {/* Stars and nebula */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDuration: "2s"}}></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDuration: "3s", animationDelay: "0.5s"}}></div>
          <div className="absolute bottom-20 left-40 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDuration: "2.5s", animationDelay: "1s"}}></div>
          <div className="absolute top-60 left-60 w-2 h-2 bg-cyan-300 rounded-full animate-pulse" style={{animationDuration: "1.8s"}}></div>
          <div className="absolute bottom-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-pulse" style={{animationDuration: "2.2s", animationDelay: "0.8s"}}></div>
        </div>
        
        {/* Floating golden coins with space effects */}
        <div className="absolute top-10 left-10 w-12 h-12 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/50 animate-bounce" style={{animationDuration: "3s"}}>
          <div className="w-full h-full rounded-full border-2 border-yellow-300 flex items-center justify-center text-yellow-900 font-bold text-xs">$</div>
        </div>
        <div className="absolute top-20 right-20 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/50 animate-bounce" style={{animationDuration: "2.5s", animationDelay: "0.5s"}}>
          <div className="w-full h-full rounded-full border-2 border-yellow-300 flex items-center justify-center text-yellow-900 font-bold text-xs">₿</div>
        </div>
        <div className="absolute bottom-20 left-20 w-14 h-14 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg shadow-yellow-400/50 animate-bounce" style={{animationDuration: "3.5s", animationDelay: "1s"}}>
          <div className="w-full h-full rounded-full border-2 border-yellow-300 flex items-center justify-center text-yellow-900 font-bold text-sm">€</div>
        </div>
        
        {/* Victory fireworks explosions */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 animate-ping" style={{animationDuration: "3s"}}></div>
        <div className="absolute top-1/4 left-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 animate-ping" style={{animationDuration: "3s", animationDelay: "0.3s"}}></div>
        <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-ping" style={{animationDuration: "3s", animationDelay: "0.6s"}}></div>
        
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-400 animate-ping" style={{animationDuration: "3s", animationDelay: "1s"}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-pink-400 animate-ping" style={{animationDuration: "3s", animationDelay: "1.3s"}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-12 h-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 animate-ping" style={{animationDuration: "3s", animationDelay: "1.6s"}}></div>
        
        {/* Applause hands emojis floating */}
        <div className="absolute top-20 left-1/3 text-2xl animate-bounce" style={{animationDuration: "2s"}}>👏</div>
        <div className="absolute top-40 right-1/3 text-3xl animate-bounce" style={{animationDuration: "2.5s", animationDelay: "0.5s"}}>👏</div>
        <div className="absolute bottom-30 left-1/2 text-2xl animate-bounce" style={{animationDuration: "2.2s", animationDelay: "1s"}}>👏</div>
        
        {/* Victory symbols */}
        <div className="absolute top-1/2 left-10 text-4xl font-bold text-yellow-300 animate-pulse" style={{animationDuration: "3s"}}>🏆</div>
        <div className="absolute bottom-20 right-10 text-3xl font-bold text-yellow-300 animate-pulse" style={{animationDuration: "2.5s", animationDelay: "0.8s"}}>⭐</div>
        <div className="absolute top-1/3 right-20 text-3xl font-bold text-yellow-300 animate-pulse" style={{animationDuration: "3.5s", animationDelay: "1.5s"}}>👑</div>
        
        {/* Victory confetti trails */}
        <div className="absolute top-1/4 left-[60%] w-2 h-2 bg-gradient-to-r from-red-400 to-pink-400 animate-pulse" style={{animationDuration: "2s", transform: "rotate(45deg)"}}></div>
        <div className="absolute top-1/3 left-[70%] w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 animate-pulse" style={{animationDuration: "2.5s", animationDelay: "0.5s", transform: "rotate(-45deg)"}}></div>
        <div className="absolute top-1/2 left-[65%] w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse" style={{animationDuration: "2.2s", animationDelay: "1s", transform: "rotate(30deg)"}}></div>
        
        {/* Shooting stars */}
        <div className="absolute top-10 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDuration: "1s"}}></div>
        <div className="absolute top-10 right-1/4 w-8 h-0.5 bg-gradient-to-r from-white/50 to-transparent animate-pulse" style={{animationDuration: "1s", transform: "rotate(-45deg)", transformOrigin: "left center"}}></div>
        <div className="absolute bottom-20 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" style={{animationDuration: "1.2s", animationDelay: "0.5s"}}></div>
        <div className="absolute bottom-20 left-1/4 w-10 h-0.5 bg-gradient-to-r from-white/50 to-transparent animate-pulse" style={{animationDuration: "1.2s", animationDelay: "0.5s", transform: "rotate(45deg)", transformOrigin: "right center"}}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="font-display flex text-white flex-col text-center items-center gap-6 md:gap-8">
          {/* Main heading with gradient text */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300">
            {t('lets_play_section.title')}
          </h1>
          
          {/* Description with improved readability */}
          <h2 className="text-white/90 text-base sm:text-lg max-w-3xl leading-relaxed">
            {t('lets_play_section.description')}
          </h2>
          
          {/* Stats section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl my-8 bg-purple-900/20 p-6 rounded-xl backdrop-blur-sm border border-purple-400/30">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 text-2xl">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold mb-1">
                  {stat.value.toLocaleString()}+
                </div>
                <div className="text-white/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Action buttons with improved layout */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
            <EthereumConnectWalletButton />
            <LaunchGameButton />
          </div>
          
          {/* Additional trust badge */}
          <div className="mt-8 bg-purple-800/30 px-6 py-3 rounded-full text-sm text-white/90 flex items-center gap-2 border border-purple-400/30">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            {t('lets_play_section.trust_badge')}
          </div>
        </div>
      </div>
    </section>
  );
}