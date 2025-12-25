"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, MoreVertical, Plus, Search } from "lucide-react";

export default function BlogsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const router = useRouter();

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/api/blog");
    const data = await res.json();

    if (data.success) {
      setPosts(data.posts);
      setFilteredPosts(data.posts);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = [...posts];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((post) => {
        if (Array.isArray(post.categories)) {
          return post.categories.includes(categoryFilter);
        }
        return post.category === categoryFilter;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }

    // Visibility filter
    if (visibilityFilter !== "all") {
      filtered = filtered.filter((post) => post.visibility === visibilityFilter);
    }

    setFilteredPosts(filtered);
  }, [searchQuery, categoryFilter, statusFilter, visibilityFilter, posts]);

  async function confirmDelete() {
    if (!deleteId) return;

    const res = await fetch(`/api/blog/${deleteId}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      toast.success("Post deleted successfully");
      fetchPosts();
    } else {
      toast.error("Failed to delete post");
    }
    setDeleteId(null);
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, any> = {
      published: "default",
      draft: "secondary",
      archived: "outline",
    };

    return (
      <Badge variant={variants[status] || "secondary"}>
        {status || "draft"}
      </Badge>
    );
  }

  function getVisibilityBadge(visibility: string) {
    const variants: Record<string, any> = {
      public: "default",
      private: "secondary",
    };

    const colors: Record<string, string> = {
      public: "bg-green-100 text-green-800",
      private: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[visibility] || "bg-gray-100 text-gray-800"
        }`}
      >
        {visibility || "public"}
      </span>
    );
  }

  function getCategoryBadge(categories: string | string[]) {
    const colors: Record<string, string> = {
      News: "bg-blue-100 text-blue-800",
      Event: "bg-pink-100 text-pink-800",
    };

    // Handle array of categories
    if (Array.isArray(categories)) {
      return (
        <div className="flex flex-wrap gap-1">
          {categories.map((cat, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[cat] || "bg-gray-100 text-gray-800"
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      );
    }

    // Handle single category
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[categories] || "bg-gray-100 text-gray-800"
        }`}
      >
        {categories}
      </span>
    );
  }

  // Get unique categories from posts
  const categories = Array.from(
    new Set(
      posts.flatMap((p) => 
        Array.isArray(p.categories) ? p.categories : [p.category]
      ).filter(Boolean)
    )
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Blog Posts</CardTitle>
              <CardDescription className="mt-2">
                Manage your blog posts, categories, and publishing status
              </CardDescription>
            </div>
            <Button className="bg-blue-600" onClick={() => router.push("/admin/blogs/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Create New
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visibility</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all" || visibilityFilter !== "all"
                  ? "No posts found matching your filters"
                  : "No blog posts yet. Create your first post!"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Title
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Category
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Visibility
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Created At
                    </th>
                    <th className="text-right p-4 font-semibold text-sm text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {filteredPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {getCategoryBadge(post.categories || post.category)}
                      </td>
                      <td className="p-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="p-4">
                        {getVisibilityBadge(post.visibility)}
                      </td>
                      <td className="p-4 text-gray-600 text-sm">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/admin/blogs/${post._id}`)
                              }
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(post._id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Summary */}
          {!loading && filteredPosts.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredPosts.length} of {posts.length} posts
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}