"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { BlogPost, RecentPost } from "../types/blog";
import PostDetailHeader from "./post-detail-header";
import PostMeta from "./post-meta";
import PostContent from "./post-content";
import BlogSidebar from "./blog-sidebar";

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

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-40">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <article className="bg-white rounded-xl shadow-lg">
              <PostDetailHeader post={post} />
              <div className="p-8">
                <h1 className="text-4xl font-bold mb-6">{post.title}</h1>
                <PostMeta post={post} />
                <PostContent content={post.content || post.excerpt || ""} />
              </div>
            </article>
          </div>

          <BlogSidebar
            recentPosts={recentPosts}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
