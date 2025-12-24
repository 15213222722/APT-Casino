'use client';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const testimonials = [
    {
      id: 1,
      name: t('testimonials_section.testimonial1_name'),
      avatar: '/images/avatars/avatar1.png',
      rating: 5,
      text: t('testimonials_section.testimonial1_text'),
      game: t('testimonials_section.testimonial1_game'),
      amount: 520
    },
    {
      id: 2,
      name: t('testimonials_section.testimonial2_name'),
      avatar: '/images/avatars/avatar2.png',
      rating: 4,
      text: t('testimonials_section.testimonial2_text'),
      game: t('testimonials_section.testimonial2_game'),
      amount: 1240
    },
    {
      id: 3,
      name: t('testimonials_section.testimonial3_name'),
      avatar: '/images/avatars/avatar3.png',
      rating: 5,
      text: t('testimonials_section.testimonial3_text'),
      game: t('testimonials_section.testimonial3_game'),
      amount: 876
    },
    {
      id: 4,
      name: t('testimonials_section.testimonial4_name'),
      avatar: '/images/avatars/avatar4.png',
      rating: 4,
      text: t('testimonials_section.testimonial4_text'),
      game: t('testimonials_section.testimonial4_game'),
      amount: 340
    }
  ];
  
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);
  
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Space-themed background with cosmic effects */}
      <div className="absolute inset-0 z-0">
        {/* Deep space cosmic grid */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(ellipse 25% 35% at 15% 25%, #FF006E 0%, transparent 50%),
              radial-gradient(ellipse 30% 40% at 85% 75%, #8338EC 0%, transparent 50%),
              radial-gradient(ellipse 20% 30% at 50% 20%, #3A86FF 0%, transparent 45%),
              radial-gradient(ellipse 35% 45% at 30% 80%, #FB5607 0%, transparent 40%),
              linear-gradient(135deg, #0a0118 0%, #1a0033 40%, #2d1b69 70%, #0a0118 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 3px,
                rgba(131, 56, 236, 0.04) 3px,
                rgba(131, 56, 236, 0.04) 6px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(58, 134, 255, 0.04) 3px,
                rgba(58, 134, 255, 0.04) 6px
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 40px 40px, 40px 40px',
            animation: 'cosmicDrift 20s ease-in-out infinite'
          }}
        />
        
        {/* Animated starfield */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(80)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${1 + Math.random() * 3}px`,
                height: `${1 + Math.random() * 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `twinkle ${2 + Math.random() * 4}s infinite ${Math.random() * 3}s`,
                boxShadow: `0 0 ${3 + Math.random() * 6}px rgba(255, 255, 255, 0.9)`,
                opacity: 0.4 + Math.random() * 0.6
              }}
            />
          ))}
        </div>
        
        {/* Cosmic nebula clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/8 left-1/8 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#FF006E]/40 to-[#8338EC]/30 blur-[160px]" style={{animation: 'nebulaFloat 20s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/8 right-1/8 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#3A86FF]/35 to-[#FB5607]/30 blur-[160px]" style={{animation: 'nebulaFloat 25s ease-in-out infinite reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-[#8338EC]/30 to-[#3A86FF]/25 blur-[200px]" style={{animation: 'cosmicPulse 30s ease-in-out infinite'}}></div>
          <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#FB5607]/35 to-[#FF006E]/30 blur-[140px]" style={{animation: 'nebulaFloat 18s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] rounded-full bg-gradient-to-r from-[#3A86FF]/30 to-[#8338EC]/25 blur-[120px]" style={{animation: 'nebulaFloat 22s ease-in-out infinite reverse'}}></div>
        </div>
        
        {/* Floating testimonial cards */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`testimonial-card-${i}`}
              className="absolute rounded-lg opacity-20"
              style={{
                width: `${40 + Math.random() * 60}px`,
                height: `${50 + Math.random() * 70}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, ${['#FF006E', '#8338EC', '#3A86FF', '#FB5607'][i % 4]}20 0%, ${['#8338EC', '#3A86FF', '#FB5607', '#FF006E'][i % 4]}10 100%)`,
                border: `1px solid ${['#FF006E', '#8338EC', '#3A86FF', '#FB5607'][i % 4]}30`,
                animation: `testimonialCardFloat ${8 + Math.random() * 6}s infinite ease-in-out ${Math.random() * 5}s`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Star rating trails */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={`star-trail-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `starTrailFloat ${12 + Math.random() * 8}s infinite linear ${Math.random() * 8}s`,
              }}
            >
              <div className="flex">
                {[...Array(5)].map((_, j) => (
                  <div
                    key={j}
                    className="w-2 h-2 mx-0.5"
                    style={{
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                      background: `rgba(255, 223, 0, ${0.3 + Math.random() * 0.4})`,
                      transform: `scale(${0.5 + Math.random() * 0.5})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Quote bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={`quote-bubble-${i}`}
              className="absolute rounded-full opacity-30"
              style={{
                width: `${30 + Math.random() * 50}px`,
                height: `${30 + Math.random() * 50}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `radial-gradient(circle, ${['#FF006E', '#8338EC', '#3A86FF', '#FB5607'][i % 4]}40 0%, transparent 70%)`,
                animation: `quoteBubbleRise ${10 + Math.random() * 7}s infinite ease-out ${Math.random() * 7}s`,
              }}
            />
          ))}
        </div>
        
        {/* Avatar rings */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={`avatar-ring-${i}`}
              className="absolute rounded-full opacity-50"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${60 + Math.random() * 80}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                border: '2px solid transparent',
                borderTopColor: '#3A86FF',
                borderRightColor: '#8338EC',
                animation: `avatarRingRotate ${6 + Math.random() * 4}s infinite linear ${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
        
        {/* Plasma field overlay */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 15% 25%,
                transparent 0,
                transparent 12px,
                rgba(255, 0, 110, 0.08) 12px,
                rgba(255, 0, 110, 0.08) 24px
              ),
              repeating-radial-gradient(
                circle at 85% 75%,
                transparent 0,
                transparent 18px,
                rgba(131, 56, 236, 0.08) 18px,
                rgba(131, 56, 236, 0.08) 36px
              ),
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0,
                transparent 15px,
                rgba(58, 134, 255, 0.06) 15px,
                rgba(58, 134, 255, 0.06) 30px
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%',
            animation: 'plasmaPulse 15s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Custom styles for animation */}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        
        @keyframes nebulaFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(40px, -30px) scale(1.15); }
          66% { transform: translate(-30px, 40px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes cosmicDrift {
          0%, 100% { 
            background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 0% 100%, 100% 0%, 50% 100%, 50% 50%, 0 0, 0 0;
            transform: translateX(0);
          }
          25% { 
            background-position: 25% 45%, 75% 45%, 55% 5%, 55% 95%, 5% 95%, 95% 5%, 55% 95%, 50% 45%, 10px 0, 10px 10px;
            transform: translateX(15px);
          }
          50% { 
            background-position: 50% 55%, 50% 55%, 60% 10%, 60% 90%, 10% 90%, 90% 10%, 60% 90%, 50% 55%, 20px 0, 20px 20px;
            transform: translateX(-10px);
          }
          75% { 
            background-position: 75% 45%, 25% 45%, 45% 5%, 45% 95%, 5% 85%, 85% 5%, 45% 85%, 50% 45%, 30px 0, 30px 30px;
            transform: translateX(20px);
          }
        }
        
        @keyframes cosmicPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
            filter: hue-rotate(0deg);
          }
          25% { 
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0.5;
            filter: hue-rotate(45deg);
          }
          50% { 
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.4;
            filter: hue-rotate(-30deg);
          }
          75% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.6;
            filter: hue-rotate(60deg);
          }
        }
        
        @keyframes testimonialCardFloat {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.2; }
          25% { transform: translateY(-30px) rotate(5deg) scale(1.05); opacity: 0.3; }
          50% { transform: translateY(-50px) rotate(-3deg) scale(1.1); opacity: 0.25; }
          75% { transform: translateY(-25px) rotate(2deg) scale(1.02); opacity: 0.35; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.2; }
        }
        
        @keyframes starTrailFloat {
          0% { opacity: 0; transform: translateX(-50px); }
          20% { opacity: 0.6; }
          40% { opacity: 0.8; }
          60% { opacity: 0.5; }
          80% { opacity: 0.3; }
          100% { opacity: 0; transform: translateX(calc(100vw + 50px)); }
        }
        
        @keyframes quoteBubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-80px) scale(1.2); opacity: 0.1; }
          100% { transform: translateY(-150px) scale(0.8); opacity: 0; }
        }
        
        @keyframes avatarRingRotate {
          0% { transform: rotate(0deg) scale(1); opacity: 0.5; }
          25% { transform: rotate(90deg) scale(1.1); opacity: 0.7; }
          50% { transform: rotate(180deg) scale(1); opacity: 0.6; }
          75% { transform: rotate(270deg) scale(0.9); opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.5; }
        }
        
        @keyframes plasmaPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.4;
            filter: brightness(1);
          }
          33% { 
            transform: scale(1.1);
            opacity: 0.6;
            filter: brightness(1.2);
          }
          66% { 
            transform: scale(1.05);
            opacity: 0.5;
            filter: brightness(1.1);
          }
        }

        
        @keyframes flowUpward {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.5;
          }
          25% { 
            transform: translate(50px, -80px);
            opacity: 0.7;
          }
          50% { 
            transform: translate(-30px, -120px);
            opacity: 0.6;
          }
          75% { 
            transform: translate(40px, -60px);
            opacity: 0.8;
          }
        }
        
        @keyframes flowDownward {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.45;
          }
          25% { 
            transform: translate(-60px, 90px);
            opacity: 0.65;
          }
          50% { 
            transform: translate(40px, 140px);
            opacity: 0.55;
          }
          75% { 
            transform: translate(-50px, 70px);
            opacity: 0.75;
          }
        }
        
        @keyframes flowCircular {
          0%, 100% { 
            transform: translate(0, 0);
          }
          25% { 
            transform: translate(100px, 0);
          }
          50% { 
            transform: translate(100px, 100px);
          }
          75% { 
            transform: translate(0, 100px);
          }
        }
        
        @keyframes flowDiagonal {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.35;
          }
          25% { 
            transform: translate(80px, -60px);
            opacity: 0.5;
          }
          50% { 
            transform: translate(-40px, -100px);
            opacity: 0.45;
          }
          75% { 
            transform: translate(60px, -80px);
            opacity: 0.6;
          }
        }
        
        @keyframes flowWave {
          0%, 100% { 
            transform: translateX(0) translateY(0) scaleY(1);
          }
          25% { 
            transform: translateX(-40px) translateY(-30px) scaleY(1.1);
          }
          50% { 
            transform: translateX(60px) translateY(-20px) scaleY(0.9);
          }
          75% { 
            transform: translateX(-30px) translateY(-40px) scaleY(1.05);
          }
        }
        
        @keyframes flowLeftRight {
          0%, 100% { 
            transform: translateX(0);
            opacity: 0.4;
          }
          25% { 
            transform: translateX(80px);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(-60px);
            opacity: 0.5;
          }
          75% { 
            transform: translateX(40px);
            opacity: 0.7;
          }
        }
        
        @keyframes flowRightLeft {
          0%, 100% { 
            transform: translateX(0);
            opacity: 0.4;
          }
          25% { 
            transform: translateX(-100px);
            opacity: 0.6;
          }
          50% { 
            transform: translateX(70px);
            opacity: 0.5;
          }
          75% { 
            transform: translateX(-50px);
            opacity: 0.7;
          }
        }
        
        @keyframes flowDiagonalUp {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.35;
          }
          25% { 
            transform: translate(60px, -90px);
            opacity: 0.5;
          }
          50% { 
            transform: translate(-30px, -60px);
            opacity: 0.45;
          }
          75% { 
            transform: translate(40px, -75px);
            opacity: 0.6;
          }
        }
        
        @keyframes flowDiagonalDown {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% { 
            transform: translate(-50px, 80px);
            opacity: 0.45;
          }
          50% { 
            transform: translate(70px, 60px);
            opacity: 0.4;
          }
          75% { 
            transform: translate(-40px, 90px);
            opacity: 0.55;
          }
        }
        
        @keyframes flowCircularPath {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% { 
            transform: translate(80px, 20px);
            opacity: 0.5;
          }
          50% { 
            transform: translate(60px, 100px);
            opacity: 0.4;
          }
          75% { 
            transform: translate(-20px, 80px);
            opacity: 0.6;
          }
        }
        
        @keyframes flowGrid {
          0% { 
            background-position: 0 0, 0 0, 0 0;
            transform: translateX(0);
          }
          25% { 
            background-position: 25px 25px, -25px 25px, 25px -25px;
            transform: translateX(10px);
          }
          50% { 
            background-position: 50px 50px, -50px 50px, 50px -50px;
            transform: translateX(-5px);
          }
          75% { 
            background-position: 25px 75px, -25px 75px, 25px 25px;
            transform: translateX(15px);
          }
          100% { 
            background-position: 0 100px, 0 100px, 0 100px;
            transform: translateX(0);
          }
        }
        
        @keyframes flowRipple {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.35;
          }
          20% { 
            transform: scale(1.15);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1.25);
            opacity: 0.4;
          }
          60% { 
            transform: scale(1.2);
            opacity: 0.6;
          }
          80% { 
            transform: scale(1.1);
            opacity: 0.45;
          }
        }
        
        @keyframes flowParticles {
          0%, 100% { 
            background-position: 0% 0%;
            opacity: 0.2;
          }
          25% { 
            background-position: 25% -20%;
            opacity: 0.4;
          }
          50% { 
            background-position: 50% -40%;
            opacity: 0.3;
          }
          75% { 
            background-position: 75% -20%;
            opacity: 0.5;
          }
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-12 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 mr-4"></div>
            <span className="text-cyan-400 font-semibold tracking-wider text-sm uppercase">{t('testimonials_section.header')}</span>
            <div className="w-12 h-[2px] bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400 ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 bg-gradient-to-r from-white via-cyan-400/80 to-blue-500/80 bg-clip-text text-transparent">
            {t('testimonials_section.title')}
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            {t('testimonials_section.subtitle')}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main testimonial card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-60 scale-110"></div>
            <div className="relative bg-[#0A0F2A]/90 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8 lg:p-10 shadow-2xl">
              {/* Quote decoration */}
              <div className="absolute top-6 right-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-400/30 to-blue-500/30 flex items-center justify-center">
                  <FaQuoteLeft className="text-cyan-400 text-2xl" />
                </div>
              </div>
              
              <div className="flex flex-col h-full">
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    {/* User avatar with ring effect */}
                    <div className="relative mr-5">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md"></div>
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500/40 to-blue-600/40 flex items-center justify-center backdrop-blur-sm border-2 border-cyan-400/30">
                        <span className="text-white text-xl font-bold">{testimonials[activeIndex].name.charAt(0)}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-white text-xl font-semibold mb-2">{testimonials[activeIndex].name}</h3>
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={`${i < testimonials[activeIndex].rating ? 'text-yellow-400' : 'text-white/20'} h-5 w-5 transition-all duration-300`} 
                            />
                          ))}
                        </div>
                        <span className="text-white/40 text-sm">({testimonials[activeIndex].rating}.0)</span>
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-white/90 text-lg leading-relaxed italic mb-6">
                    "{testimonials[activeIndex].text}"
                  </blockquote>
                </div>
                
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-cyan-500/20">
                  <div className="bg-cyan-500/10 rounded-xl p-4 backdrop-blur-sm border border-cyan-500/20">
                    <p className="text-cyan-400/80 text-xs uppercase tracking-wider mb-1">{t('testimonials_section.favorite_game')}</p>
                    <p className="text-white font-bold text-lg">{testimonials[activeIndex].game}</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl p-4 backdrop-blur-sm border border-blue-500/20">
                    <p className="text-blue-400/80 text-xs uppercase tracking-wider mb-1">{t('testimonials_section.biggest_win')}</p>
                    <p className="text-white font-bold text-xl">{testimonials[activeIndex].amount} OCT</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonial list */}
          <div className="space-y-6">
            <div className="mb-8">
              <h3 className="text-white text-2xl font-bold mb-3">{t('testimonials_section.success_stories_title')}</h3>
              <p className="text-white/60 leading-relaxed">{t('testimonials_section.success_stories_subtitle')}</p>
            </div>
            
            <div className="space-y-3">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`group cursor-pointer transition-all duration-300 ${
                    activeIndex === index 
                      ? 'transform scale-[1.02]' 
                      : 'hover:transform hover:scale-[1.01]'
                  }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`p-5 rounded-xl border transition-all duration-300 ${
                    activeIndex === index 
                      ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-indigo-500/20 border-cyan-500/50 shadow-lg shadow-cyan-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyan-500/30'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        {/* Compact avatar */}
                        <div className="relative mr-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                            activeIndex === index
                              ? 'bg-gradient-to-r from-cyan-500/50 to-blue-600/50 ring-2 ring-cyan-400/50'
                              : 'bg-white/10'
                          }`}>
                            <span className={`text-sm font-bold transition-all duration-300 ${
                              activeIndex === index ? 'text-white' : 'text-white/70'
                            }`}>{testimonial.name.charAt(0)}</span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className={`font-medium transition-all duration-300 ${
                              activeIndex === index ? 'text-white text-lg' : 'text-white/80'
                            }`}>{testimonial.name}</p>
                            {activeIndex === index && (
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded-full border border-cyan-500/30">{t('testimonials_section.featured')}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <FaStar 
                                  key={i} 
                                  className={`${i < testimonial.rating ? 'text-yellow-400' : 'text-white/20'} h-4 w-4`} 
                                />
                              ))}
                            </div>
                            <span className="text-white/40 text-sm">• {testimonial.game}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right ml-4">
                        <p className={`font-bold transition-all duration-300 ${
                          activeIndex === index ? 'text-white text-xl' : 'text-white/60'
                        }`}>{testimonial.amount} OCT</p>
                        <p className="text-white/40 text-xs">{t('testimonials_section.won')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Enhanced mobile navigation */}
        <div className="flex justify-center items-center gap-4 mt-12 md:hidden">
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button 
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`transition-all duration-300 ${
                  activeIndex === index 
                    ? 'w-8 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full' 
                    : 'w-2 h-2 bg-white/30 rounded-full hover:bg-cyan-400/50'
                }`}
                aria-label={t('testimonials_section.go_to_testimonial', { index: index + 1 })}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 