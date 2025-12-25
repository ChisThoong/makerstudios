"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, User, MessageCircle } from 'lucide-react';
import AnimatedTitle from './ui/animated-title';
import AnimatedSplitText from './ui/animated-split-text';
import { useRouter } from 'next/navigation';

// Type definitions
interface Author {
  name: string;
  role: string;
  avatar: string;
}

interface BlogPost {
  id: string;
  image: string;
  category: string;
  date: string;
  title: string;
  excerpt?: string;
  slug: string;
  author: Author;
  bgColor: string;
  commentsCount: number;
}

interface ApiPost {
  _id: string;
  title: string;
  slug: string;
  featuredImage?: string;
  categories?: string[];
  publishDate: string;
  excerpt?: string;
  content?: string;
  author?: {
    name?: string;
    role?: string;
    avatar?: string;
  };
  commentsCount?: number;
  status: string;
  visibility: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  posts?: ApiPost[];
  success?: boolean;
  message?: string;
}

const bgColors = [
  'bg-gradient-to-br from-purple-200 to-purple-100',
  'bg-gradient-to-br from-indigo-900 to-indigo-800',
  'bg-gradient-to-br from-blue-500 to-blue-400',
  'bg-gradient-to-br from-green-500 to-green-400',
  'bg-gradient-to-br from-pink-500 to-pink-400',
  'bg-gradient-to-br from-red-500 to-red-400'
];

export default function Section4() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog');
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data: ApiResponse = await response.json();
      
      // Only get published and public posts
      const publishedPosts = data.posts?.filter(
        (post: ApiPost) => post.status === 'published' && post.visibility === 'public'
      ) || [];

      // Transform API data to match component structure
      const transformedPosts: BlogPost[] = publishedPosts.slice(0, 6).map((post: ApiPost, index: number) => ({
        id: post._id,
        image: post.featuredImage || 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop',
        category: post.categories?.[0] || 'Uncategorized',
        date: new Date(post.publishDate).toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        }).toUpperCase(),
        title: post.title,
        excerpt: post.excerpt,
        slug: post.slug,
        author: {
          name: post.author?.name || 'Admin',
          role: post.author?.role || 'Co. Founder',
          avatar: post.author?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
        },
        bgColor: bgColors[index % bgColors.length],
        commentsCount: post.commentsCount || 3
      }));

      setBlogPosts(transformedPosts);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching blog posts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/blog/${postId}`);
  };

  const handleViewAll = () => {
    router.push('/blog');
  };
  
  return (
    <section className="relative pt-20 pb-40 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div className="w-full md:w-auto">
            <div className="flex items-center justify-center sm:justify-start w-full mb-4">
              <AnimatedTitle>
                TIN TỨC & SỰ KIỆN
              </AnimatedTitle>
            </div>
            <AnimatedSplitText 
                text="Cập nhật mới nhất"
                className="text-4xl sm:text-5xl font-bold text-gray-900 text-center sm:text-left"
            />
          </div>
          
          {/* View All Button - Desktop */}
          <div className="hidden md:block">
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all hover:gap-3 group"
            >
              Xem tất cả
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Đang tải bài viết...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-medium mb-2">Không thể tải bài viết</p>
            <p className="text-sm text-gray-600">{error}</p>
            <button 
              onClick={fetchBlogPosts}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && blogPosts.length === 0 && (
          <div className="bg-gray-100 border border-gray-200 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">Chưa có bài viết nào</p>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!loading && !error && blogPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-gray-200"
              >
                {/* Image Section */}
                <div
                  onClick={() => handlePostClick(post.id)}
                  className={`${post.bgColor} h-auto relative overflow-hidden group cursor-pointer`}
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-110"
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
                      {new Date(post.date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => handlePostClick(post.id)}
                    className="text-lg font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

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

                    {/* <div className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      <span>{post.commentsCount}</span>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button - Mobile */}
        <div className="flex md:hidden justify-center mt-12">
          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all hover:gap-3 group"
          >
            Xem tất cả
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}