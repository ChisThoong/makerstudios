"use client"
import React from 'react';
import { User, Tag, MessageCircle } from 'lucide-react';
import { BlogPost } from '../types/blog';
interface BlogPostCardProps {
  post: BlogPost;
  onClick?: () => void;
}

export default function BlogPostCard({ post, onClick }: BlogPostCardProps) {
  return (
    <article 
      onClick={onClick}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      <div className="relative h-auto overflow-hidden group">
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg z-10 font-semibold">
          {post.date}
        </div>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>By {post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>{post.category}</span>
          </div>
          {/* <div className="flex items-center gap-2">
            <MessageCircle size={16} />
            <span>Comments ({post.commentsCount})</span>
          </div> */}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
        )}
      </div>
    </article>
  );
}