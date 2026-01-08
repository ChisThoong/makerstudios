"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface Contact {
  _id: string;
  fullName: string;
  email: string;
  title: string;
  message: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchContacts(page = 1, search = "") {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...(search && { search }),
      });

      const res = await fetch(`/api/contacts?${params}`);
      const data = await res.json();

      if (data.success) {
        setContacts(data.contacts || []);
        setPagination(data.pagination);
      } else {
        toast.error("Failed to load contacts");
      }
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts(1, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Contacts</CardTitle>
          <CardDescription className="mt-2">
            Total contacts: {pagination.total}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Search */}
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search name, email, title, message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No contacts found
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">
                        Contact
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">
                        Title
                      </th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-700">
                        Message
                      </th>
                      <th className="text-right p-4 text-sm font-semibold text-gray-700">
                        Created At
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {contacts.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50">
                        {/* Name + Email */}
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 font-medium">
                              <User className="w-4 h-4 text-gray-400" />
                              {c.fullName}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              {c.email}
                            </div>
                          </div>
                        </td>

                        {/* Title */}
                        <td className="p-4 text-sm text-gray-700">
                          {c.title}
                        </td>

                        {/* Message */}
                        <td className="p-4 text-sm text-gray-600 max-w-md">
                          <div className="flex gap-2">                          
                            <p className="line-clamp-2">{c.message}</p>
                          </div>
                        </td>

                        {/* Created At */}
                        <td className="p-4 text-sm text-gray-600 text-right">
                          <div className="flex items-center justify-end gap-2">                         
                            {new Date(c.createdAt).toLocaleString()}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {(pagination.page - 1) * pagination.limit + 1} –{" "}
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}{" "}
                  of {pagination.total}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrev}
                    onClick={() =>
                      fetchContacts(pagination.page - 1, searchQuery)
                    }
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Prev
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNext}
                    onClick={() =>
                      fetchContacts(pagination.page + 1, searchQuery)
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
