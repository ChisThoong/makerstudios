"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  FileText,
  Gamepad2,
  TrendingUp,
  Calendar,
  Tag,
} from "lucide-react";

interface DashboardStats {
  overview: {
    totalGames: number;
    totalPosts: number;
    totalSubscribers: number;
    totalTechStacks: number;
    activeGames: number;
    publishedPosts: number;
    draftPosts: number;
  };
  growth: {
    games: number;
    posts: number;
    subscribers: number;
  };
  categories: {
    games: Array<{ _id: string; count: number }>;
    posts: Array<{ _id: string; count: number }>;
  };
  recentActivity: {
    games: any[];
    posts: any[];
    subscribers: any[];
  };
}

const COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#6366f1",
  "#14b8a6",
  "#f97316",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/stats");
        const data = await res.json();

        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Games",
      value: stats.overview.totalGames,
      change: stats.growth.games,
      icon: Gamepad2,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Posts",
      value: stats.overview.totalPosts,
      change: stats.growth.posts,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Subscribers",
      value: stats.overview.totalSubscribers,
      change: stats.growth.subscribers,
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100",
    },
    {
      title: "Tech Stack",
      value: stats.overview.totalTechStacks,
      change: 0,
      icon: Tag,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  // Prepare data for charts
  const statusData = [
    { name: "Active Games", value: stats.overview.activeGames },
    {
      name: "Inactive Games",
      value: stats.overview.totalGames - stats.overview.activeGames,
    },
    { name: "Published Posts", value: stats.overview.publishedPosts },
    { name: "Draft Posts", value: stats.overview.draftPosts },
  ];

  const gamesCategoryData = stats.categories.games.map((cat) => ({
    name: cat._id || "Uncategorized",
    value: cat.count,
  }));

  const postsCategoryData = stats.categories.posts.map((cat) => ({
    name: cat._id || "Uncategorized",
    value: cat.count,
  }));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  {stat.change > 0 && (
                    <div className="flex items-center mt-2 text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span>+{stat.change} this month</span>
                    </div>
                  )}
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
        {/* Status Distribution */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Content Status Distribution</CardTitle>
            <CardDescription>
              Overview of active games and published posts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => {
                    if (percent === undefined) return "";
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card> */}

        {/* Growth Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>30-Day Growth</CardTitle>
            <CardDescription>
              New content added in the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Games", count: stats.growth.games },
                  { name: "Posts", count: stats.growth.posts },
                  { name: "Subscribers", count: stats.growth.subscribers },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Games by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Games by Category</CardTitle>
            <CardDescription>
              Distribution of games across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {gamesCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={gamesCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Posts by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
            <CardDescription>
              Distribution of posts across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {postsCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={postsCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-400">
                No category data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Games */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Games</CardTitle>
            <CardDescription>Latest games added</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.games.length > 0 ? (
                stats.recentActivity.games.map((game) => (
                  <div
                    key={game._id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {game.logo && (
                      <img
                        src={game.logo}
                        alt={game.name}
                        className="w-10 h-10 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {game.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(game.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  No recent games
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Posts</CardTitle>
            <CardDescription>Latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.posts.length > 0 ? (
                stats.recentActivity.posts.map((post) => (
                  <div
                    key={post._id}
                    className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-sm line-clamp-2">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.status}
                      </span>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  No recent posts
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Subscribers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Subscribers</CardTitle>
            <CardDescription>Latest email subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.subscribers.length > 0 ? (
                stats.recentActivity.subscribers.map((subscriber) => (
                  <div
                    key={subscriber._id}
                    className="p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-sm truncate">
                      {subscriber.email}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(subscriber.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  No recent subscribers
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}