'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import GradientBorderButton from './GradientBorderButton';
import EthereumConnectWalletButton from './EthereumConnectWalletButton';

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(1);
  const [animating, setAnimating] = useState(false);
  
  // Auto rotate through steps every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveStep(current => current < 4 ? current + 1 : 1);
        setTimeout(() => setAnimating(false), 300);
      }, 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  const steps = [
    {
      id: 1,
      title: t('how_it_works_section.step1_title'),
      description: t('how_it_works_section.step1_description'),
      emoji: '👛'
    },
    {
      id: 2,
      title: t('how_it_works_section.step2_title'),
      description: t('how_it_works_section.step2_description'),
      emoji: '💰'
    },
    {
      id: 3,
      title: t('how_it_works_section.step3_title'),
      description: t('how_it_works_section.step3_description'),
      emoji: '🎮'
    },
    {
      id: 4,
      title: t('how_it_works_section.step4_title'),
      description: t('how_it_works_section.step4_description'),
      emoji: '🏆'
    },
  ];
  
  const handleStepChange = (stepId) => {
    if (stepId === activeStep) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(stepId);
      setTimeout(() => setAnimating(false), 300);
    }, 300);
  };
  
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Space-themed how it works background */}
      <div className="absolute inset-0 z-0">
        {/* Cosmic quantum field */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(ellipse 25% 35% at 25% 25%, #8338EC 0%, transparent 50%),
              radial-gradient(ellipse 30% 40% at 75% 75%, #3A86FF 0%, transparent 50%),
              radial-gradient(ellipse 20% 30% at 50% 30%, #FF006E 0%, transparent 45%),
              radial-gradient(ellipse 35% 45% at 40% 80%, #FB5607 0%, transparent 40%),
              linear-gradient(135deg, #0a0118 0%, #1a0033 40%, #2d1b69 70%, #0a0118 100%),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(131, 56, 236, 0.08) 3px,
                rgba(131, 56, 236, 0.08) 6px
              ),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(58, 134, 255, 0.08) 3px,
                rgba(58, 134, 255, 0.08) 6px
              ),
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 6px,
                rgba(255, 0, 110, 0.06) 6px,
                rgba(255, 0, 110, 0.06) 9px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 6px,
                rgba(251, 86, 7, 0.06) 6px,
                rgba(251, 86, 7, 0.06) 9px
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px, 60px 60px, 60px 60px',
            animation: 'howCosmicDrift 25s ease-in-out infinite, quantumFieldPulse 18s ease-in-out infinite'
          }}
        />
        
        {/* Quantum starfield */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(90)].map((_, i) => (
            <div
              key={`quantum-star-${i}`}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `quantumTwinkle ${2 + Math.random() * 4}s infinite ${Math.random() * 3}s`,
                boxShadow: `0 0 ${3 + Math.random() * 7}px rgba(255, 255, 255, 0.95)`,
                opacity: 0.5 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
        
        {/* Step-themed cosmic clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/5 left-1/5 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#8338EC]/60 to-[#3A86FF]/50 blur-[180px]" style={{animation: 'stepNebula 24s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/5 right-1/5 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#FF006E]/55 to-[#FB5607]/45 blur-[180px]" style={{animation: 'stepNebula 30s ease-in-out infinite reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-r from-[#3A86FF]/40 to-[#8338EC]/35 blur-[220px]" style={{animation: 'stepCosmicPulse 35s ease-in-out infinite'}}></div>
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#FB5607]/50 to-[#FF006E]/40 blur-[160px]" style={{animation: 'stepNebula 20s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-[#3A86FF]/45 to-[#8338EC]/40 blur-[150px]" style={{animation: 'stepNebula 26s ease-in-out infinite reverse'}}></div>
        </div>
        
        {/* Step indicator circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={`step-circle-${i}`}
              className="absolute rounded-full opacity-40"
              style={{
                width: `${25 + Math.random() * 35}px`,
                height: `${25 + Math.random() * 35}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}60 0%, ${['#3A86FF', '#FF006E', '#FB5607', '#8338EC'][i % 4]}30 70%, transparent 100%)`,
                border: `2px solid ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}50`,
                animation: `stepCirclePulse ${6 + Math.random() * 4}s infinite ease-in-out ${Math.random() * 6}s`,
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <div className="text-white text-xs font-bold">{(i % 4) + 1}</div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Connection lines */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={`connection-${i}`}
              className="absolute opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `connectionFlow ${12 + Math.random() * 8}s infinite linear ${Math.random() * 8}s`,
              }}
            >
              <div
                className="h-0.5"
                style={{
                  width: `${80 + Math.random() * 120}px`,
                  background: `linear-gradient(90deg, transparent 0%, ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}50 50%, transparent 100%)`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Quantum data streams */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 1px,
                rgba(139, 92, 246, 0.3) 1px,
                rgba(139, 92, 246, 0.3) 2px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 18px,
                rgba(168, 85, 247, 0.2) 18px,
                rgba(168, 85, 247, 0.2) 20px
              ),
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 12px,
                rgba(196, 181, 253, 0.15) 12px,
                rgba(196, 181, 253, 0.15) 15px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 12px,
                rgba(109, 40, 217, 0.15) 12px,
                rgba(109, 40, 217, 0.15) 15px
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 70px 70px, 70px 70px',
            animation: 'dataStream 10s linear infinite'
          }}
        />
        
        {/* Progress arrows */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(18)].map((_, i) => (
            <div
              key={`progress-arrow-${i}`}
              className="absolute opacity-35"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `progressArrowMove ${10 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 10}s`,
              }}
            >
              <div
                className="w-0 h-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderBottom: `12px solid ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}`,
                  transform: `rotate(${[45, 135, 225, 315][i % 4]}deg) scale(${0.5 + Math.random() * 0.5})`,
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Process hexagons */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`hexagon-${i}`}
              className="absolute opacity-45"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `hexagonRotate ${8 + Math.random() * 6}s infinite linear ${Math.random() * 8}s`,
              }}
            >
              <div
                className="w-8 h-8"
                style={{
                  background: `linear-gradient(135deg, ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}40 0%, transparent 100%)`,
                  clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                  transform: `scale(${0.8 + Math.random() * 1.2})`,
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Step progression field */}
        <div 
          className="absolute inset-0 opacity-45"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 20% 25%,
                transparent 0,
                transparent 18px,
                rgba(131, 56, 236, 0.12) 18px,
                rgba(131, 56, 236, 0.12) 36px
              ),
              repeating-radial-gradient(
                circle at 80% 75%,
                transparent 0,
                transparent 22px,
                rgba(58, 134, 255, 0.12) 22px,
                rgba(58, 134, 255, 0.12) 44px
              ),
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0,
                transparent 20px,
                rgba(255, 0, 110, 0.1) 20px,
                rgba(255, 0, 110, 0.1) 40px
              ),
              repeating-radial-gradient(
                circle at 35% 85%,
                transparent 0,
                transparent 25px,
                rgba(251, 86, 7, 0.1) 25px,
                rgba(251, 86, 7, 0.1) 50px
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
            animation: 'stepProgressionPulse 20s ease-in-out infinite'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 mr-4"></div>
            <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase">{t('how_it_works_section.header')}</span>
            <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 bg-gradient-to-r from-white via-indigo-400/80 to-cyan-400/80 bg-clip-text text-transparent">
            {t('how_it_works_section.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('how_it_works_section.subtitle')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Step Cards */}
          <div className="space-y-6">
            {steps.map((step) => (
              <div 
                key={step.id}
                className={`group relative cursor-pointer transform transition-all duration-500 ${
                  activeStep === step.id ? 'translate-x-2' : 'hover:translate-x-1'
                }`}
                onClick={() => handleStepChange(step.id)}
              >
                {/* Glow effect for active step */}
                {activeStep === step.id && (
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/30 via-blue-500/30 to-cyan-500/30 rounded-2xl blur-xl"></div>
                )}
                
                <div className={`relative p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
                  activeStep === step.id 
                    ? 'bg-[#1E1B4B]/80 border-indigo-500/40 shadow-2xl shadow-indigo-500/20' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30'
                }`}>
                  <div className="flex items-start gap-4">
                    {/* Step icon */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      activeStep === step.id 
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 scale-110 shadow-lg shadow-indigo-500/50 rotate-3' 
                        : 'bg-white/10 group-hover:bg-white/20'
                    }`}>
                      <span className="text-2xl">{step.emoji}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-bold text-xl transition-all duration-500 ${
                          activeStep === step.id 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400' 
                            : 'text-white group-hover:text-indigo-300'
                        }`}>
                          {step.title}
                        </h3>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-500 ${
                          activeStep === step.id 
                            ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg' 
                            : 'bg-white/10 text-white/60 group-hover:bg-indigo-500/20'
                        }`}>
                          {step.id}
                        </div>
                      </div>
                      <p className={`text-sm leading-relaxed transition-all duration-500 ${
                        activeStep === step.id 
                          ? 'text-white/90' 
                          : 'text-white/60 group-hover:text-white/80'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress indicator for active step */}
                  {activeStep === step.id && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Side - Main Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-w-xl">
              {/* Step navigation dots */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === step.id 
                        ? 'w-12 bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400' 
                        : 'w-2 bg-white/20 hover:bg-indigo-400/50'
                    }`}
                    onClick={() => handleStepChange(step.id)}
                    aria-label={t('how_it_works_section.go_to_step', { step: step.id })}
                  />
                ))}
              </div>
              
              {/* Main feature display */}
              <div className="relative">
                {/* Background effects */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full bg-gradient-to-r from-indigo-500/20 via-blue-500/20 to-cyan-500/20 blur-[120px] animate-pulse"></div>
                  <div className="absolute w-96 h-96 border border-indigo-500/20 rounded-full animate-spin-slow"></div>
                  <div className="absolute w-64 h-64 border border-cyan-500/30 rounded-full animate-spin-slow-reverse"></div>
                </div>
                
                {/* Central display card */}
                <div className="relative flex items-center justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 rounded-3xl blur-lg opacity-50 animate-pulse"></div>
                  <div className="relative bg-[#0F172A]/90 backdrop-blur-2xl border border-indigo-500/20 rounded-3xl p-8 w-[400px] h-[400px] flex flex-col items-center justify-center overflow-hidden">
                    {/* Grid pattern overlay */}
                    <div 
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `
                          repeating-linear-gradient(
                            45deg,
                            transparent,
                            transparent 20px,
                            rgba(255, 255, 255, 0.05) 20px,
                            rgba(255, 255, 255, 0.05) 21px
                          )
                        `
                      }}
                    />
                    
                    {/* Step counter */}
                    <div className="absolute top-6 right-6 px-3 py-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold rounded-full">
                      {t('how_it_works_section.step_counter', { activeStep })}
                    </div>
                    
                    {/* Animated content */}
                    <div className={`relative flex flex-col items-center text-center transform transition-all duration-700 px-6 ${
                      animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`}>
                      {/* Icon with advanced effects */}
                      <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-3xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 p-1 flex items-center justify-center transform hover:rotate-6 transition-all duration-500 shadow-2xl shadow-indigo-500/50">
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 opacity-80"></div>
                          <div className="relative z-10 bg-[#0F172A] rounded-2xl w-full h-full flex items-center justify-center transform hover:scale-110 transition-transform duration-500">
                            <span className="text-7xl drop-shadow-lg">{steps[activeStep-1].emoji}</span>
                          </div>
                        </div>
                        
                        {/* Rotating rings */}
                        <div className="absolute inset-0 w-32 h-32 border-2 border-indigo-500/30 rounded-3xl animate-spin-slow"></div>
                        <div className="absolute inset-2 w-28 h-28 border border-cyan-500/20 rounded-3xl animate-spin-slow-reverse"></div>
                      </div>
                      
                      {/* Text content */}
                      <h3 className="text-white text-2xl font-bold mb-4">
                        {steps[activeStep-1].title}
                      </h3>
                      <p className="text-white/80 leading-relaxed text-base">
                        {steps[activeStep-1].description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="mt-12">
              {activeStep === 1 ? (
                <EthereumConnectWalletButton />
              ) : (
                <div className="group">
                  <GradientBorderButton className="transform hover:scale-105 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                    <div className="flex items-center gap-2">
                      <span className="relative">
                        {activeStep === 2 ? t('how_it_works_section.button_step2') : 
                         activeStep === 3 ? t('how_it_works_section.button_step3') : t('how_it_works_section.button_step4')}
                        <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-400 to-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      </span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </GradientBorderButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes quantumTwinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        
        @keyframes stepNebula {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(80px, -50px) scale(1.25); }
          50% { transform: translate(-60px, 80px) scale(0.85); }
          75% { transform: translate(70px, 70px) scale(1.15); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes stepCosmicPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
            filter: hue-rotate(0deg);
          }
          25% { 
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.6;
            filter: hue-rotate(90deg);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.5;
            filter: hue-rotate(-60deg);
          }
          75% { 
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0.7;
            filter: hue-rotate(120deg);
          }
        }
        
        @keyframes howCosmicDrift {
          0%, 100% { 
            background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 0% 100%, 100% 0%, 50% 100%, 50% 50%, 0 0, 0 0, 0 0;
            transform: translateX(0);
          }
          25% { 
            background-position: 25% 45%, 75% 45%, 55% 5%, 55% 95%, 5% 95%, 95% 5%, 55% 95%, 50% 45%, 20px 0, 20px 20px;
            transform: translateX(25px);
          }
          50% { 
            background-position: 50% 55%, 50% 55%, 60% 10%, 60% 90%, 10% 90%, 90% 10%, 60% 90%, 50% 55%, 40px 0, 40px 40px;
            transform: translateX(-20px);
          }
          75% { 
            background-position: 75% 45%, 25% 45%, 45% 5%, 45% 95%, 5% 85%, 85% 5%, 45% 85%, 50% 45%, 60px 0, 60px 60px;
            transform: translateX(30px);
          }
        }
        
        @keyframes quantumFieldPulse {
          0%, 100% { 
            opacity: 0.9;
            filter: brightness(1) hue-rotate(0deg);
          }
          25% { 
            opacity: 1;
            filter: brightness(1.3) hue-rotate(45deg);
          }
          50% { 
            opacity: 0.8;
            filter: brightness(1.2) hue-rotate(-45deg);
          }
          75% { 
            opacity: 1.1;
            filter: brightness(1.4) hue-rotate(90deg);
          }
        }
        
        @keyframes stepCirclePulse {
          0% { transform: scale(1); opacity: 0.4; }
          25% { transform: scale(1.3); opacity: 0.6; }
          50% { transform: scale(0.9); opacity: 0.5; }
          75% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        
        @keyframes connectionFlow {
          0% { opacity: 0; transform: translateX(-50px) translateY(0); }
          25% { opacity: 0.5; transform: translateX(30px) translateY(-20px); }
          50% { opacity: 0.8; transform: translateX(60px) translateY(20px); }
          75% { opacity: 0.4; transform: translateX(90px) translateY(-10px); }
          100% { opacity: 0; transform: translateX(120px) translateY(0); }
        }
        
        @keyframes progressArrowMove {
          0% { transform: translate(0, 0) rotate(45deg) scale(0.5); opacity: 0.35; }
          25% { transform: translate(30px, -40px) rotate(90deg) scale(0.8); opacity: 0.6; }
          50% { transform: translate(-20px, -60px) rotate(180deg) scale(0.6); opacity: 0.5; }
          75% { transform: translate(40px, -30px) rotate(270deg) scale(0.7); opacity: 0.4; }
          100% { transform: translate(0, 0) rotate(360deg) scale(0.5); opacity: 0.35; }
        }
        
        @keyframes hexagonRotate {
          0% { transform: rotate(0deg) scale(1) translate(0, 0); opacity: 0.45; }
          25% { transform: rotate(90deg) scale(1.2) translate(20px, -20px); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(0.8) translate(-30px, 10px); opacity: 0.6; }
          75% { transform: rotate(270deg) scale(1.1) translate(15px, 25px); opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1) translate(0, 0); opacity: 0.45; }
        }
        
        @keyframes stepProgressionPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.45;
            filter: brightness(1);
          }
          25% { 
            transform: scale(1.08);
            opacity: 0.6;
            filter: brightness(1.4);
          }
          50% { 
            transform: scale(1.04);
            opacity: 0.5;
            filter: brightness(1.2);
          }
          75% { 
            transform: scale(1.06);
            opacity: 0.65;
            filter: brightness(1.3);
          }
        }


        /* Clip paths for quantum shapes */
        .clip-path-crystal {
          clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
        }
        
        .clip-path-diamond {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
        
        .clip-path-star {
          clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
        }
        
        .clip-path-hexagon {
          clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
        }
        
        .clip-path-triangle {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;