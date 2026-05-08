"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogPost, RecentPost } from "../types/blog";
import PostDetailHeader from "./post-detail-header";
import PostMeta from "./post-meta";
import PostContent from "./post-content";
import BlogSidebar from "./blog-sidebar";
import { useLanguage } from "../../context/language-context";
import { getLocalizedText } from "../../utils/localized-content";

interface Props {
  post: BlogPost;
  recentPosts: RecentPost[];
  categories: string[];
}

export default function BlogPostDetail({
  post,
  recentPosts,
  categories,
}: Props) {
  const router = useRouter();
  const { t, language } = useLanguage();
  const locale = language === "vi" ? "vi-VN" : "en-US";
  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";
  const localizedPost: BlogPost = {
    ...post,
    title: getLocalizedText(post, language, "title") || post.title,
    excerpt: getLocalizedText(post, language, "excerpt") || post.excerpt,
    content: getLocalizedText(post, language, "content") || post.content,
    image:
      getLocalizedText(post, language, "featuredImage") ||
      post.featuredImage ||
      post.image,
    date: formatDate(post.publishDate) || post.date,
  };
  const localizedRecentPosts: RecentPost[] = recentPosts.map((item) => ({
    ...item,
    title: getLocalizedText(item, language, "title") || item.title,
    image:
      getLocalizedText(item, language, "featuredImage") ||
      item.featuredImage ||
      item.image,
    date: formatDate(item.publishDate) || item.date,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          {t('blogPage.back')}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-lg">
              <PostDetailHeader post={localizedPost} />
              <div className="p-8">
                <h1 className="text-4xl font-bold mb-6">{localizedPost.title}</h1>
                <PostMeta post={localizedPost} />
                <PostContent content={localizedPost.content || localizedPost.excerpt || ""} />
              </div>
            </article>
          </div>

          <BlogSidebar
            recentPosts={localizedRecentPosts}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
