'use client';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const NewsUpdates = () => {
  const { t, i18n } = useTranslation();
  const newsItems = [
    {
      id: 1,
      title: t('news_updates.bridge_partnership_title'),
      excerpt: t('news_updates.bridge_partnership_excerpt'),
      date: '2025-05-08',
      category: t('news_updates.category_partnership'),
      image: '/images/news/partnership.png',
      url: '/news/token-bridge-partnership'
    },
    {
      id: 2,
      title: t('news_updates.governance_proposal_title'),
      excerpt: t('news_updates.governance_proposal_excerpt'),
      date: '2025-05-04',
      category: t('news_updates.category_governance'),
      image: '/images/news/governance.png',
      url: '/news/community-jackpots'
    },
    {
      id: 3,
      title: t('news_updates.new_games_title'),
      excerpt: t('news_updates.new_games_excerpt'),
      date: '2025-05-03',
      category: t('news_updates.category_platform'),
      image: '/images/news/new-games.png',
      url: '/news/new-games-crash-plinko'
    },
    {
      id: 4,
      title: t('news_updates.security_audit_title'),
      excerpt: t('news_updates.security_audit_excerpt'),
      date: '2025-05-02',
      category: t('news_updates.category_security'),
      image: '/images/news/security.png',
      url: '/news/certik-audit'
    }
  ];
  
  const [activeCategory, setActiveCategory] = useState(t('news_updates.category_all'));
  
  const categories = [t('news_updates.category_all'), t('news_updates.category_platform'), t('news_updates.category_governance'), t('news_updates.category_partnership'), t('news_updates.category_security')];
  
  const filteredNews = activeCategory === t('news_updates.category_all') 
    ? newsItems 
    : newsItems.filter(item => item.category === activeCategory);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(i18n.language, options);
  };
  
  return (
    <section className="py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Space-themed news background */}
      <div className="absolute inset-0 z-0">
        {/* Cosmic grid with star clusters */}
        <div 
          className="absolute inset-0 opacity-90"
          style={{
            background: `
              radial-gradient(ellipse 30% 40% at 20% 30%, #8338EC 0%, transparent 50%),
              radial-gradient(ellipse 25% 35% at 80% 70%, #3A86FF 0%, transparent 50%),
              radial-gradient(ellipse 20% 30% at 50% 25%, #FF006E 0%, transparent 45%),
              radial-gradient(ellipse 35% 45% at 35% 85%, #FB5607 0%, transparent 40%),
              linear-gradient(135deg, #0a0118 0%, #1a0033 40%, #2d1b69 70%, #0a0118 100%),
              repeating-linear-gradient(
                90deg,
                transparent,
                transparent 4px,
                rgba(131, 56, 236, 0.05) 4px,
                rgba(131, 56, 236, 0.05) 8px
              ),
              repeating-linear-gradient(
                0deg,
                transparent,
                transparent 4px,
                rgba(58, 134, 255, 0.05) 4px,
                rgba(58, 134, 255, 0.05) 8px
              ),
              repeating-conic-gradient(
                from 0deg at 50% 50%,
                transparent 0deg,
                rgba(255, 0, 110, 0.04) 30deg,
                transparent 60deg
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50px 50px, 50px 50px, 300% 300%',
            animation: 'cosmicNewsDrift 30s ease-in-out infinite, cosmicRotate 80s linear infinite'
          }}
        />
        
        {/* Dynamic starfield */}
        <div className="absolute inset-0 w-full h-full">
          {[...Array(100)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                width: `${1 + Math.random() * 4}px`,
                height: `${1 + Math.random() * 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `starTwinkle ${1 + Math.random() * 5}s infinite ${Math.random() * 4}s`,
                boxShadow: `0 0 ${4 + Math.random() * 8}px rgba(255, 255, 255, 1)`,
                opacity: 0.5 + Math.random() * 0.5
              }}
            />
          ))}
        </div>
        
        {/* News-themed nebula clouds */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/6 left-1/6 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#8338EC]/50 to-[#3A86FF]/40 blur-[180px]" style={{animation: 'newsNebula 22s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/6 right-1/6 w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#FF006E]/45 to-[#FB5607]/35 blur-[180px]" style={{animation: 'newsNebula 28s ease-in-out infinite reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-r from-[#3A86FF]/35 to-[#8338EC]/30 blur-[220px]" style={{animation: 'newsPulse 35s ease-in-out infinite'}}></div>
          <div className="absolute top-1/5 right-2/5 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-[#FB5607]/40 to-[#FF006E]/35 blur-[160px]" style={{animation: 'newsNebula 20s ease-in-out infinite'}}></div>
          <div className="absolute bottom-1/5 left-2/5 w-[550px] h-[550px] rounded-full bg-gradient-to-r from-[#3A86FF]/35 to-[#8338EC]/30 blur-[150px]" style={{animation: 'newsNebula 25s ease-in-out infinite reverse'}}></div>
        </div>
        
        {/* News article fragments */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={`article-${i}`}
              className="absolute opacity-20"
              style={{
                width: `${60 + Math.random() * 80}px`,
                height: `${80 + Math.random() * 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(180deg, ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}30 0%, ${['#3A86FF', '#FF006E', '#FB5607', '#8338EC'][i % 4]}15 100%)`,
                clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 85%)',
                animation: `articleFloat ${10 + Math.random() * 8}s infinite ease-in-out ${Math.random() * 8}s`,
                transform: `rotate(${Math.random() * 15 - 7.5}deg)`,
              }}
            >
              {/* Article lines */}
              <div className="p-2 space-y-1">
                <div className="h-1 bg-white/20 rounded" style={{width: `${60 + Math.random() * 30}%`}}></div>
                <div className="h-0.5 bg-white/10 rounded" style={{width: `${70 + Math.random() * 20}%`}}></div>
                <div className="h-0.5 bg-white/10 rounded" style={{width: `${50 + Math.random() * 40}%`}}></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* News ticker streams */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
            <div
              key={`ticker-${i}`}
              className="absolute flex items-center opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `tickerStream ${8 + Math.random() * 6}s infinite linear ${Math.random() * 8}s`,
              }}
            >
              <div className="flex">
                {[...Array(8)].map((_, j) => (
                  <div
                    key={j}
                    className="w-1 h-1 mx-0.5"
                    style={{
                      background: `rgba(131, 56, 236, ${0.3 + Math.random() * 0.5})`,
                      transform: `scale(${0.5 + Math.random() * 1})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Category badges */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={`badge-${i}`}
              className="absolute px-2 py-1 rounded-full opacity-25 text-xs font-medium"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `linear-gradient(135deg, ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}60 0%, ${['#3A86FF', '#FF006E', '#FB5607', '#8338EC'][i % 4]}40 100%)`,
                border: `1px solid ${['#8338EC', '#3A86FF', '#FF006E', '#FB5607'][i % 4]}50`,
                animation: `badgeFloat ${12 + Math.random() * 10}s infinite ease-in-out ${Math.random() * 10}s`,
                transform: `rotate(${Math.random() * 20 - 10}deg)`,
              }}
            >
              {['NEWS', 'UPDATE', 'PARTNER', 'SECURITY'][i % 4]}
            </div>
          ))}
        </div>
        
        {/* Calendar particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={`calendar-${i}`}
              className="absolute opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `calendarFloat ${15 + Math.random() * 12}s infinite ease-in-out ${Math.random() * 12}s`,
              }}
            >
              <div
                className="w-6 h-6 border border-[#3A86FF]/40 rounded"
                style={{
                  background: `rgba(58, 134, 255, 0.1)`,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gridTemplateRows: '1fr 1fr',
                  gap: '1px',
                  padding: '1px',
                }}
              >
                {[...Array(4)].map((_, j) => (
                  <div
                    key={j}
                    className="rounded"
                    style={{
                      background: j < 2 ? 'rgba(58, 134, 255, 0.3)' : 'transparent',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Tech grid overlay */}
        <div 
          className="absolute inset-0 opacity-35"
          style={{
            background: `
              repeating-radial-gradient(
                circle at 25% 20%,
                transparent 0,
                transparent 15px,
                rgba(131, 56, 236, 0.1) 15px,
                rgba(131, 56, 236, 0.1) 30px
              ),
              repeating-radial-gradient(
                circle at 75% 80%,
                transparent 0,
                transparent 20px,
                rgba(58, 134, 255, 0.1) 20px,
                rgba(58, 134, 255, 0.1) 40px
              ),
              repeating-radial-gradient(
                circle at 50% 50%,
                transparent 0,
                transparent 18px,
                rgba(255, 0, 110, 0.08) 18px,
                rgba(255, 0, 110, 0.08) 36px
              )
            `,
            backgroundSize: '100% 100%, 100% 100%, 100% 100%',
            animation: 'techGridPulse 18s ease-in-out infinite'
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-400 via-blue-500 to-cyan-400 mr-4"></div>
            <span className="text-indigo-400 font-semibold tracking-wider text-sm uppercase">{t('news_updates.header_title')}</span>
            <div className="w-16 h-[2px] bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 ml-4"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 bg-gradient-to-r from-white via-indigo-400/80 to-cyan-400/80 bg-clip-text text-transparent">
            {t('news_updates.header_subtitle')}
          </h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
            {t('news_updates.header_description')}
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/30 scale-105'
                  : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10 hover:border-indigo-500/30'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {activeCategory === category && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-cyan-600 opacity-0 animate-pulse"></div>
              )}
              <span className="relative z-10">{category}</span>
              {activeCategory === category && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
        
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredNews.map((item) => (
            <Link href={item.url} key={item.id} className="group">
              <div className="relative h-full">
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-2xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500"></div>
                
                <div className="relative bg-[#0F172A]/90 backdrop-blur-xl border border-indigo-500/20 rounded-2xl overflow-hidden hover:border-indigo-400/40 transition-all duration-300 h-full flex flex-col">
                  {/* News Image */}
                  <div className="h-48 relative overflow-hidden">
                    <Image 
                      src={item.image}
                      alt={item.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-all duration-500 group-hover:scale-110"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-60"></div>
                    
                    {/* Category badge */}
                    <div className="absolute bottom-4 left-4">
                      <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-xs font-semibold rounded-full backdrop-blur-sm shadow-lg">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Date */}
                    <div className="flex items-center mb-3">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></div>
                      <p className="text-indigo-300 text-sm font-medium">{formatDate(item.date)}</p>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="text-white/60 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                      {item.excerpt}
                    </p>
                    
                    {/* Read More */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-indigo-400 group-hover:text-cyan-400 transition-colors duration-300">
                        <span className="text-sm font-semibold">{t('news_updates.read_more')}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All News Link */}
        <div className="mt-16 text-center">
          <Link href="/news">
            <div className="group inline-flex items-center">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full opacity-75 group-hover:opacity-100 blur transition-all duration-300"></div>
                <button className="relative px-8 py-4 bg-[#0F172A]/90 backdrop-blur-xl border border-indigo-500/30 rounded-full text-white font-semibold group-hover:border-indigo-400/50 transition-all duration-300 flex items-center gap-3">
                  <span>{t('news_updates.view_all_news')}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Custom animations */}
      <style jsx>{`
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        @keyframes newsNebula {
          0% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(60px, -40px) scale(1.2); }
          50% { transform: translate(-40px, 60px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        
        @keyframes newsPulse {
          0%, 100% { 
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.35;
            filter: hue-rotate(0deg);
          }
          33% { 
            transform: translate(-50%, -50%) scale(1.4);
            opacity: 0.55;
            filter: hue-rotate(60deg);
          }
          66% { 
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.45;
            filter: hue-rotate(-45deg);
          }
        }
        
        @keyframes cosmicNewsDrift {
          0%, 100% { 
            background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 0% 100%, 100% 0%, 50% 100%, 50% 50%, 0 0, 0 0, 0 0;
            transform: translateX(0);
          }
          25% { 
            background-position: 25% 45%, 75% 45%, 55% 5%, 55% 95%, 5% 95%, 95% 5%, 55% 95%, 50% 45%, 15px 0, 15px 15px;
            transform: translateX(20px);
          }
          50% { 
            background-position: 50% 55%, 50% 55%, 60% 10%, 60% 90%, 10% 90%, 90% 10%, 60% 90%, 50% 55%, 30px 0, 30px 30px;
            transform: translateX(-15px);
          }
          75% { 
            background-position: 75% 45%, 25% 45%, 45% 5%, 45% 95%, 5% 85%, 85% 5%, 45% 85%, 50% 45%, 45px 0, 45px 45px;
            transform: translateX(25px);
          }
        }
        
        @keyframes cosmicRotate {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes articleFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
          25% { transform: translateY(-40px) translateX(20px) rotate(2deg); opacity: 0.3; }
          50% { transform: translateY(-60px) translateX(-15px) rotate(-1deg); opacity: 0.25; }
          75% { transform: translateY(-30px) translateX(10px) rotate(1deg); opacity: 0.35; }
          100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
        }
        
        @keyframes tickerStream {
          0% { opacity: 0; transform: translateX(-30px); }
          15% { opacity: 0.5; }
          50% { opacity: 0.8; }
          85% { opacity: 0.4; }
          100% { opacity: 0; transform: translateX(calc(100vw + 30px)); }
        }
        
        @keyframes badgeFloat {
          0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.25; }
          33% { transform: translateY(-50px) rotate(5deg) scale(1.1); opacity: 0.35; }
          66% { transform: translateY(-30px) rotate(-3deg) scale(0.95); opacity: 0.3; }
          100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0.25; }
        }
        
        @keyframes calendarFloat {
          0% { transform: translateY(0) translateX(0) rotate(0deg) scale(1); opacity: 0.4; }
          25% { transform: translateY(-35px) translateX(15px) rotate(90deg) scale(1.1); opacity: 0.6; }
          50% { transform: translateY(-55px) translateX(-20px) rotate(180deg) scale(0.9); opacity: 0.5; }
          75% { transform: translateY(-25px) translateX(10px) rotate(270deg) scale(1.05); opacity: 0.7; }
          100% { transform: translateY(0) translateX(0) rotate(360deg) scale(1); opacity: 0.4; }
        }
        
        @keyframes techGridPulse {
          0%, 100% { 
            transform: scale(1);
            opacity: 0.35;
            filter: brightness(1);
          }
          33% { 
            transform: scale(1.05);
            opacity: 0.5;
            filter: brightness(1.3);
          }
          66% { 
            transform: scale(1.02);
            opacity: 0.4;
            filter: brightness(1.15);
          }
        }
      `}</style>
    </section>
  );
};

export default NewsUpdates; 