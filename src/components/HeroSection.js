import { useState, useEffect } from "react";
import LaunchGameButton from "./LaunchGameButton";

export default function HeroSection() {
  const [isDev, setIsDev] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  
  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);
  
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col pt-24 sm:pt-28 md:pt-28 lg:pt-32 relative w-full px-4 sm:px-10 md:px-20 lg:px-36"
    style={{
        backgroundImage: 'url(/images/HeroBackground.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    
    >
      {showAnnouncement && (
        <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-[#0066FF]/10 to-[#00A3FF]/10 backdrop-blur-sm p-3 rounded-lg border border-[#00A3FF]/20 flex justify-center items-center mb-8 mt-8 sm:mt-6">
          <p className="text-sm text-white text-center">
            <span className="bg-[#0066FF] text-white px-2 py-0.5 rounded-md text-xs font-medium mr-2">NEW</span>
            High Roller Tournament starting soon! 10,000 OCT prize pool.
          </p>
          <button 
            onClick={() => setShowAnnouncement(false)}
            className="text-gray-400 hover:text-white transition-colors pl-2 ml-1"
          >
            ✕
          </button>
        </div>
      )}
      
      <div className={
        `font-display capitalize flex text-white flex-col text-center items-center gap-6 z-10 max-w-7xl w-full mx-auto ${showAnnouncement ? '' : 'mt-14 sm:mt-14 md:mt-16'}`
      }>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
          100% On-Chain{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">
          Randomness
          </span>
        </h1>
        <h2 className="text-white/90 mt-4 text-lg sm:text-xl leading-relaxed max-w-3xl">
          <span className="text-[#00A3FF] font-semibold">Autonomous Provably Transparent</span> gaming powered by <span className="text-[#00A3FF] font-semibold">One Chain Network</span> & <span className="text-[#00A3FF] font-semibold">Pyth Entropy</span>. Experience decentralized randomness with cryptographic fairness you can verify, not just trust.
        </h2>
        <p className="text-white/80 text-lg sm:text-xl max-w-3xl">
          No rigged outcomes. No hidden limits. No custody of your funds. 
          <span className="text-[#00A3FF] font-medium"> Just pure, transparent GambleFi</span> where mathematics replaces trust.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <LaunchGameButton />
          
          {/* Additional Quick Links */}
          <div className="flex gap-3 mt-2 sm:mt-0">
           
            <a 
              href="#tournaments" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg border border-[#00A3FF] hover:bg-[#0066FF]/10 transition-all text-sm font-medium text-white/90"
            >
              Tournaments
            </a>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 bg-black/20 backdrop-blur-sm p-6 rounded-xl border border-[#00A3FF]/20">
          <div className="text-center">
            <p className="text-white/80 text-base font-medium">Total Players</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">
              {isDev ? '2,834' : '10,582'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-white/80 text-base font-medium">Jackpot Size</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">
              {isDev ? '15,000' : '37,500'} OCT
            </p>
          </div>
          <div className="text-center hidden sm:block">
            <p className="text-white/80 text-base font-medium">Channel Finality</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">
              ~instant
            </p>
          </div>
          <div className="text-center hidden md:block">
            <p className="text-white/80 text-base font-medium">Provably Fair</p>
            <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#0066FF] to-[#00A3FF]">
              100%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
