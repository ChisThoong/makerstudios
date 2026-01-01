"use client"
import React, { useState, useEffect } from 'react';
import Background from './bg';
import BackgroundMobile from './bg-mobile';
import Characters from './characters';
import SubscribeModal from './subscribe-popup';
import AnimatedTitle from './ui/animated-title';
import AnimatedSplitText from './ui/animated-split-text';
import { useLanguage } from '../context/language-context';

const Section1 = () => {
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const { t } = useLanguage();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [modal, setModal] = useState({
    isOpen: false,
    status: "loading",  // loading | success | error
    message: "",
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  const submitEmail = async () => {
    // Kiểm tra email rỗng
    if (!email.trim()) {
      setModal({
        isOpen: true,
        status: "error",
        message: t('modal.errorEmpty'),
      });
      return;
    }

    // Kiểm tra định dạng email
    if (!emailRegex.test(email)) {
      setModal({
        isOpen: true,
        status: "error",
        message: t('modal.errorInvalid'),
      });
      return;
    }

    // Mở popup loading
    setModal({
      isOpen: true,
      status: "loading",
      message: "",
    });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setModal({
          isOpen: true,
          status: "success",
          message: t('modal.success'),
        });
        setEmail("");
      } else {
        
        let errorMessage = data.message || data.error;
        
        const raw = (data.message || data.error || "").toLowerCase();

        if (raw.includes("already") || raw.includes("exist") || raw.includes("đã tồn tại")) {
          errorMessage = t('modal.errorExists');
        }

        setModal({
          isOpen: true,
          status: "error",
          message: errorMessage,
        });
      }

    } catch (err) {
      setModal({
        isOpen: true,
        status: "error",
        message: t('modal.errorConnection'),
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitEmail();
    }
  };

  return (
    <section className="relative w-full min-h-screen pt-10 flex items-center justify-center overflow-hidden">
      <SubscribeModal
        isOpen={modal.isOpen}
        status={modal.status}
        message={modal.message}
        onClose={() =>
          setModal({ isOpen: false, status: "loading", message: "" })
        }
      />
      {/* Background Component - Full Screen */}
      <div className="fixed inset-0 w-screen h-screen">
        {/* Desktop / Tablet */}
        <div className="hidden sm:block">
          <Background />
        </div>

        {/* Mobile */}
        <div className="block sm:hidden">
          <BackgroundMobile />
        </div>
      </div>
      
      {/* Content Wrapper - center vertical */}
      <div className="relative z-10 w-full flex items-center justify-center mt-0 sm:mt-[-100px]">
        <div className={`container mx-auto px-6 sm:px-8 max-w-7xl transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center py-8 sm:py-0">
            {/* Left Content */}
            <div className={`space-y-4 sm:space-y-6 max-w-xl md:max-w-full transition-all duration-1000 delay-200 ${
              loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              {/* Logo */}
              <div className="flex items-center justify-center sm:justify-start w-full">
                <AnimatedTitle>
                  {t('hero.weAre')}
                </AnimatedTitle>
              </div>
              
              {/* Heading */}
              <AnimatedSplitText 
                text={t('hero.title')}
                className="text-5xl sm:text-8xl font-bold text-gray-900 font-bebas text-center sm:text-left"
              />
                     
              {/* Vietnamese Text */}
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 text-center sm:text-left scroll-item scroll-up">
                {t('hero.welcome')}
              </h2>
              
              {/* Description */}
              <p className="text-base sm:text-lg text-black font-base leading-relaxed text-center sm:text-left scroll-item scroll-up">
                {t('hero.description1')}
              </p>
              
              <p className="text-base sm:text-lg text-black font-base leading-relaxed text-center sm:text-left scroll-item scroll-up">
                {t('hero.description2')}
              </p>
              
              {/* Email Form */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl md:max-w-full text-black scroll-item scroll-up">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t('hero.emailPlaceholder')}
                  className="flex-1 px-4 py-3 sm:px-6 sm:py-4 border-2 text-black border-black/70 rounded-2xl focus:outline-none focus:border-blue-700 text-base sm:text-lg"
                />
                <button
                  onClick={submitEmail}
                  className="px-8 py-3 sm:px-12 sm:py-4 text-lg sm:text-xl bg-blue-700 text-white font-semibold rounded-2xl hover:bg-blue-800 transition-colors">
                  {t('hero.subscribe')}
                </button>
              </div>
            </div>
            
            {/* Right Content - Characters Image */}
            <div className={`scroll-item scroll-right flex items-center justify-center min-h-[550px] sm:min-h-[600px] transition-all duration-1000 delay-300 ${
              loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <Characters />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;