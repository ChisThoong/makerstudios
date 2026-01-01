"use client";
import React from 'react';
import { Gamepad2, Palette, Volume1, PencilRuler } from 'lucide-react';
import { useLanguage } from '../context/language-context';
export default function ModernGameCards() {
  const { t } = useLanguage();

  const cards = [
    {
      id: '01',
      icon: Gamepad2,
      title: t('gameCard.gameplay.title'),
      description: t('gameCard.gameplay.desc'),
      animation: 'scroll-left'
    },
    {
      id: '02',
      icon: Palette,
      title: t('gameCard.graphics.title'),
      description: t('gameCard.graphics.desc'),
      animation: 'scroll-right'
    },
    {
      id: '03',
      icon: PencilRuler,
      title: t('gameCard.design.title'),
      description: t('gameCard.design.desc'),
      animation: 'scroll-left'
    },
    {
      id: '04',
      icon: Volume1,
      title: t('gameCard.sound.title'),
      description: t('gameCard.sound.desc'),
      animation: 'scroll-right'
    }
  ];

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.id} className={`group relative scroll-item ${card.animation}`}>
                {/* Subtle glow on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500"></div>
                
                <div className="relative p-8 rounded-3xl border border-gray-200 group-hover:border-blue-400 group-hover:shadow-2xl group-hover:shadow-blue-100 transition-all duration-500 cursor-pointer overflow-hidden">
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl"></div>
                  </div>
                  
                  {/* Number badge */}
                  <div className="absolute right-7 top-7 text-7xl font-extrabold font-bebas text-blue-500 opacity-10 pointer-events-none z-0">
                    {card.id}
                  </div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-blue-200">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600">{card.description}</p>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}