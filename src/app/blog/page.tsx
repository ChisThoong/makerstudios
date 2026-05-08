"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BlogPost, RecentPost, ApiResponse, ApiPost } from "./types/blog";
import BlogPostCard from "./components/blog-post-card";
import BlogSidebar from "./components/blog-sidebar";
import { useLanguage } from "../context/language-context";
import { getLocalizedText } from "../utils/localized-content";
export default function BlogPage() {
  const router = useRouter();
  const { t, language } = useLanguage();

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, [language]); // Re-fetch when language changes for date formatting

  const fetchBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/blog");

      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }

      const data: ApiResponse = await response.json();

      const transformedPosts: BlogPost[] =
        data.posts?.map((post: ApiPost) => ({
          id: post._id,
          slug: post._id,
          image:
            post.featuredImage ||
            "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
          category: post.categories?.[0] || t('blog.uncategorized'),
          date: new Date(post.publishDate).toLocaleDateString(
            language === 'vi' ? 'vi-VN' : 'en-US',
            {
              day: "numeric",
              month: "long",
              year: "numeric",
            }
          ),
          title: getLocalizedText(post, language, "title"),
          excerpt: getLocalizedText(post, language, "excerpt") || post.excerpt,
          content: getLocalizedText(post, language, "content") || post.content,
          author: {
            name: post.author?.name || "Admin",
            role: post.author?.role || "Co. Founder",
            avatar:
              post.author?.avatar ||
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
          },
          commentsCount: post.commentsCount || 0,
          readTime: "",
        })) || [];

      setPosts(transformedPosts);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch blog posts");
    } finally {
      setLoading(false);
    }
  };

  const recentPosts: RecentPost[] = posts.slice(0, 3).map((post) => ({
    id: post.id,
    slug: post.id,
    title: post.title,
    date: post.date,
    image: post.image,
  }));

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-24 pb-24">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#0a1628] to-[#1a2942] overflow-hidden">
        {/* Tech Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          {/* <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="tech-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="#3b82f6" />
                <line x1="10" y1="10" x2="50" y2="30" stroke="#3b82f6" strokeWidth="1" />
                <circle cx="50" cy="30" r="2" fill="#3b82f6" />
                <line x1="50" y1="30" x2="80" y2="60" stroke="#3b82f6" strokeWidth="1" />
                <circle cx="80" cy="60" r="2" fill="#3b82f6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#tech-pattern)" />
          </svg> */}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold">
                {t('blogPage.title')}
              </h1>
              
              <div className="flex items-center space-x-2 text-md">
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  {t('nav.home')}
                </Link>
                <span className="text-blue-400">|</span>
                <span className="text-blue-400">{t('blogPage.title')}</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative hidden lg:block">
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop"
                  alt="Contact Us"
                  className="rounded-lg shadow-2xl h-72 mx-auto"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12">
        {/* <h1 className="text-5xl font-bold mb-12">{t('blogPage.title')}</h1> */}

        {loading && (
          <div className="flex justify-center py-20">
            <p>{t('blogPage.loading')}</p>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            <div className="lg:col-span-2 space-y-8">
            <div className="">
              <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-md font-medium">
                {t('blogPage.title')}
              </span>
            </div>
              {posts.map((post) => (
                <BlogPostCard
                  key={post.id}
                  post={post}
                  onClick={() => router.push(`/blog/${post.id}`)}
                />
              ))}
            </div>

            <BlogSidebar
              recentPosts={recentPosts}
              categories={categories}
            />
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
