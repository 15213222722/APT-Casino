'use client';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FeatureSection() {
  const [imageError, setImageError] = useState(false);
  
  const features = [
    {
      id: 1,
      title: "Transparent & Provably Fair",
      description: "All games use verifiable on-chain randomness through our Pyth Entropy, ensuring complete transparency and fairness in every outcome.",
      icon: "🎲"
    },
    {
      id: 2,
      title: "Cross-Chain Liquidity",
      description: "Stake tokens across multiple chains to earn OCT tokens while playing your favorite games with minimal slippage.",
      icon: "⛓️"
    },
    {
      id: 3,
      title: "No Restrictions",
      description: "Enjoy flexible withdrawals, transparent bonus schemes, and full control over your assets through decentralized management.",
      icon: "🔓"
    }
  ];
  
  useEffect(() => {
    // Auto-rotation removed since activeFeature is no longer used
    return () => {};
  }, []);

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Technology & Innovation background - Digital Circuit Board Theme */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        {/* Deep tech grid background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: `
              radial-gradient(ellipse 20% 30% at 20% 20%, #00D4FF 0%, transparent 50%),
              radial-gradient(ellipse 25% 35% at 80% 80%, #0066FF 0%, transparent 50%),
              radial-gradient(ellipse 30% 40% at 50% 50%, #0099CC 0%, transparent 40%),
              linear-gradient(135deg, #0a0a1a 0%, #0f1a2e 40%, #1a2a4a 70%, #0a0a1a 100%),
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
                rgba(0, 153, 204, 0.03) 2px,
                rgba(0, 153, 204, 0.03) 4px
              )
            `
          }}
        />
        
        {/* Animated circuit pathways */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={`circuit-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${100 + Math.random() * 200}px`,
                height: `${100 + Math.random() * 200}px`,
                animation: `circuitFlow ${20 + Math.random() * 15}s infinite linear ${Math.random() * 10}s`,
              }}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full"
                style={{ opacity: 0.3 }}
              >
                <path
                  d={`M${Math.random() * 50},${Math.random() * 50} L${100 + Math.random() * 50},${Math.random() * 50} L${100 + Math.random() * 50},${100 + Math.random() * 50} L${Math.random() * 50},${100 + Math.random() * 50}`}
                  stroke="url(#circuitGradient)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
                <defs>
                  <linearGradient id="circuitGradient">
                    <stop offset="0%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#0066FF" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>
        
        {/* Data flow particles */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(40)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `dataFlow ${8 + Math.random() * 12}s infinite linear ${Math.random() * 8}s`,
                boxShadow: `0 0 ${4 + Math.random() * 6}px rgba(0, 212, 255, 0.8)`,
              }}
            />
          ))}
        </div>
        
        {/* Hexagonal tech patterns */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`hex-${i}`}
              className="absolute opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `hexFloat ${15 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 5}s`,
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                style={{ transform: `scale(${0.5 + Math.random() * 0.5})` }}
              >
                <polygon
                  points="30,5 50,15 50,35 30,45 10,35 10,15"
                  fill="none"
                  stroke={["#00D4FF", "#0066FF", "#0099CC", "#00CCCC"][i % 4]}
                  strokeWidth="1"
                  opacity="0.6"
                />
              </svg>
            </div>
          ))}
        </div>
        
        {/* Glowing connection nodes */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div
              key={`node-${i}`}
              className="absolute w-3 h-3 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `nodePulse ${3 + Math.random() * 4}s infinite ${Math.random() * 3}s`,
                boxShadow: `0 0 ${8 + Math.random() * 12}px rgba(0, 212, 255, 0.8)`,
              }}
            />
          ))}
        </div>
        
        {/* Binary code streams */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(6)].map((_, i) => (
            <div
              key={`binary-${i}`}
              className="absolute text-xs font-mono opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: ["#00D4FF", "#0066FF", "#0099CC"][i % 3],
                animation: `binaryRain ${10 + Math.random() * 8}s infinite linear ${Math.random() * 10}s`,
              }}
            >
              {Math.random() > 0.5 ? '01' : '10'}
              {Math.random() > 0.5 ? '01' : '10'}
              {Math.random() > 0.5 ? '01' : '10'}
              {Math.random() > 0.5 ? '01' : '10'}
            </div>
          ))}
        </div>
        
        {/* Tech field overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-40"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 25% 25%,
                transparent 0,
                transparent 8px,
                rgba(0, 212, 255, 0.04) 8px,
                rgba(0, 212, 255, 0.04) 16px
              ),
              repeating-radial-gradient(
                circle at 75% 75%,
                transparent 0,
                transparent 12px,
                rgba(0, 102, 255, 0.04) 12px,
                rgba(0, 102, 255, 0.04) 24px
              )
            `
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-12 justify-center">
          <div className="w-1 h-6 bg-gradient-to-r from-[#0066FF] to-[#00A3FF] rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">Key Features of OneArcade</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          {/* Casino Image */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative w-full max-w-md h-[350px] rounded-xl overflow-hidden bg-gradient-to-br from-[#001F3F] to-[#0066FF]">
              {!imageError ? (
                <Image
                  src="/images/casino-players.png"
                  alt="Two casino players enjoying a game of poker"
                  fill
                  className="object-cover rounded-xl"
                  priority
                  unoptimized
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="text-5xl mb-4">🎰</div>
                    <h3 className="text-xl font-medium text-white mb-2">OneArcade</h3>
                    <p className="text-white/70">Experience the future of decentralized gaming</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comparison section */}
          <div className="lg:col-span-7 p-[1px] bg-gradient-to-r from-[#0066FF] to-[#00A3FF] rounded-xl">
            <div className="bg-[#001F3F]/90 backdrop-blur-sm rounded-xl p-6 md:p-8">
              <h3 className="text-white/70 text-sm uppercase tracking-wider mb-3">Traditional vs OneArcade</h3>
              <h4 className="text-white text-2xl font-display font-medium mb-6">A New Era of Fair Gaming</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#001F3F]/50 rounded-lg p-4 border-l-2 border-[#FF4444]/50">
                  <h5 className="text-[#FF6B6B] font-medium mb-2">Traditional Casinos</h5>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#FF6B6B] mr-2">✗</span>
                      <span>Hidden RNG algorithms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF6B6B] mr-2">✗</span>
                      <span>Restrictive withdrawal policies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF6B6B] mr-2">✗</span>
                      <span>Unclear bonus terms</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF6B6B] mr-2">✗</span>
                      <span>Centralized control of funds</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#001F3F]/50 rounded-lg p-4 border-l-2 border-[#00A3FF]/50">
                  <h5 className="text-[#4DA6FF] font-medium mb-2">OneArcade</h5>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li className="flex items-start">
                      <span className="text-[#4CAF50] mr-2">✓</span>
                      <span>Verifiable on-chain randomness</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#4CAF50] mr-2">✓</span>
                      <span>Stake and earn while playing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#4CAF50] mr-2">✓</span>
                      <span>Transparent bonus system</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#4CAF50] mr-2">✓</span>
                      <span>Self-custody of assets</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <p className="text-white/80 text-sm">
                OneArcade leverages One Chain Network Blockchain to provide a transparent, provably fair gaming
                experience with DeFi integration, allowing players to earn passive income through staking.
              </p>
            </div>
          </div>
        </div>
        
        {/* Feature cards with design matching key_featrues_card1.png */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative h-full">
                {/* Card background with gradient border */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/20 to-[#00A3FF]/20 rounded-xl blur-xl group-hover:from-[#0066FF]/40 group-hover:to-[#00A3FF]/40 transition-all duration-300"></div>
                
                {/* Main card */}
                <div className="relative bg-[#001F3F]/90 backdrop-blur-md rounded-xl p-8 h-full border-2 border-[#0066FF]/50 hover:border-[#0066FF]/80 transition-all duration-300 group-hover:transform group-hover:scale-105">
                  
                  {/* Icon container with animated background */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0066FF]/30 to-[#00A3FF]/30 rounded-2xl blur-lg group-hover:from-[#0066FF]/50 group-hover:to-[#00A3FF]/50 transition-all duration-300"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0066FF]/80 to-[#00A3FF]/80 backdrop-blur-sm flex items-center justify-center text-3xl shadow-lg">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-white font-bold text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#0066FF] group-hover:to-[#00A3FF] transition-all duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="h-1 w-20 bg-gradient-to-r from-[#0066FF] to-[#00A3FF] rounded-full opacity-60 group-hover:opacity-100 group-hover:w-32 transition-all duration-300"></div>
                  </div>
                  
                  {/* Corner decorations */}
                  <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-[#0066FF]/50 rounded-tl-lg"></div>
                  <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-[#0066FF]/50 rounded-tr-lg"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-[#0066FF]/50 rounded-bl-lg"></div>
                  <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 border-[#0066FF]/50 rounded-br-lg"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes circuitFlow {
          0% { transform: translateX(-100px) translateY(-100px) rotate(0deg); opacity: 0; }
          25% { opacity: 0.6; }
          50% { transform: translateX(50px) translateY(50px) rotate(180deg); opacity: 1; }
          75% { opacity: 0.6; }
          100% { transform: translateX(200px) translateY(200px) rotate(360deg); opacity: 0; }
        }
        
        @keyframes dataFlow {
          0% { transform: translate(-20px, 20px); opacity: 0; }
          20% { opacity: 0.8; }
          50% { transform: translate(40px, -40px); opacity: 1; }
          80% { opacity: 0.8; }
          100% { transform: translate(100px, 20px); opacity: 0; }
        }
        
        @keyframes hexFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.2; }
          25% { transform: translateY(-30px) translateX(20px) rotate(90deg) scale(1.1); opacity: 0.4; }
          50% { transform: translateY(-50px) translateX(-10px) rotate(180deg) scale(1.2); opacity: 0.6; }
          75% { transform: translateY(-20px) translateX(10px) rotate(270deg) scale(1.1); opacity: 0.3; }
          100% { transform: translateY(0) translateX(0) rotate(360deg) scale(1); opacity: 0.2; }
        }
        
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); opacity: 0.4; box-shadow: 0 0 8px rgba(0, 212, 255, 0.6); }
          50% { transform: scale(1.5); opacity: 1; box-shadow: 0 0 20px rgba(0, 212, 255, 1); }
        }
        
        @keyframes binaryRain {
          0% { transform: translateY(-20px) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(120vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
