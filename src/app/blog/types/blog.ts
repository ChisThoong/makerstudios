export interface Author {
    name: string;
    role: string;
    avatar: string;
  }
  
  export interface BlogPost {
    id: string;
    image: string;
    featuredImage?: string;
    category: string;
    date: string;
    publishDate?: string;
    title: string;
    excerpt?: string;
    content?: string;
    translations?: {
      vi?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
      en?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
    };
    slug: string;
    author: Author;
    commentsCount: number;
    readTime?: string;
  }
  
  export interface RecentPost {
    id: string;
    title: string;
    date: string;
    publishDate?: string;
    image: string;
    featuredImage?: string;
    translations?: {
      vi?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
      en?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
    };
    slug: string;
  }
  
  export interface ApiPost {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: string;
    categories?: string[];
    publishDate: string;
    excerpt?: string;
    content?: string;
    translations?: {
      vi?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
      en?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
    };
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
  
  export interface ApiResponse {
    posts?: ApiPost[];
    success?: boolean;
    message?: string;
  }
