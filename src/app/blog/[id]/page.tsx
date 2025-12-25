import { notFound } from "next/navigation";
import BlogPostDetail from "../components/blog-post-detail";
import { BlogPost, RecentPost } from "../types/blog";

type Props = {
  params: Promise<{ id: string }>;
};

// Hàm lấy thông tin 1 bài post
async function getPost(id: string): Promise<BlogPost | null> {
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
    console.log('API Response:', response);
    
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
      image: data.featuredImage || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
      category: data.categories?.[0] || "Uncategorized",
      date: new Date(data.publishDate).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      title: data.title,
      excerpt: data.excerpt || "",
      content: data.content || "",
      author: {
        name: data.author?.name || "Admin",
        role: data.author?.role || "Co. Founder",
        avatar: data.author?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      },
      commentsCount: data.commentsCount || 0,
      readTime: "5 phút đọc",
    };

    console.log('Transformed post:', post);
    return post;
    
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

// Hàm lấy dữ liệu sidebar
async function getSidebarData() {
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
    const posts = data.posts || [];

    // Filter only published and public posts
    const publishedPosts = posts.filter(
      (p: any) => p.status === "published" && p.visibility === "public"
    );

    const recentPosts: RecentPost[] = publishedPosts.slice(0, 3).map((p: any) => ({
      id: p._id,
      slug: p._id,
      title: p.title,
      date: new Date(p.publishDate).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      image: p.featuredImage || "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400",
    }));

    const categories = Array.from(
      new Set(publishedPosts.map((p: any) => p.categories?.[0]).filter(Boolean))
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
  
  console.log('Blog Detail Page - Post ID:', id);
  
  const post = await getPost(id);
  
  if (!post) {
    console.log('Post not found, calling notFound()');
    notFound();
  }

  const { recentPosts, categories } = await getSidebarData();

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
  const post = await getPost(id);
  
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