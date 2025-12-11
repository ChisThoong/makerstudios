"use client"
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Palette } from 'lucide-react';
import AnimatedTitle from './ui/animated-title';
import AnimatedSplitText from './ui/animated-split-text';
import TypingWords from './ui/typing-words';
import AnimatedTitleCenter from './ui/animated-title-center';
import GameCard from './game-card';

const Section2 = () => {
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);
  const itemsRef = useRef<HTMLElement[]>([]);

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

    // Observe all scroll items
    itemsRef.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    // Set loaded for initial state
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
  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-white py-16 sm:py-24 overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/world-map.png')",
      }}
    >
      {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#e5e9f3] to-white h-50" /> */}
      {/* Decorative Background Elements with Animation */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Floating Particles */}
      {loaded && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { left: 15, top: 25, duration: 6, delay: 1 },
            { left: 85, top: 15, duration: 7, delay: 2 },
            { left: 30, top: 70, duration: 8, delay: 0.5 },
            { left: 70, top: 80, duration: 6.5, delay: 3 },
            { left: 50, top: 40, duration: 7.5, delay: 1.5 },
            { left: 10, top: 60, duration: 9, delay: 2.5 },
            { left: 90, top: 50, duration: 8.5, delay: 0 },
            { left: 60, top: 20, duration: 7, delay: 4 },
          ].map((particle, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20"
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



      <div className="container mx-auto px-6 sm:px-8 max-w-7xl relative z-10">
        <div 
              ref={addToRefs}
              className="scroll-item scroll-up text-center flex items-center gap-4 text-blue-600 font-semibold text-sm sm:text-base"
            >
             
            </div>
            <div className="flex justify-center">
                <AnimatedTitleCenter className="my-6">
                    VỀ CHÚNG TÔI
                </AnimatedTitleCenter>
            </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content - Images */}
          <div className="relative col-span-6 flex gap-4 h-full">
            {/* LEFT IMAGE */}
            <div
                ref={addToRefs}
                className="
                scroll-item scroll-left 
                relative rounded-3xl overflow-hidden 
                shadow-2xl border-4 border-white 
                flex-1 
                transform hover:scale-[1.02] transition-all duration-500
                "
            >
                <img
                src="https://cdn.pixabay.com/photo/2023/07/19/21/23/ai-generated-8137893_640.jpg"
                alt="Main"
                className="w-full h-full object-cover"
                />
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 flex flex-col gap-4">

                {/* TOP SMALL IMAGE */}
                <div
                ref={addToRefs}
                className="
                    scroll-item scroll-down 
                    relative rounded-3xl overflow-hidden 
                    shadow-2xl border-4 border-white 
                    flex-1 
                    transform hover:scale-[1.02] transition-all duration-500
                "
                >
                <img
                    src="https://ex-coders.com/html/xports/assets/img/home-1/about/about-2.png"
                    alt="Side Top"
                    className="w-full h-full object-cover"
                />
                </div>

                {/* BOTTOM SMALL IMAGE */}
                <div
                ref={addToRefs}
                className="
                    scroll-item scroll-up 
                    relative rounded-3xl overflow-hidden 
                    shadow-2xl border-4 border-white 
                    flex-1
                    transform hover:scale-[1.02] transition-all duration-500
                "
                >
                <img
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600"
                    alt="Side Bottom"
                    className="w-full h-full object-cover"
                />
                </div>

            </div>
            </div>

          {/* Right Content - Text */}
          <div className="space-y-6 col-span-6">
            
            <div className="text-5xl sm:text-8xl font-bold text-gray-900 font-bebas text-center sm:text-left">
                MỘT TẬP THỂ
            <div>
                <TypingWords
                words={["ĐAM MÊ", "NHIỆT HUYẾT", "ĐỘT PHÁ"]}
                className="text-blue-600 mt-20"
                />
            </div>
            </div>

            {/* <p 
              ref={addToRefs}
              className="scroll-item scroll-up text-lg text-gray-700 leading-relaxed"
            >
              Maker Studios chuyên phát triển các tựa game 2D với phong cách đồ họa đẹp mắt và lối chơi lôi cuốn.
              Chúng tôi tin rằng sức mạnh của nghệ thuật 2D và thiết kế chỉn chu có thể mang đến những trải nghiệm giải trí đáng nhớ cho mọi người chơi.
            </p> */}

            <p 
              ref={addToRefs}
              className="scroll-item scroll-up text-lg text-gray-700 leading-relaxed"
            >
              Chúng tôi chú trọng xây dựng từng yếu tố cốt lõi : gameplay cuốn hút, 
              đồ họa đẹp mắt, thiết kế chỉn chu và âm thanh sống động. Tất cả được kết hợp hài hòa để mang đến trải nghiệm trọn 
              vẹn và cảm xúc nhất cho người chơi.
            </p>

            <GameCard/>
            
          </div>
        </div>
      </div>
       
      {/* Decorative Circle Pattern with Animation */}
      <div className="absolute bottom-20 right-20 hidden lg:block opacity-10">
        <svg width="200" height="200" viewBox="0 0 200 200">
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
    </section>
  );
};

export default Section2;