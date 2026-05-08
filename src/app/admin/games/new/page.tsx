"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUrlUpload from "@/src/app/components/admin/image-url-upload";
import {
  Calendar,
  Tag,
  Plus,
  X,
  Save,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Gamepad2,
} from "lucide-react";

export default function NewGamePage() {
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<"vi" | "en">("vi");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [googlePlayUrl, setGooglePlayUrl] = useState("");
  const [appStoreUrl, setAppStoreUrl] = useState("");
  const [banner, setBanner] = useState("");
  const [logo, setLogo] = useState("");
  const [description, setDescription] = useState("");
  const [translations, setTranslations] = useState({
    vi: { name: "", description: "" },
    en: { name: "", description: "" },
  });
  const [status, setStatus] = useState<"active" | "inactive">("active");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // Mock categories
  const [categories, setCategories] = useState([
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Sports",
    "Puzzle",
  ]);

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

  const handleSubmit = async (saveStatus: "active" | "inactive") => {
    const primaryName = translations.vi.name || name;
    const primaryDescription = translations.vi.description || description;

    if (!primaryName || !url) {
      toast.error("Name and URL are required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: primaryName,
        slug,
        url,
        googlePlayUrl,
        appStoreUrl,
        banner,
        logo,
        description: primaryDescription,
        translations,
        status: saveStatus,
        categories: selectedCategories,
        tags,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      toast.success(`Game has been ${saveStatus === "inactive" ? "saved as inactive" : "added successfully"}!`);
      router.push("/admin/games");
    } else {
      toast.error(data.error || "Failed to save game");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col xl:flex-row">
        {/* Main Content Area */}
        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <div className="w-full">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Add New Game</h1>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSubmit("inactive")}
                  disabled={loading}
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save as Inactive
                </button>
                <button
                  onClick={() => handleSubmit("active")}
                  disabled={loading}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  {loading ? "Saving..." : "Add Game"}
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

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Name ({activeLocale.toUpperCase()}) *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="Enter game name..."
                  value={translations[activeLocale].name}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTranslations((current) => ({
                      ...current,
                      [activeLocale]: {
                        ...current[activeLocale],
                        name: value,
                      },
                    }));
                    if (activeLocale === "vi") setName(value);
                    if (activeLocale === "vi" && !slug) {
                      setSlug(
                        value
                          .toLowerCase()
                          .replace(/\s+/g, "-")
                          .replace(/[^a-z0-9-]/g, "")
                      );
                    }
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
                  <span className="text-gray-500 text-sm">makerstudios.vn/games/</span>
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

              {/* Game URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game URL *
                </label>
                <input
                  type="url"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  The homepage URL of the game
                </p>
              </div>

              {/* Download URLs */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Play URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://play.google.com/store/apps/details?id=..."
                    value={googlePlayUrl}
                    onChange={(e) => setGooglePlayUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Download URL for Android users
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    App Store URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://apps.apple.com/app/..."
                    value={appStoreUrl}
                    onChange={(e) => setAppStoreUrl(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Download URL for iOS users
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Brief description of the game (optional)..."
                  value={translations[activeLocale].description}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTranslations((current) => ({
                      ...current,
                      [activeLocale]: {
                        ...current[activeLocale],
                        description: value,
                      },
                    }));
                    if (activeLocale === "vi") setDescription(value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full border-t border-gray-200 bg-white p-4 sm:p-6 xl:w-[360px] xl:shrink-0 xl:border-l xl:border-t-0 2xl:w-[400px] space-y-6 overflow-y-auto">
          {/* Status Settings */}
          <div className="pb-6 border-b border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Status Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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

          {/* Logo */}
          <div className="pb-6 border-b border-gray-200">
            <ImageUrlUpload
              label="Logo"
              value={logo}
              onChange={setLogo}
              placeholder="Enter logo URL..."
              uploadLabel="Upload Logo"
              previewAlt="Logo"
              previewClassName="h-48 object-contain"
            />
          </div>

          {/* Banner */}
          <div>
            <ImageUrlUpload
              label="Banner Image"
              value={banner}
              onChange={setBanner}
              placeholder="Enter banner URL..."
              uploadLabel="Upload Banner"
              previewAlt="Banner"
              previewClassName="h-48 object-cover"
            />
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
