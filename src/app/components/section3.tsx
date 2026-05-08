"use client"
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import AnimatedTitleCenter from './ui/animated-title-center';
import { useLanguage } from '../context/language-context';

interface Game {
  _id: string;
  name: string;
  slug: string;
  url: string;
  googlePlayUrl?: string;
  appStoreUrl?: string;
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
  const [loaded, setLoaded] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const itemsRef = useRef<HTMLElement[]>([]);

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

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  useEffect(() => {
    if (games.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveGameIndex((current) => (current + 1) % games.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [games.length]);

  useEffect(() => {
    if (activeGameIndex >= games.length) {
      setActiveGameIndex(0);
    }
  }, [activeGameIndex, games.length]);

  const activeGame = games[activeGameIndex];
  const canSlideGames = games.length > 1;
  const hasStoreDownloads = Boolean(activeGame?.googlePlayUrl || activeGame?.appStoreUrl);
  const activeGameGenres = activeGame
    ? [...(activeGame.categories || []), ...(activeGame.tags || [])].filter(Boolean)
    : [];

  const goToPreviousGame = () => {
    setActiveGameIndex((current) => (current - 1 + games.length) % games.length);
  };

  const goToNextGame = () => {
    setActiveGameIndex((current) => (current + 1) % games.length);
  };

  return (
    <section id="products" className="relative py-24 bg-white overflow-hidden bg-cover bg-center bg-no-repeat "
    style={{
        backgroundImage: "url('/images/bg_6.png')",
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
            {/* <div className="flex justify-center">
              <AnimatedTitleCenter className="my-6">
                {t('stats.title')}
              </AnimatedTitleCenter>
            </div> */}
          </div>
          <h2 
            ref={addToRefs}
            className="scroll-item scroll-up text-5xl sm:text-8xl font-bold text-gray-900 font-bebas text-center"
          >
            {t('stats.heading')}
            <span className="text-blue-600"> {t('stats.headingHighlight')}</span>
          </h2>
        </div>

        {/* Featured Games Slider - Dynamic from API */}
        {loadingGames ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('stats.noGames')}</p>
          </div>
        ) : activeGame ? (
          <div className="relative mb-20">
            <div className="relative min-h-[620px] overflow-hidden rounded-[32px] border border-blue-200/80 bg-white/86 p-4 shadow-[0_24px_70px_rgba(37,99,235,0.18)] backdrop-blur md:min-h-[680px] md:p-8 lg:min-h-[560px]">
              {canSlideGames && (
                <div className="absolute left-0 top-10 bottom-10 w-1 overflow-hidden rounded-r-full bg-blue-100">
                  <div
                    className="w-full rounded-r-full bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.55)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      height: `${100 / games.length}%`,
                      transform: `translateY(${activeGameIndex * 100}%)`,
                    }}
                  />
                </div>
              )}

              <div className="grid min-h-[560px] gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:items-stretch">
                <div className="group relative min-h-[360px] overflow-hidden rounded-[28px] border-4 border-blue-400/80 bg-blue-950 shadow-[0_18px_42px_rgba(37,99,235,0.28)] md:min-h-[440px] lg:min-h-full">
                  <div className="absolute inset-0 overflow-hidden">
                    <div
                      className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ transform: `translateX(-${activeGameIndex * 100}%)` }}
                    >
                      {games.map((game) => (
                        <img
                          key={game._id}
                          src={game.banner || '/images/default-game-banner.jpg'}
                          alt={game.name}
                          className="h-full min-w-full object-cover opacity-95 transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-950/82 via-blue-950/10 to-transparent" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {activeGame.logo && (
                        <img
                          src={activeGame.logo}
                          alt={`${activeGame.name} logo`}
                          className="h-14 w-14 flex-shrink-0 rounded-2xl object-cover shadow-xl ring-2 ring-white/80 md:h-16 md:w-16"
                        />
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-bold  leading-tight text-white drop-shadow md:text-2xl">
                          {activeGame.name}
                        </h3>
                        <a
                          href={activeGame.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700"
                        >
                          {t('stats.access')}
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {canSlideGames && (
                      <div className="hidden items-center gap-2 rounded-full bg-white/20 px-3 py-2 backdrop-blur sm:flex">
                        {games.map((game, index) => (
                          <button
                            key={game._id}
                            type="button"
                            aria-label={`Go to ${game.name}`}
                            onClick={() => setActiveGameIndex(index)}
                            className={`h-2.5 rounded-full transition-all ${
                              index === activeGameIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/55 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden text-center lg:min-h-full lg:items-start lg:text-left">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeGame._id}
                      className="flex w-full flex-col items-center lg:items-start"
                      initial={{ opacity: 0, y: 34 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -34 }}
                      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h3 className="font-bebas text-5xl font-bold uppercase leading-none text-slate-900 md:text-7xl">
                        {activeGame.name}
                      </h3>

                      <div className="mt-5 flex max-w-[560px] flex-wrap justify-center gap-2 lg:justify-start">
                        {(activeGameGenres.length > 0 ? activeGameGenres : [t('stats.headingHighlight')]).map((genre) => (
                          <span
                            key={genre}
                            className="inline-flex items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)]"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 max-w-[560px] rounded-[24px] border border-blue-100 bg-white/78 p-5 text-lg leading-8 text-slate-700 shadow-[0_14px_34px_rgba(37,99,235,0.10)] md:p-6 md:text-xl md:leading-9">
                        {activeGame.description ? (
                          <p>{activeGame.description}</p>
                        ) : (
                          <p>{t('stats.noGames')}</p>
                        )}
                      </div>

                      <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                        {hasStoreDownloads ? (
                          <div className="flex flex-col gap-3 sm:flex-row">
                            {activeGame.googlePlayUrl && (
                              <a
                                href={activeGame.googlePlayUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Download ${activeGame.name} on Google Play`}
                                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-blue-200 bg-white px-4 py-2 shadow-[0_14px_30px_rgba(37,99,235,0.16)] transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_18px_34px_rgba(37,99,235,0.20)]"
                              >
                                <img
                                  src="/images/button_android.png"
                                  alt="Get it on Google Play"
                                  className="h-11 w-auto object-contain md:h-12"
                                />
                              </a>
                            )}

                            {activeGame.appStoreUrl && (
                              <a
                                href={activeGame.appStoreUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Download ${activeGame.name} on the App Store`}
                                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border-2 border-blue-200 bg-white px-4 py-2 shadow-[0_14px_30px_rgba(37,99,235,0.16)] transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-[0_18px_34px_rgba(37,99,235,0.20)]"
                              >
                                <img
                                  src="/images/button_apple.png"
                                  alt="Download on the App Store"
                                  className="h-11 w-auto object-contain md:h-12"
                                />
                              </a>
                            )}
                          </div>
                        ) : (
                          <a
                            href={activeGame.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl bg-blue-600 px-7 py-3 text-base font-bold uppercase text-white shadow-[0_14px_30px_rgba(37,99,235,0.28)] transition hover:bg-blue-700"
                          >
                            {t('stats.access')}
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}

                        {canSlideGames && (
                          <div className="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={goToPreviousGame}
                              className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-2xl border-2 border-blue-200 bg-white text-blue-600 shadow-[0_10px_24px_rgba(37,99,235,0.12)] transition hover:border-blue-400"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              type="button"
                              onClick={goToNextGame}
                              className="inline-flex h-[54px] w-[54px] items-center justify-center rounded-2xl border-2 border-blue-200 bg-white text-blue-600 shadow-[0_10px_24px_rgba(37,99,235,0.12)] transition hover:border-blue-400"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {canSlideGames && (
                    <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
                      {games.map((game, index) => (
                        <button
                          key={game._id}
                          type="button"
                          aria-label={`Go to ${game.name}`}
                          onClick={() => setActiveGameIndex(index)}
                          className={`h-2.5 rounded-full transition-all ${
                            index === activeGameIndex ? 'w-7 bg-blue-600' : 'w-2.5 bg-blue-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">{t('stats.noGames')}</p>
          </div>
        )}
      </div>
    </section>
  );
}
