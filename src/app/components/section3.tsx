"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Users, Trophy, Gamepad2, Star } from 'lucide-react';
import AnimatedTitleCenter from './ui/animated-title-center';
import { useLanguage } from '../context/language-context';

interface Game {
  _id: string;
  name: string;
  slug: string;
  url: string;
  banner: string;
  logo: string;
  description: string;
  status: string;
  categories: string[];
  tags: string[];
  createdAt: string;
}

export default function StatisticsSection() {
  const { t } = useLanguage();
  const [counts, setCounts] = useState({
    staff: 0,
    games: 0,
    downloads: 0,
    rating: 0
  });

  const [loaded, setLoaded] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const itemsRef = useRef<HTMLElement[]>([]);

  const targets = {
    staff: 20,
    games: 10,
    downloads: 1000000000,
    rating: 4.8
  };

  // Fetch games from API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch('/api/game');
        const data = await res.json();
        
        if (data.success && data.games) {
          // Filter only active games
          const activeGames = data.games.filter((game: Game) => game.status === 'active');
          setGames(activeGames);
        }
      } catch (error) {
        console.error('Failed to fetch games:', error);
      } finally {
        setLoadingGames(false);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    const timer = setTimeout(() => setLoaded(true), 100);

    return () => {
      itemsRef.current.forEach((item) => {
        if (item) observer.unobserve(item);
      });
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const timer = setInterval(() => {
      setCounts(prev => {
        const newCounts = { ...prev };
        let allComplete = true;

        (Object.keys(targets) as Array<keyof typeof targets>).forEach(key => {
          if (prev[key] < targets[key]) {
            allComplete = false;
            const increment = targets[key] / steps;
            newCounts[key] = Math.min(
              prev[key] + increment,
              targets[key]
            );
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return newCounts;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  const formatDownloads = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    return num.toLocaleString();
  };

  const stats = [
    {
      icon: Users,
      value: Math.floor(counts.staff),
      label: t('stats.staff'),
      suffix: '+'
    },
    {
      icon: Gamepad2,
      value: Math.floor(counts.games),
      label: t('stats.games'),
      suffix: '+'
    },
    {
      icon: Trophy,
      value: formatDownloads(counts.downloads),
      label: t('stats.downloads'),
      suffix: '+'
    },
    {
      icon: Star,
      value: counts.rating.toFixed(1),
      label: t('stats.rating'),
      suffix: '/5'
    }
  ];

  return (
    <section className="relative py-24 bg-white overflow-hidden bg-cover bg-center bg-no-repeat "
    style={{
        backgroundImage: "url('/images/service-bg-2.jpg')",
      }}
    >
        <div className="absolute top-5 left-5 hidden lg:block opacity-10">
        <svg width="300" height="300" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="80" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="100" cy="100" r="60" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="360 100 100"
              to="0 100 100"
              dur="15s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="100" cy="100" r="40" stroke="#3B82F6" strokeWidth="2" fill="none" strokeDasharray="5,5">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="10s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

      {/* Floating Particles */}
      {loaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { left: 15, top: 25, duration: 6, delay: 1 },
            { left: 85, top: 15, duration: 7, delay: 2 },
            { left: 30, top: 70, duration: 8, delay: 0.5 },
            { left: 70, top: 80, duration: 6.5, delay: 3 },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full opacity-20"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `float ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div 
            ref={addToRefs}
            className="scroll-item scroll-up inline-flex items-center gap-3 mb-6"
          >
            <div className="flex justify-center">
              <AnimatedTitleCenter className="my-6">
                {t('stats.title')}
              </AnimatedTitleCenter>
            </div>
          </div>
          <h2 
            ref={addToRefs}
            className="scroll-item scroll-up text-5xl sm:text-8xl font-bold text-gray-900 font-bebas text-center"
          >
            {t('stats.heading')}
            <span className="text-blue-600"> {t('stats.headingHighlight')}</span>
          </h2>
        </div>

        {/* Games Grid - Dynamic from API */}
        {loadingGames ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('stats.noGames')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20 ">
            {games.map((game, index) => {
              const animationClass = index % 2 === 0 ? 'scroll-left' : 'scroll-right';
              
              return (
                <div 
                  key={game._id}
                  ref={addToRefs}
                  className={`group relative`}
                >
                  <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-xl hover:shadow-blue-100/50">
                    
                    {/* Game Thumbnail */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
                    
                      <img 
                        src={game.banner || '/images/default-game-banner.jpg'} 
                        alt={game.name}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700"
                      />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      
                      {/* GAME INFO OVERLAY */}
                      <div className="absolute bottom-0 left-0 right-0 px-4 py-3 z-20">
                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                          {/* Game Icon */}
                          {game.logo && (
                            <img
                              src={game.logo}
                              alt={game.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 md:w-14 md:h-14 rounded-xl shadow-lg flex-shrink-0 p-0 m-0"
                            />
                          )}

                          {/* Title + Buttons */}
                          <div className="flex flex-col items-center sm:items-start">
                            <h1 
                              className="text-xl sm:text-2xl md:text-lg font-black text-white leading-tight text-center sm:text-left"
                              style={{
                                textShadow:
                                  '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
                              }}
                            >
                              {game.name.toUpperCase()}
                            </h1>

                            {/* Store Button */}
                            <a
                              href={game.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="
                                inline-flex items-center gap-2 
                                bg-blue-600/90 backdrop-blur 
                                text-white font-semibold 
                                text-sm
                                px-3 py-1 rounded-xl 
                                shadow-md  
                                hover:bg-blue-700 transition-all duration-300
                              "
                            >
                              <span>{t('stats.access')}</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}