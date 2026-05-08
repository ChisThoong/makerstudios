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
    'nav.carrer': 'Cơ hội nghề nghiệp',
    'nav.language': 'VN',
    
    // Section 1
    'hero.weAre': 'CHÚNG TÔI LÀ',
    'hero.title': 'MAKER STUDIOS',
    'hero.welcome': 'Cảm ơn bạn đã ghé thăm Maker Studios!',
    'hero.description1': 'Chúng tôi là một game studio trẻ ở Việt Nam, mang khát vọng tạo ra những trải nghiệm giải trí sáng tạo và khác biệt. ',
    'hero.description2': 'Chúng tôi tin rằng game chất lượng là không có giới hạn và người Việt Nam hoàn toàn có thể làm ra chúng.',
    'hero.description3': 'Từ công nghệ đến con người, mọi điều Maker Studios xây dựng đều hướng đến một mục tiêu: đưa dấu ấn sáng tạo Việt vươn xa trên bản đồ game thế giới.',
    'hero.emailPlaceholder': 'Nhập địa chỉ email của bạn...',
    'hero.subscribe': 'Đăng ký',

    // Upcoming PTHA Section
    'upcomingPtha.badge': 'SẮP RA MẮT',
    'upcomingPtha.logoAlt': 'Phong Thủ Hắc Ám',
    'upcomingPtha.description': 'Cuộc chiến phòng thủ hỗn loạn với quái vật dị giới và những màn nâng cấp sức mạnh đầy hấp dẫn đang chờ bạn khám phá.',
    'upcomingPtha.countdownTitle': 'Đếm ngược ra mắt',
    'upcomingPtha.countdown.days': 'Ngày',
    'upcomingPtha.countdown.hours': 'Giờ',
    'upcomingPtha.countdown.minutes': 'Phút',
    'upcomingPtha.countdown.seconds': 'Giây',
    'upcomingPtha.trailer': 'Xem trailer',
    'upcomingPtha.closeTrailer': 'Đóng trailer',
    'upcomingPtha.feature1.title': 'CỔNG DỊ GIỚI MỞ RA',
    'upcomingPtha.feature1.description': 'Kẻ địch mới, boss mới và bản đồ hoang thú hỗn loạn hơn bao giờ hết.',
    'upcomingPtha.feature2.title': 'NÂNG CẤP SỨC MẠNH',
    'upcomingPtha.feature2.description': 'Mở khóa kỹ năng, tăng cấp tháp phòng thủ.',
    'upcomingPtha.feature3.title': 'ĐA DẠNG CHẾ ĐỘ CHƠI',
    'upcomingPtha.feature3.description': 'Chinh phục nhiều chế độ chơi và mở khóa phần thưởng.',
    
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
    'stats.heading': 'SẢN',
    'stats.headingHighlight': 'PHẨM',
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
    'footer.cta.title1': 'Đăng ký để nhận bản tin',
    'footer.cta.title2': '',
    'footer.cta.button': 'Liên hệ với chúng tôi',
    'footer.cta.subscribe': 'Đăng ký',
    'footer.company.desc': 'Maker Studios - We make games',
    'footer.company.name': 'CÔNG TY TNHH MAKER STUDIOS',
    'footer.company.address': 'Phòng 601, Tầng 6, 57 Lê Thị Hồng Gấm, Phường Bến Thành, Thành phố Hồ Chí Minh, Việt Nam',
    'footer.company.addressLabel': 'Địa chỉ',
    'footer.company.emailLabel': 'Email',
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
    'blogPage.back': 'Quay lại',

    'contact.badge': 'Liên hệ với chúng tôi',
    'contact.title': 'Bạn có câu hỏi nào không?',
    'contact.description': 'Chúng tôi luôn lắng nghe cộng đồng người chơi, không ngừng cải tiến và mang đến những trải nghiệm game tốt nhất.',
    'contact.fullName': 'Họ và tên',
    'contact.emailAddress': 'Địa chỉ email',
    'contact.subject': 'Tiêu đề',
    'contact.message': 'Tin nhắn',
    'contact.sendButton': 'Gửi tin nhắn',
    'contact.sending': 'Đang gửi...',
    'contact.success': 'Thành công!',
    'contact.error': 'Gửi tin nhắn thất bại',
    'contact.email': 'Email',
    'contact.phone': 'Liên hệ',
    'contact.hours': 'Giờ làm việc',
    'contact.location': 'Địa chỉ',
    'contact.saturday': 'T2 – T6: 09:00 – 18:00',
    'contact.sunday': 'Chủ nhật: 14:00 - 19:00',

    'contactModal.sending': 'Đang gửi liên hệ',
    'contactModal.pleaseWait': 'Vui lòng chờ trong giây lát...',
    'contactModal.successTitle': 'Gửi liên hệ thành công!',
    'contactModal.successMessage': 'Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.',
    'contactModal.errorTitle': 'Gửi liên hệ thất bại',
    'contactModal.errorMessage': 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',

    // Careers
    'careers.title': 'Cơ hội nghề nghiệp',
    'careers.subtitle': 'Gia nhập đội ngũ của chúng tôi',
    'careers.description': 'Cùng Maker Studios xây dựng tương lai của ngành game',
    'careers.openPositions': 'Vị trí đang tuyển',
    'careers.teamMembers': 'Thành viên',
    'careers.category': 'Danh mục',
    'careers.allCategory': 'Tất cả',
    'careers.keyword': 'Từ khoá',
    'careers.keywordPlaceholder': 'Tên công việc hoặc từ khoá',
    'careers.location': 'Địa điểm',
    'careers.locationPlaceholder': 'Tìm địa điểm',
    'careers.jobType': 'Hình thức làm việc',
    'careers.fullTime': 'Toàn thời gian',
    'careers.partTime': 'Bán thời gian',
    'careers.remote': 'Từ xa',
    'careers.contract': 'Hợp đồng',
    'careers.noJobs': 'Không tìm thấy công việc',
    'careers.adjustFilter': 'Hãy thử thay đổi bộ lọc',
    'careers.today': 'Hôm nay',
    'careers.daysAgo': '{count} ngày trước',
    'careers.browseJob': 'Xem chi tiết →',
    'careers.newBadge': 'Mới',
    'careers.loading': 'Đang tải việc làm...',

  },
  en: {
    // Header
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.carrer': 'Cerrer',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.language': 'EN',
    
    // Section 1
    'hero.weAre': 'WE ARE',
    'hero.title': 'MAKER STUDIOS',
    'hero.welcome': 'Thank you for visiting Maker Studios!',
    'hero.description1': 'We are a young game studio from Vietnam, driven by the ambition to create creative and distinctive entertainment experiences.',
    'hero.description2': 'We believe that quality games know no limits — and that Vietnamese developers are fully capable of building them.',
    'hero.description3': "From technology to talent, everything Maker Studios builds serves one goal: to put Vietnam's creative mark on the world's gaming map.",
    'hero.emailPlaceholder': 'Enter your email address...',
    'hero.subscribe': 'Subscribe',

    // Upcoming PTHA Section
    'upcomingPtha.badge': 'COMING SOON',
    'upcomingPtha.logoAlt': 'Dark Defense',
    'upcomingPtha.description': 'A chaotic defense battle against otherworldly monsters and exciting power upgrades is waiting for you to discover.',
    'upcomingPtha.countdownTitle': 'Launch countdown',
    'upcomingPtha.countdown.days': 'Days',
    'upcomingPtha.countdown.hours': 'Hours',
    'upcomingPtha.countdown.minutes': 'Minutes',
    'upcomingPtha.countdown.seconds': 'Seconds',
    'upcomingPtha.trailer': 'Watch trailer',
    'upcomingPtha.closeTrailer': 'Close trailer',
    'upcomingPtha.feature1.title': 'THE DARK GATE OPENS',
    'upcomingPtha.feature1.description': 'New enemies, new bosses, and a monster-filled map more chaotic than ever.',
    'upcomingPtha.feature2.title': 'POWER UP YOUR DEFENSE',
    'upcomingPtha.feature2.description': 'Unlock skills and upgrade your defense towers.',
    'upcomingPtha.feature3.title': 'MULTIPLE GAME MODES',
    'upcomingPtha.feature3.description': 'Conquer different modes and unlock rewarding prizes.',
    
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
    'stats.heading': 'OUR',
    'stats.headingHighlight': 'PRODUCTS',
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
    'footer.cta.title1': 'Subscribe to our newsletter',
    'footer.cta.title2': '',
    'footer.cta.button': 'Contact Us',
    'footer.cta.subscribe': 'Subscribe',
    'footer.company.desc': 'Maker Studios - We make games',
    'footer.company.name': 'MAKER STUDIOS LIMITED LIABILITY COMPANY',
    'footer.company.address': 'Room 601, 6th Floor, 57 Le Thi Hong Gam Street, Ben Thanh Ward, Ho Chi Minh City, Vietnam',
    'footer.company.addressLabel': 'Address',
    'footer.company.emailLabel': 'Email',
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
    'blogPage.back': 'Back',

    'contact.badge': 'Contact Us',
    'contact.title': 'Do you have any question?',
    'contact.description': 'We always listen to our player community, continuously improve, and deliver the best gaming experiences.',
    'contact.fullName': 'Full Name',
    'contact.emailAddress': 'Email Address',
    'contact.subject': 'Subject',
    'contact.message': 'Message',
    'contact.sendButton': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.success': 'Successfully!',
    'contact.error': 'Failed to send message',
    'contact.email': 'Email',
    'contact.phone': 'Contacts',
    'contact.hours': 'Date',
    'contact.location': 'Location',
    'contact.saturday': 'Mon – Fri: 9:00 AM – 6:00 PM',
    'contact.sunday': 'Sunday: 2:00 PM - 7:00 PM',
    'contactModal.sending': 'Sending your message',
    'contactModal.pleaseWait': 'Please wait a moment...',
    'contactModal.successTitle': 'Message sent successfully!',
    'contactModal.successMessage': 'Thank you for contacting us. We’ll get back to you shortly.',
    'contactModal.errorTitle': 'Failed to send message',
    'contactModal.errorMessage': 'Something went wrong. Please try again later.',

    // Careers
    'careers.title': 'Join Our Team',
    'careers.subtitle': 'Build the future of gaming',
    'careers.description': 'Create amazing games with Maker Studios',
    'careers.openPositions': 'Open Positions',
    'careers.teamMembers': 'Team Members',
    'careers.category': 'Category',
    'careers.allCategory': 'All Category',
    'careers.keyword': 'Keyword',
    'careers.keywordPlaceholder': 'Job title or keyword',
    'careers.location': 'Location',
    'careers.locationPlaceholder': 'Search location',
    'careers.jobType': 'Job Type',
    'careers.fullTime': 'Full Time',
    'careers.partTime': 'Part Time',
    'careers.remote': 'Remote',
    'careers.contract': 'Contract',
    'careers.noJobs': 'No jobs found',
    'careers.adjustFilter': 'Try adjusting your filters',
    'careers.today': 'Today',
    'careers.daysAgo': '{count} days ago',
    'careers.browseJob': 'Browse Job →',
    'careers.newBadge': 'New',
    'careers.loading': 'Loading jobs...',

  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('vi');

  useEffect(() => {
    // Load language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && (savedLang === 'vi' || savedLang === 'en')) {
      setLanguageState(savedLang);
      document.cookie = `language=${savedLang}; path=/; max-age=31536000; SameSite=Lax`;
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    document.cookie = `language=${lang}; path=/; max-age=31536000; SameSite=Lax`;
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
