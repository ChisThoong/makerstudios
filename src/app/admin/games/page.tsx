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
import { Pencil, Trash2, MoreVertical, Plus, Search, ExternalLink } from "lucide-react";

export default function GamesPage() {
  const [games, setGames] = useState<any[]>([]);
  const [filteredGames, setFilteredGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  async function fetchGames() {
    setLoading(true);
    const res = await fetch("/api/game");
    const data = await res.json();

    if (data.success) {
      setGames(data.games);
      setFilteredGames(data.games);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchGames();
  }, []);

  // Filter games
  useEffect(() => {
    let filtered = [...games];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((game) => {
        if (Array.isArray(game.categories)) {
          return game.categories.includes(categoryFilter);
        }
        return game.category === categoryFilter;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((game) => game.status === statusFilter);
    }

    setFilteredGames(filtered);
  }, [searchQuery, categoryFilter, statusFilter, games]);

  async function confirmDelete() {
    if (!deleteId) return;

    const res = await fetch(`/api/game/${deleteId}`, { method: "DELETE" });
    const data = await res.json();

    if (data.success) {
      toast.success("Game deleted successfully");
      fetchGames();
    } else {
      toast.error("Failed to delete game");
    }
    setDeleteId(null);
  }

  function getStatusBadge(status: string) {
    const colors: Record<string, string> = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status || "active"}
      </span>
    );
  }

  function getCategoryBadge(categories: string | string[]) {
    const colors: Record<string, string> = {
      Action: "bg-red-100 text-red-800",
      Adventure: "bg-blue-100 text-blue-800",
      RPG: "bg-purple-100 text-purple-800",
      Strategy: "bg-yellow-100 text-yellow-800",
      Sports: "bg-green-100 text-green-800",
      Puzzle: "bg-pink-100 text-pink-800",
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

  // Get unique categories from games
  const categories = Array.from(
    new Set(
      games.flatMap((g) => 
        Array.isArray(g.categories) ? g.categories : [g.category]
      ).filter(Boolean)
    )
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Games</CardTitle>
              <CardDescription className="mt-2">
                Manage your game collection, categories, and status
              </CardDescription>
            </div>
            <Button className="bg-blue-600" onClick={() => router.push("/admin/games/new")}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Game
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search games..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                  ? "No games found matching your filters"
                  : "No games yet. Add your first game!"}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Game
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Category
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      URL
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
  {filteredGames.map((game) => (
    <tr
      key={game._id}
      className="hover:bg-gray-50 transition-colors"
    >
      {/* Game */}
      <td className="p-4">
        <div className="flex items-center gap-3">
          {game.logo && (
            <img
              src={game.logo}
              alt={game.name}
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div>
            <div className="font-medium text-gray-900">
              {game.name}
            </div>
            {game.description && (
              <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                {game.description}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="p-4">
        {getCategoryBadge(game.categories || game.category)}
      </td>

      {/* Status */}
      <td className="p-4">
        {getStatusBadge(game.status)}
      </td>

      {/* URL */}
      <td className="p-4">
        {game.url ? (
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-1"
          >
            Visit
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-gray-400 text-sm">—</span>
        )}
      </td>

      {/* Created At */}
      <td className="p-4 text-gray-600 text-sm">
        {new Date(game.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      {/* Actions */}
      <td className="p-4 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => router.push(`/admin/games/${game._id}`)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDeleteId(game._id)}
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
          {!loading && filteredGames.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredGames.length} of {games.length} games
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
              game and remove it from our servers.
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