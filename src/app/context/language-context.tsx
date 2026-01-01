"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  vi: {
    // Header
    'nav.home': 'Trang chủ',
    'nav.products': 'Sản phẩm',
    'nav.news': 'Tin tức',
    'nav.contact': 'Liên hệ',
    'nav.language': 'VN',
    
    // Section 1
    'hero.weAre': 'CHÚNG TÔI LÀ',
    'hero.title': 'MAKER STUDIOS',
    'hero.welcome': 'Cảm ơn bạn đã ghé thăm Maker Studios!',
    'hero.description1': 'Chúng tôi là một game studio trẻ ở Việt Nam. Chúng tôi đang nỗ lực từng ngày để tạo nên những sản phẩm chất lượng, khẳng định vị thế ở trong nước cũng như trên thế giới.',
    'hero.description2': 'Hãy đăng ký bằng email của bạn để nhận thông báo mới nhất về các tựa game được phát triển riêng cho thị trường Việt Nam.',
    'hero.emailPlaceholder': 'Nhập địa chỉ email của bạn...',
    'hero.subscribe': 'Đăng ký',
    
    // Modal
    'modal.success': 'Đăng ký thành công! Cảm ơn bạn đã quan tâm đến Maker Studios.',
    'modal.errorEmpty': 'Bạn chưa nhập email!',
    'modal.errorInvalid': 'Email không hợp lệ! Vui lòng kiểm tra lại.',
    'modal.errorExists': 'Email này đã được đăng ký trước đó rồi!',
    'modal.errorConnection': 'Lỗi kết nối server! Vui lòng thử lại sau.',
    
    // Language names
    'lang.vietnamese': 'Tiếng Việt',
    'lang.english': 'English',
    'lang.label': 'Ngôn ngữ',

    // Section 2
    'about.title': 'VỀ CHÚNG TÔI',
    'about.teamLabel': 'MỘT TẬP THỂ',
    'about.word1': 'ĐAM MÊ',
    'about.word2': 'NHIỆT HUYẾT',
    'about.word3': 'ĐỘT PHÁ',
    'about.description': 'Chúng tôi chú trọng xây dựng từng yếu tố cốt lõi : gameplay cuốn hút, đồ họa đẹp mắt, thiết kế chỉn chu và âm thanh sống động. Tất cả được kết hợp hài hòa để mang đến trải nghiệm trọn vẹn và cảm xúc nhất cho người chơi.',
  
    // Game Cards
    'gameCard.gameplay.title': 'Game Play',
    'gameCard.gameplay.desc': 'Hấp dẫn, lôi cuốn',
    'gameCard.graphics.title': 'Đồ hoạ',
    'gameCard.graphics.desc': 'Đẹp mắt, cảm xúc',
    'gameCard.design.title': 'Thiết kế',
    'gameCard.design.desc': 'Chỉn chu, sáng tạo',
    'gameCard.sound.title': 'Âm thanh',
    'gameCard.sound.desc': 'Sống động, chân thực',

    // Section 3 - Statistics
    'stats.title': 'SẢN PHẨM',
    'stats.heading': 'GAME',
    'stats.headingHighlight': 'NỔI BẬT',
    'stats.staff': 'Nhân sự',
    'stats.games': 'Sản phẩm',
    'stats.downloads': 'Lượt tải',
    'stats.rating': 'Đánh giá',
    'stats.loading': 'Đang tải...',
    'stats.noGames': 'Chưa có game nào được thêm',
    'stats.access': 'Truy cập',
    
    // Section 4 - Blog
    'blog.subtitle': 'TIN TỨC & SỰ KIỆN',
    'blog.title': 'Cập nhật mới nhất',
    'blog.viewAll': 'Xem tất cả',
    'blog.loading': 'Đang tải bài viết...',
    'blog.error': 'Không thể tải bài viết',
    'blog.retry': 'Thử lại',
    'blog.noPosts': 'Chưa có bài viết nào',
    'blog.by': 'Bởi',
    'blog.uncategorized': 'Chưa phân loại',

    // Subscribe Modal
    'modal.processing': 'Đang xử lý',
    'modal.pleaseWait': 'Vui lòng đợi trong giây lát...',
    'modal.awesome': 'Tuyệt vời',
    'modal.error': 'Có lỗi xảy ra',
    'modal.autoClose': 'Tự động đóng sau {count} giây',
    
    // Footer
    'footer.cta.title1': 'Chúng tôi luôn sẵn sàng',
    'footer.cta.title2': 'Lắng nghe bạn',
    'footer.cta.button': 'Liên hệ với chúng tôi',
    'footer.company.desc': 'Maker Studios - We make games',
    'footer.quickLinks': 'Liên kết nhanh',
    'footer.quickLinks.home': 'Trang chủ',
    'footer.quickLinks.products': 'Sản phẩm',
    'footer.quickLinks.careers': 'Tuyển dụng',
    'footer.quickLinks.news': 'Tin tức',
    'footer.quickLinks.contact': 'Liên hệ',
    'footer.recentPosts': 'Bài viết gần đây',
    'footer.contactUs': 'Liên hệ',
    'footer.emailPlaceholder': 'Nhập địa chỉ email',
    'footer.agreeWith': 'Tôi đồng ý với',
    'footer.privacyPolicy': 'Chính sách bảo mật.',
    'footer.copyright': '© All Copyright 2025 by Maker Studios',
    'footer.terms': 'Điều khoản & Điều kiện',
    'footer.privacy': 'Chính sách bảo mật',
    // Blog Page
    'blogPage.title': 'Tin tức & Sự kiện',
    'blogPage.loading': 'Đang tải bài viết...',
    'blogPage.search': 'Tìm kiếm',
    'blogPage.searchPlaceholder': 'Tìm kiếm...',
    'blogPage.recentPosts': 'Bài viết gần đây',
    'blogPage.categories': 'Danh mục',
    'blogPage.readMore': 'Đọc thêm',

  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.language': 'EN',
    
    // Section 1
    'hero.weAre': 'WE ARE',
    'hero.title': 'MAKER STUDIOS',
    'hero.welcome': 'Thank you for visiting Maker Studios!',
    'hero.description1': 'We are a young game studio in Vietnam. We are working hard every day to create quality products and establish our position both domestically and internationally.',
    'hero.description2': 'Sign up with your email to receive the latest updates about games developed specifically for the Vietnamese market.',
    'hero.emailPlaceholder': 'Enter your email address...',
    'hero.subscribe': 'Subscribe',
    
    // Modal
    'modal.success': 'Successfully subscribed! Thank you for your interest in Maker Studios.',
    'modal.errorEmpty': 'Please enter your email!',
    'modal.errorInvalid': 'Invalid email! Please check again.',
    'modal.errorExists': 'This email has already been registered!',
    'modal.errorConnection': 'Server connection error! Please try again later.',
    
    // Language names
    'lang.vietnamese': 'Tiếng Việt',
    'lang.english': 'English',
    'lang.label': 'Language',
    //section2
    'about.title': 'ABOUT US',
    'about.teamLabel': 'A TEAM OF',
    'about.word1': 'PASSION',
    'about.word2': 'DEDICATION',
    'about.word3': 'INNOVATION',
    'about.description': 'We focus on building every core element: engaging gameplay, beautiful graphics, meticulous design, and immersive sound. All harmoniously combined to deliver the most complete and emotional experience for players.',
    
    //game card
    'gameCard.gameplay.title': 'Game Play',
    'gameCard.gameplay.desc': 'Engaging, captivating',
    'gameCard.graphics.title': 'Graphics',
    'gameCard.graphics.desc': 'Beautiful, emotional',
    'gameCard.design.title': 'Design',
    'gameCard.design.desc': 'Meticulous, creative',
    'gameCard.sound.title': 'Sound',
    'gameCard.sound.desc': 'Immersive, realistic',

    // Section 3 - Statistics
    'stats.title': 'PRODUCTS',
    'stats.heading': 'FEATURED',
    'stats.headingHighlight': 'GAMES',
    'stats.staff': 'Staff',
    'stats.games': 'Products',
    'stats.downloads': 'Downloads',
    'stats.rating': 'Rating',
    'stats.loading': 'Loading...',
    'stats.noGames': 'No games added yet',
    'stats.access': 'Access',
    
    // Section 4 - Blog
    'blog.subtitle': 'NEWS & EVENTS',
    'blog.title': 'Latest Updates',
    'blog.viewAll': 'View All',
    'blog.loading': 'Loading posts...',
    'blog.error': 'Unable to load posts',
    'blog.retry': 'Try Again',
    'blog.noPosts': 'No posts yet',
    'blog.by': 'By',
    'blog.uncategorized': 'Uncategorized',

    // Subscribe Modal
    'modal.processing': 'Processing',
    'modal.pleaseWait': 'Please wait a moment...',
    'modal.awesome': 'Awesome',
    'modal.error': 'An error occurred',
    'modal.autoClose': 'Auto-closing in {count} seconds',
    
    // Footer
    'footer.cta.title1': 'We are always ready',
    'footer.cta.title2': 'To listen to you',
    'footer.cta.button': 'Contact Us',
    'footer.company.desc': 'Maker Studios - We make games',
    'footer.quickLinks': 'Quick Links',
    'footer.quickLinks.home': 'Home',
    'footer.quickLinks.products': 'Products',
    'footer.quickLinks.careers': 'Careers',
    'footer.quickLinks.news': 'News',
    'footer.quickLinks.contact': 'Contact',
    'footer.recentPosts': 'Recent Posts',
    'footer.contactUs': 'Contact Us',
    'footer.emailPlaceholder': 'Enter your email',
    'footer.agreeWith': 'I agree with',
    'footer.privacyPolicy': 'Privacy Policy.',
    'footer.copyright': '© All Copyright 2025 by Maker Studios',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',

    // Blog Page
    'blogPage.title': 'News & Events',
    'blogPage.loading': 'Loading posts...',
    'blogPage.search': 'Search',
    'blogPage.searchPlaceholder': 'Search...',
    'blogPage.recentPosts': 'Recent Posts',
    'blogPage.categories': 'Categories',
    'blogPage.readMore': 'Read More',

  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'vi' || savedLang === 'en')) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return (translations[language] as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}