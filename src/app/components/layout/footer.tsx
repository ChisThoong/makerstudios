"use client"
import React, { useState } from 'react';
import { Mail, Phone, Facebook, Twitter, Youtube, Instagram, ArrowRight, Calendar } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useLanguage } from '../../context/language-context';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  const handleSubmit = () => {
    if (email && agreed) {
      alert('Subscribed successfully!');
      setEmail('');
      setAgreed(false);
    }
  };

  const quickLinks = [
    { label: t('footer.quickLinks.home'), href: '/' },
    { label: t('footer.quickLinks.products'), href: '/san-pham' },
    { label: t('footer.quickLinks.careers'), href: '/tuyen-dung' },
    { label: t('footer.quickLinks.news'), href: '/blog' },
    { label: t('footer.quickLinks.contact'), href: '/lien-he' },
  ];

  return (
    <footer className="relative bg-black/90 text-white">
      {/* CTA Banner */}
      <div className="relative max-w-7xl mx-auto">
        <div
          className="
            rounded-4xl bg-gradient-to-r from-blue-700 to-blue-600 
            py-12 px-6 md:px-12
            shadow-xl
            relative z-20
            -translate-y-16 md:-translate-y-20  
          "
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left */}
            <div className="flex items-center gap-6">
              <div className="hidden md:block w-36 h-36 rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop" 
                  alt="IT Specialist"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">{t('footer.cta.title1')}</h2>
                <h3 className="text-2xl md:text-3xl font-bold">{t('footer.cta.title2')}</h3>
              </div>
            </div>

            {/* Button */}
            <button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-full hover:bg-white/90 transition-all hover:gap-3 group">
              {t('footer.cta.button')}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />                
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-4 scroll-item scroll-up">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <img 
              src="/images/logo.svg" 
              alt="Maker Studios Logo"
              className="w-18 h-18 object-contain"
            />
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.company.desc')}
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/makerstudiosgg" target="_blank" className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                <Youtube size={18} />
              </a>
              <a href="#" className="w-10 h-10 border border-gray-600 rounded-lg hover:bg-blue-600 hover:border-blue-600 transition-colors flex items-center justify-center">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <ArrowRight size={16} className="text-blue-600" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.recentPosts')}</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=100&h=100&fit=crop" 
                  alt="Post" 
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div>
                  <p className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Calendar size={16} className="text-blue-600" />
                    15th April, 2024
                  </p>
                  <h4 className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer">
                    Top 5 Most Famous Technology Trend In 2024
                  </h4>
                </div>
              </div>
              <div className="flex gap-3">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop" 
                  alt="Post" 
                  className="w-16 h-16 rounded object-cover flex-shrink-0"
                />
                <div>
                  <p className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <Calendar size={16} className="text-blue-600" />
                    15th April, 2024
                  </p>
                  <h4 className="text-sm font-medium hover:text-blue-600 transition-colors cursor-pointer">
                    The Surfing Man Will Blow Your Mind
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.contactUs')}</h3>
            <div className="space-y-4 mb-6">
              <a href="mailto:contact@makerstudios.gg" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Mail size={20} className="text-blue-600" />
                <span>contact@makerstudios.gg</span>
              </a>
              <a href="tel:+208-6666-0112" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                <Phone size={20} className="text-blue-600" />
                <span>+099-9999-9999</span>
              </a>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full bg-white text-gray-900 px-4 py-3 rounded-2xl pr-12 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  onClick={handleSubmit}
                  className="absolute right-1 top-1 bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
              <label className="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  {t('footer.agreeWith')}{' '}
                  <a href="#" className="text-blue-600 hover:underline">
                    {t('footer.privacyPolicy')}
                  </a>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            {t('footer.copyright')}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              {t('footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}