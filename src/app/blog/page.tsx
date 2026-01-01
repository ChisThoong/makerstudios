"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPost, RecentPost, ApiResponse, ApiPost } from "./types/blog";
import BlogPostCard from "./components/blog-post-card";
import BlogSidebar from "./components/blog-sidebar";
import { useLanguage } from "../context/language-context";
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
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
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
    } catch (err: any) {
      setError(err.message);
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
    <div className="min-h-screen bg-gray-50 pt-20 pb-40">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-12">{t('blogPage.title')}</h1>

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
  );
}