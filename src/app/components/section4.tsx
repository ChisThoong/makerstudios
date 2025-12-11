"use client"
import React from 'react';
import { ArrowRight, User, MessageCircle } from 'lucide-react';
import AnimatedTitle from './ui/animated-title';
import AnimatedSplitText from './ui/animated-split-text';

export default function Section4() {
  const blogPosts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
      category: 'Shared Hosting',
      date: 'MARCH 24, 2024',
      title: 'Attentive Was Born In 2015 Help Sales Teams',
      author: {
        name: 'Admin',
        role: 'Co. Founder',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
      },
      bgColor: 'bg-gradient-to-br from-purple-200 to-purple-100'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
      category: 'Uncategorized',
      date: 'MARCH 14, 2024',
      title: 'Best And Fastest Data Server Ever',
      author: {
        name: 'Admin',
        role: 'Co. Founder',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
      },
      bgColor: 'bg-gradient-to-br from-indigo-900 to-indigo-800'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
      category: 'Technology',
      date: 'MARCH 29, 2024',
      title: 'Life Won\'t One Beast Air Over Above All',
      author: {
        name: 'Admin',
        role: 'Co. Founder',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
      },
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-400'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
      category: 'Development',
      date: 'APRIL 05, 2024',
      title: 'Modern Web Development Trends',
      author: {
        name: 'Admin',
        role: 'Co. Founder',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop'
      },
      bgColor: 'bg-gradient-to-br from-green-500 to-green-400'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&h=400&fit=crop',
      category: 'Design',
      date: 'APRIL 12, 2024',
      title: 'Creating Beautiful User Interfaces',
      author: {
        name: 'Admin',
        role: 'Co. Founder',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop'
      },
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-400'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop',
      category: 'Security',
      date: 'APRIL 18, 2024',
      title: 'Cybersecurity Best Practices 2024',
      author: {
        name: 'Admin',
        role: 'Co. Founder',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop'
      },
      bgColor: 'bg-gradient-to-br from-red-500 to-red-400'
    }
  ];

  return (
    <section className="relative py-20 px-6 bg-gray-50 pb-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center justify-center sm:justify-start w-full mb-4">
              <AnimatedTitle>
                TIN TỨC & SỰ KIỆN
              </AnimatedTitle>
            </div>
            <AnimatedSplitText 
                text="Cập nhật mới nhất"
                className="text-4xl sm:text-5xl font-bold text-gray-900  text-center sm:text-left"
            />
          </div>
          
          {/* View All Button - Desktop */}
          <div className="hidden md:block">
            <a
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all hover:gap-3 group"
            >
              Xem tất cả
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-item scroll-up">
            {blogPosts.map((post) => (
                <div
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                {/* Image Section */}
                <div className={`${post.bgColor} h-48 relative overflow-hidden group`}>
                    <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Category and Date */}
                    <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide">
                        {post.category}
                    </span>
                    <span className="text-gray-400 text-xs font-medium">
                        {post.date}
                    </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug">
                    {post.title}
                    </h3>

                    {/* Spacer to push author section to bottom */}
                    <div className="flex-grow"></div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-4"></div>

                    {/* Author and Comments Section */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>By {post.author.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        <span> 3</span>
                    </div>
                    </div>
                </div>
                </div>
            ))}
            </div>

        {/* View All Button - Mobile */}
        <div className="flex md:hidden justify-center mt-12">
          <a
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all hover:gap-3 group"
          >
            Xem tất cả
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
}