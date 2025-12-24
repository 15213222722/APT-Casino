'use client';

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GradientBorderButton from "./GradientBorderButton";
import { FaLock, FaShieldAlt } from "react-icons/fa";
import { useTranslation, Trans } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  
  const socialLinks = [
    { name: "Twitter", url: "https://twitter.com", icon: "/icons/twitter.svg" },
    { name: "Discord", url: "https://discord.com", icon: "/icons/discord.svg" },
    { name: "Telegram", url: "https://telegram.org", icon: "/icons/telegram.svg" },
    { name: "GitHub", url: "https://github.com", icon: "/icons/github.svg" },
  ];
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() !== "") {
      // In a real app, you would send this to your API
      console.log("Subscribing email:", email);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    }
  };

  const navigationLinks = [
    { key: 'navbar.home', href: '/' },
    { key: 'navbar.game', href: '/game' },
    { key: 'footer.links_bank', href: '/bank' },
    { key: 'footer.links_about_us', href: '/about-us' },
    { key: 'footer.links_faqs', href: '/faqs' }
  ];

  const supportLinks = [
      { key: 'footer.links_contact_us', href: '/contact-us' },
      { key: 'footer.links_privacy_policy', href: '/privacy-policy' },
      { key: 'footer.links_terms_of_service', href: '/terms-of-service' },
      { key: 'footer.links_responsible_gaming', href: '/responsible-gaming' }
  ];

  return (
    <footer id="footer" className="bg-gradient-to-br from-[#0a0a1a] via-[#1a0a2a] to-[#0f0a1f] text-white pt-16 pb-8 relative overflow-hidden">
      {/* Top Divider with animated gradient and neon effect */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="w-full h-0.5 bg-gradient-to-r from-red-magic via-blue-magic to-red-magic bg-[length:200%_auto] animate-gradient animate-neon-flicker"></div>
        <div className="absolute inset-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
      </div>
      
      {/* Animated Starfield Background */}
      <div className="absolute inset-0">
        {/* Moving stars */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 3 + 'px',
                height: Math.random() * 3 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: (Math.random() * 3 + 2) + 's',
                opacity: Math.random() * 0.8 + 0.2,
              }}
            />
          ))}
        </div>
        
        {/* Shooting stars */}
        <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full animate-shooting-star"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-shooting-star" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-30 left-1/4 w-1 h-1 bg-white rounded-full animate-shooting-star" style={{animationDelay: '4s'}}></div>
        
        {/* Nebula clouds */}
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-purple-600/20 blur-[150px] animate-float"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-600/15 blur-[120px] animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-pink-600/10 blur-[100px] animate-float" style={{animationDelay: '1.5s'}}></div>
        
        {/* Casino-themed gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-magic/5 to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-magic/5 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-grid-pattern animate-grid-move"></div>
      </div>

      {/* Footer Content */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 px-6">
        {/* Logo and Description */}
        <div className="md:col-span-4 relative">
          {/* Floating casino chips decoration */}
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-yellow-300 animate-float shadow-lg shadow-yellow-500/30">
            <div className="w-full h-full flex items-center justify-center text-black font-bold text-xs">$</div>
          </div>
          <div className="absolute top-8 -right-8 w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-blue-300 animate-float-delay shadow-lg shadow-blue-500/30" style={{animationDelay: '1s'}}>
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs" >♦</div>
          </div>
          <div className="absolute top-20 -right-6 w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full border-2 border-red-300 animate-float-slow shadow-lg shadow-red-500/30" style={{animationDelay: '2s'}}>
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs">♥</div>
          </div>
          <a href="/" className="logo block mb-6 transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(255,0,100,0.5)]">
            <div className="font-bold text-3xl font-display animate-cosmic-glow bg-gradient-to-r from-white via-blue-magic to-purple-400 bg-clip-text text-transparent">
              {t('navbar.title')}
            </div>
          </a>
          <div className="p-[1px] bg-gradient-to-r from-red-magic/40 via-purple-600/30 to-blue-magic/40 rounded-lg mb-6 hover:from-red-magic hover:via-purple-600/50 hover:to-blue-magic transition-all duration-300 animate-casino-pulse">
            <div className="bg-[#1a0a2a]/80 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-white/80 text-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
          </div>
          
          {/* Social Media Links in a gradient border */}
          <div className="p-[1px] bg-gradient-to-r from-red-magic via-purple-600 to-blue-magic rounded-lg hover:shadow-xl hover:shadow-red-magic/30 transition-all duration-300 animate-casino-pulse">
            <div className="bg-[#1a0a2a]/85 backdrop-blur-sm rounded-lg p-4 flex justify-between">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={social.name}
                  className="group transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_15px_rgba(255,0,100,0.6)]"
                >
                  <div className="w-10 h-10 flex items-center justify-center bg-[#250020]/80 rounded-full border border-white/10 group-hover:bg-gradient-to-r group-hover:from-red-magic group-hover:to-blue-magic group-hover:border-transparent transition-all duration-300 group-hover:animate-neon-flicker">
                    <Image 
                      src={social.icon} 
                      alt={social.name} 
                      width={20} 
                      height={20} 
                      className="filter invert group-hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]"
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="md:col-span-2 md:ml-8">
          <div className="mb-3 flex items-center">
            <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
            <h3 className="font-display text-lg">{t('footer.navigation')}</h3>
          </div>
          <ul className="space-y-3 mt-4">
            {navigationLinks.map((item) => (
              <li key={item.key}>
                <Link 
                  href={item.href}
                  className="text-white/70 hover:text-white flex items-center transition-all group"
                >
                  <span className="w-0 h-[1px] magic-gradient mr-0 group-hover:w-2 group-hover:mr-2 transition-all"></span>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div className="md:col-span-2">
          <div className="mb-3 flex items-center">
            <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
            <h3 className="font-display text-lg">{t('footer.support')}</h3>
          </div>
          <ul className="space-y-3 mt-4">
            {supportLinks.map((item) => (
              <li key={item.key}>
                <Link 
                  href={item.href}
                  className="text-white/70 hover:text-white flex items-center transition-all group"
                >
                  <span className="w-0 h-[1px] magic-gradient mr-0 group-hover:w-2 group-hover:mr-2 transition-all"></span>
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Security Badges */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-sm font-medium mb-3 text-white/90 flex items-center">
              <FaShieldAlt className="mr-2 text-green-500" /> {t('footer.security_trust')}
            </h3>
            <div className="flex flex-wrap gap-2">
              <div className="bg-[#1a0a2a]/60 p-1.5 rounded-md flex items-center gap-1.5 text-xs text-white/80 border border-white/10">
                <FaLock className="text-green-500" /> {t('footer.ssl_secured')}
              </div>
              <div className="bg-[#1a0a2a]/60 p-1.5 rounded-md flex items-center gap-1.5 text-xs text-white/80 border border-white/10">
                <FaShieldAlt className="text-blue-magic" /> {t('footer.provably_fair')}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter and CTA */}
        <div className="md:col-span-4">
          <div className="mb-3 flex items-center">
            <div className="w-1 h-4 magic-gradient rounded-full mr-2"></div>
            <h3 className="font-display text-lg">{t('footer.stay_updated')}</h3>
          </div>
          
          <div className="mt-4 p-[1px] bg-gradient-to-r from-red-magic via-purple-600 to-blue-magic rounded-lg shadow-xl transition-all hover:shadow-red-magic/40 hover:shadow-2xl animate-casino-pulse">
            <div className="bg-[#1a0a2a]/85 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <p className="text-white/70 text-sm mb-3">
                {t('footer.subscribe_promo')}
              </p>
              
              <form onSubmit={handleSubscribe} className="relative">
                <div className="flex gap-2 mb-2">
                  <input 
                    type="email" 
                    placeholder={t('footer.subscribe_placeholder')} 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-[#1a0a2a]/60 border border-white/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-magic focus:ring-2 focus:ring-blue-magic/30 transition-all backdrop-blur-sm"
                    required
                  />
                  <GradientBorderButton type="submit" className="hover:scale-105 transition-transform">
                    {t('footer.subscribe_button')}
                  </GradientBorderButton>
                </div>
                
                {isSubscribed && (
                  <div className="text-green-500 text-xs animate-fadeIn absolute bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                    🎉 {t('footer.subscribe_success')}
                  </div>
                )}
              </form>
              
              <div className="flex justify-center mt-6">
                <Link href="/game" className="w-full">
                  <button className="w-full magic-gradient hover:opacity-90 transition-all text-white font-display py-3 px-6 rounded-md hover:shadow-xl hover:shadow-red-magic/40 hover:scale-105 transform animate-cosmic-glow">
                    🎰 {t('footer.launch_game')}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Divider and Legal */}
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="mt-12 mb-6 relative">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <div className="absolute inset-0 h-[1px] bg-gradient-to-r from-transparent via-blue-magic/30 to-transparent animate-pulse"></div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-white/60 hover:text-white/80 transition-colors">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </div>
          
          <div className="text-xs text-white/50 flex gap-4">
            <a href="/terms" className="hover:text-blue-magic transition-colors hover:drop-shadow-[0_0_5px_rgba(0,100,255,0.6)]">{t('footer.links_terms')}</a>
            <span className="text-white/20">|</span>
            <a href="/privacy" className="hover:text-blue-magic transition-colors hover:drop-shadow-[0_0_5px_rgba(0,100,255,0.6)]">{t('footer.links_privacy')}</a>
            <span className="text-white/20">|</span>
            <a href="/cookies" className="hover:text-blue-magic transition-colors hover:drop-shadow-[0_0_5px_rgba(0,100,255,0.6)]">{t('footer.links_cookies')}</a>
            <span className="text-white/20">|</span>
            <a href="/responsible-gaming" className="hover:text-red-magic transition-colors hover:drop-shadow-[0_0_5px_rgba(255,0,100,0.6)]">{t('footer.links_play_responsibly')}</a>
          </div>
        </div>
        
        {/* Compliance Statement */}
        <div className="text-xs text-white/40 text-center mt-6 p-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
          <Trans i18nKey="footer.compliance_statement">
            OneArcade encourages responsible gaming. Please play responsibly and only with funds you can afford to lose.
            Gambling can be addictive. If you need help or advice, please visit <a href="/responsible-gaming" className="underline text-blue-magic hover:text-blue-magic/80 transition-colors hover:drop-shadow-[0_0_3px_rgba(0,100,255,0.8)]">Responsible Gaming</a>.
          </Trans>
        </div>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a1a]/80 to-transparent pointer-events-none"></div>
      
      {/* Floating light rays */}
      <div className="absolute top-0 left-1/4 w-1 h-32 bg-gradient-to-b from-white/20 to-transparent transform rotate-45 animate-pulse"></div>
      <div className="absolute top-0 right-1/4 w-1 h-24 bg-gradient-to-b from-blue-magic/20 to-transparent transform -rotate-45 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-0 left-1/3 w-1 h-20 bg-gradient-to-t from-red-magic/20 to-transparent transform rotate-12 animate-pulse" style={{animationDelay: '2s'}}></div>
    </footer>
  );
}
