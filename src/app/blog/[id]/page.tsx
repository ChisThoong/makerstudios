import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import BlogPostDetail from "../components/blog-post-detail";
import { ApiPost, BlogPost, RecentPost } from "../types/blog";
import { getLocalizedText, LanguageCode } from "../../utils/localized-content";

type Props = {
  params: Promise<{ id: string }>;
};

// Hàm lấy thông tin 1 bài post
async function getPost(id: string, language: LanguageCode): Promise<BlogPost | null> {
  try {
   
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}/api/blog/${id}`;
    
    console.log('Fetching post from:', url);
    
    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      console.error('Failed to fetch post:', res.statusText);
      return null;
    }
    
    const response = await res.json();

    
    // API trả về {success: true, post: {...}}
    const data = response.post || response;
    // Check if we got the post data
    if (!data || !data._id) {
      console.error('Invalid post data:', data);
      return null;
    }

    // Transform API response to BlogPost format
    const post: BlogPost = {
      id: data._id,
      slug: data.slug || data._id,
      image: getLocalizedText(data, language, "featuredImage") || data.featuredImage || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
      category: data.categories?.[0] || "Uncategorized",
      date: new Date(data.publishDate).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      title: getLocalizedText(data, language, "title"),
      excerpt: getLocalizedText(data, language, "excerpt") || data.excerpt || "",
      content: getLocalizedText(data, language, "content") || data.content || "",
      author: {
        name: data.author?.name || "Admin",
        role: data.author?.role || "",
        avatar: data.author?.avatar || "",
      },
      commentsCount: data.commentsCount || 0,
      readTime: "",
    };

    return post;
    
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Hàm lấy dữ liệu sidebar
async function getSidebarData(language: LanguageCode) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/blog`;
    
    const res = await fetch(url, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.error('Failed to fetch sidebar data');
      return { recentPosts: [], categories: [] };
    }

    const data = await res.json();
    const posts: ApiPost[] = data.posts || [];

    // Filter only published and public posts
    const publishedPosts = posts.filter(
      (p) => p.status === "published" && p.visibility === "public"
    );

    const recentPosts: RecentPost[] = publishedPosts.slice(0, 3).map((p) => ({
      id: p._id,
      slug: p._id,
      title: getLocalizedText(p, language, "title"),
      date: new Date(p.publishDate).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      image: getLocalizedText(p, language, "featuredImage") || p.featuredImage || "",
    }));

    const categories = Array.from(
      new Set(publishedPosts.map((p) => p.categories?.[0]).filter(Boolean))
    ) as string[];

    return { recentPosts, categories };
    
  } catch (error) {
    console.error("Error fetching sidebar data:", error);
    return { recentPosts: [], categories: [] };
  }
}

// Main component
export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;
  const language = ((await cookies()).get("language")?.value === "en" ? "en" : "vi") as LanguageCode;
  
  console.log('Blog Detail Page - Post ID:', id);
  
  const post = await getPost(id, language);
  
  if (!post) {
    console.log('Post not found, calling notFound()');
    notFound();
  }

  const { recentPosts, categories } = await getSidebarData(language);

  return (
    <BlogPostDetail
      post={post}
      recentPosts={recentPosts}
      categories={categories}
    />
  );
}

// Metadata (optional)
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const language = ((await cookies()).get("language")?.value === "en" ? "en" : "vi") as LanguageCode;
  const post = await getPost(id, language);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}
