"use client"
import React from 'react';
import SearchBox from './search-box';
import RecentPosts from './recent-posts';
import CategoriesWidget from './categories-widget';
import { RecentPost } from '../types/blog';
interface BlogSidebarProps {
  recentPosts: RecentPost[];
  categories: string[];
}

export default function BlogSidebar({ recentPosts, categories }: BlogSidebarProps) {
  return (
    <div className="space-y-6">
      <SearchBox />
      <RecentPosts posts={recentPosts} />
      <CategoriesWidget categories={categories} />
    </div>
  );
}