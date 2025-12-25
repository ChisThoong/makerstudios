"use client"
import React from 'react';
import { User, Tag, MessageCircle, Clock } from 'lucide-react';
import { BlogPost } from '../types/blog';
interface PostMetaProps {
  post: BlogPost;
}

export default function PostMeta({ post }: PostMetaProps) {
  return (
    <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6 pb-6 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <User size={18} />
        <span>By {post.author.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <Tag size={18} />
        <span>{post.category}</span>
      </div>
      {/* <div className="flex items-center gap-2">
        <MessageCircle size={18} />
        <span>Comments ({post.commentsCount})</span>
      </div>
      {post.readTime && (
        <div className="flex items-center gap-2">
          <Clock size={18} />
          <span>{post.readTime}</span>
        </div>
      )} */}
    </div>
  );
}