'use client';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';

const ProvablyFairSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(1);
  
  const steps = [
    {
      id: 1,
      title: t('provably_fair_section.step1_title'),
      description: t('provably_fair_section.step1_description'),
      icon: 'client-seed',
      code: 'import pythEntropyService from \'@/services/PythEntropyService\';\n\nconst result = await pythEntropyService.generateRandom(\'ROULETTE\', {\n  purpose: \'roulette_spin\',\n  gameType: \'ROULETTE\',\n  betAmount: 0.1\n});'
    },
    {
      id: 2,
      title: t('provably_fair_section.step2_title'),
      description: t('provably_fair_section.step2_description'),
      icon: 'server-seed',
      code: 'const requestId = result.entropyProof.requestId;\nconst randomValue = result.randomValue;\nconst sequenceNumber = result.entropyProof.sequenceNumber;\nconst transactionHash = result.entropyProof.transactionHash;\nconst explorerUrl = result.entropyProof.explorerUrl;'
    },
    {
      id: 3,
      title: t('provably_fair_section.step3_title'),
      description: t('provably_fair_section.step3_description'),
      icon: 'calculation',
      code: '// Verify randomness via Pyth Entropy Explorer\nconsole.log(\'Transaction:\', transactionHash);\nconsole.log(\'Explorer:\', explorerUrl);\nconsole.log(\'Arbiscan:\', `https://sepolia.arbiscan.io/tx/${transactionHash}`);'
    },
    {
      id: 4,
      title: t('provably_fair_section.step4_title'),
      description: t('provably_fair_section.step4_description'),
      icon: 'verification',
      code: '// Game result with Pyth Entropy proof\nconst gameResult = {\n  randomValue: result.randomValue,\n  entropyProof: {\n    requestId: result.entropyProof.requestId,\n    sequenceNumber: result.entropyProof.sequenceNumber,\n    transactionHash: result.entropyProof.transactionHash,\n    explorerUrl: result.entropyProof.explorerUrl,\n    timestamp: result.entropyProof.timestamp\n  }\n};'
    },
  ];
  
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Blockchain Security & Verification background */}
      <div className="absolute inset-0 w-full h-full opacity-90">
        {/* Deep security grid background matching GameCarousel colors */}
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
        
        {/* Blockchain network visualization */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(15)].map((_, i) => (
            <div
              key={`blockchain-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${60 + Math.random() * 80}px`,
                height: `${60 + Math.random() * 80}px`,
                animation: `blockchainPulse ${6 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 3}s`,
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                style={{ opacity: 0.3 }}
              >
                <rect
                  x="10"
                  y="10"
                  width="80"
                  height="80"
                  fill="none"
                  stroke="url(#blockchainGradient)"
                  strokeWidth="2"
                  rx="8"
                />
                <line
                  x1="30"
                  y1="10"
                  x2="30"
                  y2="90"
                  stroke="url(#blockchainGradient)"
                  strokeWidth="1"
                />
                <line
                  x1="70"
                  y1="10"
                  x2="70"
                  y2="90"
                  stroke="url(#blockchainGradient)"
                  strokeWidth="1"
                />
                <line
                  x1="10"
                  y1="30"
                  x2="90"
                  y2="30"
                  stroke="url(#blockchainGradient)"
                  strokeWidth="1"
                />
                <line
                  x1="10"
                  y1="70"
                  x2="90"
                  y2="70"
                  stroke="url(#blockchainGradient)"
                  strokeWidth="1"
                />
                <circle cx="30" cy="30" r="3" fill="url(#blockchainGradient)" />
                <circle cx="70" cy="30" r="3" fill="url(#blockchainGradient)" />
                <circle cx="30" cy="70" r="3" fill="url(#blockchainGradient)" />
                <circle cx="70" cy="70" r="3" fill="url(#blockchainGradient)" />
                <defs>
                  <linearGradient id="blockchainGradient">
                    <stop offset="0%" stopColor="#FF006E" />
                    <stop offset="100%" stopColor="#8338EC" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}
        </div>
        
        {/* Floating security shields */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(12)].map((_, i) => (
            <div
              key={`shield-${i}`}
              className="absolute text-3xl opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `shieldFloat ${18 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 8}s`,
                transform: `scale(${0.3 + Math.random() * 0.4})`,
                color: ['#FF006E', '#8338EC', '#3A86FF', '#00FF88'][i % 4],
              }}
            >
              🛡️
            </div>
          ))}
        </div>
        
        {/* Verification checkmarks */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(16)].map((_, i) => (
            <div
              key={`check-${i}`}
              className="absolute text-2xl opacity-35"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `checkPulse ${8 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 5}s`,
                color: ['#00FF88', '#00D4FF', '#FFD700'][i % 3],
                transform: `scale(${0.4 + Math.random() * 0.3})`,
              }}
            >
              ✓
            </div>
          ))}
        </div>
        
        {/* Lock icons */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(10)].map((_, i) => (
            <div
              key={`lock-${i}`}
              className="absolute text-2xl opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `lockFloat ${20 + Math.random() * 12}s infinite ease-in-out ${Math.random() * 10}s`,
                color: ['#FF006E', '#8338EC', '#3A86FF'][i % 3],
                transform: `scale(${0.5 + Math.random() * 0.3})`,
              }}
            >
              🔒
            </div>
          ))}
        </div>
        
        {/* Transaction hash streams */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(8)].map((_, i) => (
            <div
              key={`hash-${i}`}
              className="absolute text-xs font-mono opacity-25"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: ['#FF006E', '#8338EC', '#3A86FF'][i % 3],
                animation: `hashFlow ${15 + Math.random() * 10}s infinite linear ${Math.random() * 10}s`,
              }}
            >
              {Math.random().toString(16).substring(2, 10)}...{Math.random().toString(16).substring(2, 6)}
            </div>
          ))}
        </div>
        
        {/* Security field overlay */}
        <div 
          className="absolute inset-0 w-full h-full opacity-50"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 20% 30%,
                transparent 0,
                transparent 10px,
                rgba(0, 255, 136, 0.05) 10px,
                rgba(0, 255, 136, 0.05) 20px
              ),
              repeating-radial-gradient(
                circle at 80% 70%,
                transparent 0,
                transparent 15px,
                rgba(255, 0, 110, 0.05) 15px,
                rgba(255, 0, 110, 0.05) 30px
              )
            `
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center mb-8">
          <div className="w-1 h-6 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mr-3"></div>
          <h2 className="text-2xl font-display font-bold text-white">{t('provably_fair_section.title')}</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left explanation column */}
          <div className="lg:col-span-5">
            <div className="p-[1px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl h-full">
              <div className="bg-[#0f172a] rounded-xl p-6 h-full">
                <h3 className="text-white text-xl font-medium mb-4">{t('provably_fair_section.what_is_title')}</h3>
                <p className="text-white/80 mb-6">{t('provably_fair_section.what_is_description')}</p>
                
                <div className="bg-[#1e293b] p-4 rounded-lg mb-6 border-l-2 border-blue-500">
                  <h4 className="text-white font-medium mb-2">{t('provably_fair_section.why_matters_title')}</h4>
                  <ul className="text-white/70 text-sm space-y-2 list-disc pl-4">
                    <li>{t('provably_fair_section.why_matters_feature1')}</li>
                    <li>{t('provably_fair_section.why_matters_feature2')}</li>
                    <li>{t('provably_fair_section.why_matters_feature3')}</li>
                    <li>{t('provably_fair_section.why_matters_feature4')}</li>
                    <li>{t('provably_fair_section.why_matters_feature5')}</li>
                  </ul>
                </div>
                
                <Link href="https://onescan.cc/">
                  <div className="inline-block">
                    <div className="p-[1px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-md inline-block">
                      <button className="bg-[#0f172a] hover:bg-[#1e293b] transition-colors text-white px-6 py-2 rounded-md flex items-center">
                        {t('provably_fair_section.verify_button')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Right steps column */}
          <div className="lg:col-span-7">
            <div className="p-[1px] bg-gradient-to-r from-blue-500/40 to-cyan-400/40 rounded-xl">
              <div className="bg-[#0f172a] rounded-xl p-6">
                <h3 className="text-white text-xl font-medium mb-4">{t('provably_fair_section.how_it_works_title')}</h3>
                
                {/* Steps tabs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
                  {steps.map((step) => (
                    <button
                      key={step.id}
                      className={`p-2 rounded-md text-sm font-medium transition-all text-center ${
                        activeTab === step.id
                          ? 'bg-gradient-to-r from-blue-500/80 to-cyan-400/80 text-white'
                          : 'bg-[#1e293b] text-white/70 hover:text-white'
                      }`}
                      onClick={() => setActiveTab(step.id)}
                    >
                      {t('provably_fair_section.step', { stepId: step.id })}
                    </button>
                  ))}
                </div>
                
                {/* Active tab content */}
                <div className="min-h-[250px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center mb-4">
                      {/* Step icon placeholder - would be actual icons in production */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/60 to-cyan-400/60 flex items-center justify-center mr-4">
                        <span className="text-white font-bold">{activeTab}</span>
                      </div>
                      <h4 className="text-white text-lg font-medium">{steps[activeTab-1].title}</h4>
                    </div>
                    
                    <p className="text-white/80 leading-relaxed mb-8">
                      {steps[activeTab-1].description}
                    </p>
                  </div>
                  
                  {/* Pyth Entropy */}
                  <div className="bg-[#1e293b] rounded-lg p-4 overflow-x-auto">
                    <pre className="text-sm text-cyan-400 font-mono">
                      {steps[activeTab-1].code}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes blockchainPulse {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.2; }
          25% { transform: scale(1.1) rotate(90deg); opacity: 0.4; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
          75% { transform: scale(1.1) rotate(270deg); opacity: 0.3; }
        }
        
        @keyframes shieldFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.3; }
          25% { transform: translateY(-25px) translateX(15px) rotate(90deg) scale(1.1); opacity: 0.5; }
          50% { transform: translateY(-40px) translateX(-10px) rotate(180deg) scale(1.2); opacity: 0.7; }
          75% { transform: translateY(-20px) translateX(5px) rotate(270deg) scale(1.1); opacity: 0.4; }
          100% { transform: translateY(0) translateX(0) rotate(360deg) scale(1); opacity: 0.3; }
        }
        
        @keyframes checkPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; box-shadow: 0 0 5px currentColor; }
          50% { transform: scale(1.3); opacity: 0.6; box-shadow: 0 0 15px currentColor; }
        }
        
        @keyframes lockFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
          33% { transform: translateY(-20px) translateX(10px) rotate(120deg); opacity: 0.4; }
          66% { transform: translateY(-35px) translateX(-5px) rotate(240deg); opacity: 0.3; }
          100% { transform: translateY(0) translateX(0) rotate(360deg); opacity: 0.2; }
        }
        
        @keyframes hashFlow {
          0% { transform: translateY(-20px) translateX(0); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(120vh) translateX(20px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default ProvablyFairSection; 