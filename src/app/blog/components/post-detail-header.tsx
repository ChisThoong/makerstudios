"use client"
import React from 'react';
import { BlogPost } from '../types/blog';
interface PostDetailHeaderProps {
  post: BlogPost;
}

export default function PostDetailHeader({ post }: PostDetailHeaderProps) {
  return (
    <div className="relative h-full overflow-hidden">
      <div className="absolute top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg z-10 text-lg font-semibold">
        {post.date}
      </div>
      <img
        src={post.image}
        alt={post.title}
        className="w-full h-full object-cover rounded-t-xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
}
