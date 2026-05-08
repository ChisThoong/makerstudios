"use client"
import React, { useEffect, useState } from 'react';
import { Mail, Facebook, Youtube, Instagram, ArrowRight, Calendar, Building2, MapPin } from 'lucide-react';
import { usePathname } from "next/navigation";
import { useLanguage } from '../../context/language-context';
import SubscribeModal from '../subscribe-popup';
import { getLocalizedText } from '../../utils/localized-content';

interface ApiPost {
  _id: string;
  title: string;
  translations?: {
    vi?: { title?: string; content?: string; excerpt?: string };
    en?: { title?: string; content?: string; excerpt?: string };
  };
  featuredImage?: string;
  publishDate?: string;
  createdAt?: string;
  status?: string;
  visibility?: string;
}

interface FooterRecentPost {
  id: string;
  title: string;
  date: string;
  image: string;
}

export default function Footer() {
  const [ctaEmail, setCtaEmail] = useState('');
  const [recentPosts, setRecentPosts] = useState<FooterRecentPost[]>([]);
  const [recentPostsLoading, setRecentPostsLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    status: "loading",
    message: "",
  });
  const pathname = usePathname();
  const { t, language } = useLanguage();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;

    const fetchRecentPosts = async () => {
      try {
        setRecentPostsLoading(true);
        const response = await fetch('/api/blog');

        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }

        const data: { posts?: ApiPost[] } = await response.json();
        const posts = data.posts || [];

        const latestPosts = posts
          .filter((post) => {
            const isPublished = !post.status || post.status === 'published';
            const isPublic = !post.visibility || post.visibility === 'public';
            return isPublished && isPublic;
          })
          .sort((a, b) => {
            const aTime = new Date(a.publishDate || a.createdAt || 0).getTime();
            const bTime = new Date(b.publishDate || b.createdAt || 0).getTime();
            return bTime - aTime;
          })
          .slice(0, 3)
          .map((post) => {
            const date = post.publishDate || post.createdAt;

            return {
              id: post._id,
              title: getLocalizedText(post, language, 'title'),
              image:
                post.featuredImage ||
                'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200',
              date: date
                ? new Date(date).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '',
            };
          });

        setRecentPosts(latestPosts);
      } catch {
        setRecentPosts([]);
      } finally {
        setRecentPostsLoading(false);
      }
    };

    fetchRecentPosts();
  }, [language, pathname]);
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return null;

  const submitCtaEmail = async () => {
    if (!ctaEmail.trim()) {
      setModal({
        isOpen: true,
        status: "error",
        message: t('modal.errorEmpty'),
      });
      return;
    }

    if (!emailRegex.test(ctaEmail)) {
      setModal({
        isOpen: true,
        status: "error",
        message: t('modal.errorInvalid'),
      });
      return;
    }

    setModal({
      isOpen: true,
      status: "loading",
      message: "",
    });

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: ctaEmail }),
      });

      const data = await res.json();

      if (data.success) {
        setModal({
          isOpen: true,
          status: "success",
          message: t('modal.success'),
        });
        setCtaEmail('');
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
    } catch {
      setModal({
        isOpen: true,
        status: "error",
        message: t('modal.errorConnection'),
      });
    }
  };

  const handleCtaKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      submitCtaEmail();
    }
  };

  const quickLinks = [
    { label: t('footer.quickLinks.home'), href: '/' },
    { label: t('footer.quickLinks.products'), href: '/#products' },
    // { label: t('footer.quickLinks.careers'), href: '/tuyen-dung' },
    { label: t('footer.quickLinks.news'), href: '/blog' },
    // { label: t('footer.quickLinks.contact'), href: '/contact-us' },
  ];

  return (
    <footer className="relative bg-gradient-to-r from-[#0a1628] to-[#1a2942] text-white">
      <SubscribeModal
        isOpen={modal.isOpen}
        status={modal.status}
        message={modal.message}
        onClose={() =>
          setModal({ isOpen: false, status: "loading", message: "" })
        }
      />
      {/* CTA Banner */}
      <div className="relative max-w-7xl mx-auto">
        <div
          className="
            rounded-4xl bg-gradient-to-r from-blue-800 to-blue-700 
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
                <h2 className="text-3xl md:text-4xl font-bold mb-2 w-80">{t('footer.cta.title1')}</h2>
              </div>
            </div>

            {/* Email Form */}
            <div className="flex w-full max-w-xl flex-col gap-3 text-black sm:flex-row">
              <input
                type="email"
                value={ctaEmail}
                onChange={(e) => setCtaEmail(e.target.value)}
                onKeyDown={handleCtaKeyDown}
                placeholder={t('hero.emailPlaceholder')}
                className="min-h-[56px] flex-1 rounded-2xl border-2 border-white/70 bg-white px-5 py-3 text-base text-black placeholder:text-gray-400 focus:outline-none focus:border-blue-200"
              />
              <button
                type="button"
                onClick={submitCtaEmail}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-white px-7 py-3 text-base font-semibold text-blue-700 transition-colors hover:bg-white/90"
              >
                {t('footer.cta.subscribe')}
                <ArrowRight size={20} />
              </button>
            </div>
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
              {recentPostsLoading && (
                <p className="text-sm text-gray-400">{t('blog.loading')}</p>
              )}

              {!recentPostsLoading && recentPosts.length === 0 && (
                <p className="text-sm text-gray-400">{t('blog.noPosts')}</p>
              )}

              {!recentPostsLoading && recentPosts.map((post) => (
                <a key={post.id} href={`/blog/${post.id}`} className="flex gap-3 group">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-16 h-16 rounded object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                      <Calendar size={16} className="text-blue-600" />
                      {post.date}
                    </p>
                    <h4 className="text-sm font-medium transition-colors group-hover:text-blue-600 line-clamp-2">
                      {post.title}
                    </h4>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t('footer.contactUs')}</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <Building2 size={18} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span className="font-semibold text-white">{t('footer.company.name')}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span>
                  <span className="font-semibold text-white">{t('footer.company.addressLabel')}: </span>
                  {t('footer.company.address')}
                </span>
              </div>
              <a href="mailto:contact@makerstudios.gg" className="flex items-start gap-3 hover:text-white transition-colors">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <span>
                  <span className="font-semibold text-white">{t('footer.company.emailLabel')}: </span>
                  contact@makerstudios.gg
                </span>
              </a>
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
