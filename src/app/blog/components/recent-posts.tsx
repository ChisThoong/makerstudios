"use client"
import React from 'react';
import { Calendar } from 'lucide-react';
import { RecentPost } from '../types/blog';
import { useLanguage } from '../../context/language-context';

interface RecentPostsProps {
  posts: RecentPost[];
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">{t('blogPage.recentPosts')}</h3>
      <div className="space-y-4">
        {posts.map((post) => (
          <a 
            key={post.id} 
            href={`/blog/${post.slug}`}
            className="flex gap-4 group cursor-pointer"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm mb-2">
                {post.title}
              </h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>{post.date}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}