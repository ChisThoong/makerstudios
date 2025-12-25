export interface Author {
    name: string;
    role: string;
    avatar: string;
  }
  
  export interface BlogPost {
    id: string;
    image: string;
    category: string;
    date: string;
    title: string;
    excerpt?: string;
    content?: string;
    slug: string;
    author: Author;
    commentsCount: number;
    readTime?: string;
  }
  
  export interface RecentPost {
    id: string;
    title: string;
    date: string;
    image: string;
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