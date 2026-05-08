"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import BlogEditor from "@/src/app/components/admin/blog-editor";
import ImageUrlUpload from "@/src/app/components/admin/image-url-upload";
import { toast } from "sonner";

import {
  Calendar,
  Tag,
  Eye,
  Plus,
  X,
  Save,
  FileText,
  ArrowLeft,
} from "lucide-react";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [activeLocale, setActiveLocale] = useState<"vi" | "en">("vi");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [translations, setTranslations] = useState({
    vi: { title: "", content: "", excerpt: "", featuredImage: "" },
    en: { title: "", content: "", excerpt: "", featuredImage: "" },
  });
  const [featuredImage, setFeaturedImage] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState([
    "News",
    "Event",
    // "Business",
    // "Marketing",
    // "Development",
  ]);

  type AdminPost = {
    _id: string;
    title?: string;
    content?: string;
    slug?: string;
    excerpt?: string;
    translations?: {
      vi?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
      en?: { title?: string; content?: string; excerpt?: string; featuredImage?: string };
    };
    featuredImage?: string;
    publishDate?: string;
    status?: "draft" | "published";
    categories?: string[];
    tags?: string[];
    visibility?: "public" | "private";
  };

  // Fetch bài viết
  useEffect(() => {
    async function loadPost() {
      const res = await fetch("/api/blog");
      const data = await res.json();

      if (data.success) {
        const found = (data.posts as AdminPost[]).find((p) => p._id === id);
        if (found) {
          setTitle(found.title || "");
          setContent(found.content || "");
          setSlug(found.slug || "");
          setExcerpt(found.excerpt || "");
          setTranslations({
            vi: {
              title: found.translations?.vi?.title || found.title || "",
              content: found.translations?.vi?.content || found.content || "",
              excerpt: found.translations?.vi?.excerpt || found.excerpt || "",
              featuredImage: found.translations?.vi?.featuredImage || found.featuredImage || "",
            },
            en: {
              title: found.translations?.en?.title || "",
              content: found.translations?.en?.content || "",
              excerpt: found.translations?.en?.excerpt || "",
              featuredImage: found.translations?.en?.featuredImage || "",
            },
          });
          setFeaturedImage(found.featuredImage || "");
          setPublishDate(
            found.publishDate
              ? new Date(found.publishDate).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16)
          );
          setStatus(found.status || "draft");
          setSelectedCategories(found.categories || []);
          setTags(found.tags || []);
          setVisibility(found.visibility || "public");
        }
      }
      setLoading(false);
    }
    loadPost();
  }, [id]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setSelectedCategories([...selectedCategories, newCategory.trim()]);
      setNewCategory("");
      setShowCategoryModal(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (saveStatus: "draft" | "published") => {
    const primaryTitle = translations.vi.title || title;
    const primaryContent = translations.vi.content || content;
    const primaryExcerpt = translations.vi.excerpt || excerpt;
    const primaryFeaturedImage = translations.vi.featuredImage || featuredImage;

    setSaving(true);

    const res = await fetch(`/api/blog/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: primaryTitle,
        slug,
        content: primaryContent,
        excerpt: primaryExcerpt,
        translations,
        featuredImage: primaryFeaturedImage,
        publishDate,
        status: saveStatus,
        categories: selectedCategories,
        tags,
        visibility,
      }),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      toast.success(
        saveStatus === "draft"
          ? "Draft saved successfully"
          : "Post updated successfully"
      );
    
      router.push("/admin/blogs");
    } else {
      toast.error(data.error || "Failed to update post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col xl:flex-row">
        {/* Main Content Area */}
        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <button
                  type="button"
                  onClick={() => router.push("/admin/blogs")}
                  className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Posts
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmit("draft")}
                  disabled={saving}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
                <button
                  onClick={() => handleSubmit("published")}
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {saving ? "Updating..." : "Update"}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
              <div className="flex w-fit rounded-lg border border-blue-100 bg-blue-50 p-1">
                {(["vi", "en"] as const).map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => setActiveLocale(locale)}
                    className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                      activeLocale === locale
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-blue-700 hover:bg-white"
                    }`}
                  >
                    {locale === "vi" ? "Tiếng Việt" : "English"}
                  </button>
                ))}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title ({activeLocale.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter an engaging title..."
                  value={translations[activeLocale].title}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTranslations((current) => ({
                      ...current,
                      [activeLocale]: { ...current[activeLocale], title: value },
                    }));
                    if (activeLocale === "vi") setTitle(value);
                  }}
                  required
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL Slug
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-sm">makerstudios.vn/blog/</span>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="url-friendly-slug"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
                    }
                  />
                </div>
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Content ({activeLocale.toUpperCase()}) *
                </label>
                <BlogEditor
                  key={activeLocale}
                  value={translations[activeLocale].content}
                  onChange={(value) => {
                    setTranslations((current) => ({
                      ...current,
                      [activeLocale]: { ...current[activeLocale], content: value },
                    }));
                    if (activeLocale === "vi") setContent(value);
                  }}
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Excerpt ({activeLocale.toUpperCase()})
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Brief summary of your post (optional)..."
                  value={translations[activeLocale].excerpt}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTranslations((current) => ({
                      ...current,
                      [activeLocale]: { ...current[activeLocale], excerpt: value },
                    }));
                    if (activeLocale === "vi") setExcerpt(value);
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be shown in blog listings and search results
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full border-t border-gray-200 bg-white p-4 sm:p-6 xl:w-[360px] xl:shrink-0 xl:border-l xl:border-t-0 2xl:w-[400px] space-y-6">
          {/* Publish Settings */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Publish Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publish Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Categories
              </h3>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Tags</h3>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-blue-900 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Featured Image */}
          <div className="pb-6 border-b border-gray-200">
            <ImageUrlUpload
              label={`Featured Image (${activeLocale.toUpperCase()})`}
              value={translations[activeLocale].featuredImage}
              onChange={(value) => {
                setTranslations((current) => ({
                  ...current,
                  [activeLocale]: { ...current[activeLocale], featuredImage: value },
                }));
                if (activeLocale === "vi") setFeaturedImage(value);
              }}
              placeholder="Enter image URL..."
              uploadLabel="Upload Image"
              previewAlt="Featured"
              previewClassName="h-48 object-cover"
            />
          </div>

          {/* Visibility */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visibility
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={visibility === "public"}
                  onChange={() => setVisibility("public")}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Public</div>
                  <div className="text-xs text-gray-500">Visible to everyone</div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={visibility === "private"}
                  onChange={() => setVisibility("private")}
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">Private</div>
                  <div className="text-xs text-gray-500">Only visible to site admins</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
            <h3 className="text-lg font-bold mb-4">Add New Category</h3>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="Category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
