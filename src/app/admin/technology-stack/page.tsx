"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ImageUrlUpload from "@/src/app/components/admin/image-url-upload";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, MoreVertical, Plus, GripVertical } from "lucide-react";

interface TechStack {
  _id: string;
  id: number;
  name: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function TechStackPage() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<TechStack | null>(null);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  async function fetchTechStacks() {
    setLoading(true);
    try {
      const res = await fetch("/api/technology-stacks");
      const data = await res.json();

      if (data.success) {
        setTechStacks(data.techStacks || []);
      }
    } catch (error) {
      toast.error("Failed to fetch technology stacks");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTechStacks();
  }, []);

  async function confirmDelete() {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/technology-stacks/${deleteId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Technology stack deleted successfully");
        fetchTechStacks();
      } else {
        toast.error("Failed to delete technology stack");
      }
    } catch (error) {
      toast.error("Failed to delete technology stack");
    }
    setDeleteId(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get next available ID
      const nextId = techStacks.length > 0 
        ? Math.max(...techStacks.map(t => t.id)) + 1 
        : 1;

      const res = await fetch("/api/technology-stacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: nextId,
          name: formData.name,
          imageUrl: formData.imageUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Technology stack added successfully");
        setIsAddDialogOpen(false);
        setFormData({ name: "", imageUrl: "" });
        fetchTechStacks();
      } else {
        toast.error(data.error || "Failed to add technology stack");
      }
    } catch (error) {
      toast.error("Failed to add technology stack");
    }
    setIsSubmitting(false);
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTech) return;
    
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/technology-stacks/${editingTech._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          imageUrl: formData.imageUrl,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Technology stack updated successfully");
        setIsEditDialogOpen(false);
        setEditingTech(null);
        setFormData({ name: "", imageUrl: "" });
        fetchTechStacks();
      } else {
        toast.error(data.error || "Failed to update technology stack");
      }
    } catch (error) {
      toast.error("Failed to update technology stack");
    }
    setIsSubmitting(false);
  }

  function openEditDialog(tech: TechStack) {
    setEditingTech(tech);
    setFormData({
      name: tech.name,
      imageUrl: tech.imageUrl,
    });
    setIsEditDialogOpen(true);
  }

  // Drag and Drop handlers
  function handleDragStart(e: React.DragEvent, index: number) {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === index) return;

    const items = [...techStacks];
    const draggedItemContent = items[draggedItem];
    
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedItemContent);

    // Update IDs based on new positions
    const updatedItems = items.map((item, idx) => ({
      ...item,
      id: idx + 1,
    }));

    setTechStacks(updatedItems);
    setDraggedItem(index);
  }

  async function handleDragEnd() {
    if (draggedItem === null) return;

    const updatedOrder = [...techStacks];
    
    try {
      // Create bulk update operations
      const bulkOps = updatedOrder.map((item) => ({
        _id: item._id,
        id: item.id,
      }));

      console.log("Updating order:", bulkOps);

      // Send all updates in parallel since we removed the unique constraint
      const updatePromises = bulkOps.map((item) =>
        fetch(`/api/technology-stacks/${item._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id }),
        }).then(res => res.json())
      );

      const results = await Promise.all(updatePromises);
      
      console.log("Update results:", results);

      // Check if any failed
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        throw new Error(`Failed to update ${failed.length} items`);
      }

      toast.success("Order updated successfully");
      // Refresh to confirm the order is saved correctly
      await fetchTechStacks();
    } catch (error) {
      console.error("Update order error:", error);
      toast.error("Failed to update order");
      fetchTechStacks(); // Refresh to restore original order
    }

    setDraggedItem(null);
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">Technology Stack</CardTitle>
              <CardDescription className="mt-2">
                Manage your technology stack. Drag and drop to reorder.
              </CardDescription>
            </div>
            <Button
              className="bg-blue-600"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Technology
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : techStacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No technology stacks yet. Add your first one!
              </p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700 w-12">
                      Order
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700 w-16">
                      ID
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Technology
                    </th>
                    <th className="text-left p-4 font-semibold text-sm text-gray-700">
                      Image URL
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
                  {techStacks.map((tech, index) => (
                    <tr
                      key={tech._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`hover:bg-gray-50 transition-colors cursor-move ${
                        draggedItem === index ? "opacity-50" : ""
                      }`}
                    >
                      {/* Drag Handle */}
                      <td className="p-4">
                        <GripVertical className="w-5 h-5 text-gray-400" />
                      </td>

                      {/* ID */}
                      <td className="p-4">
                        <span className="font-mono text-sm text-gray-600">
                          {tech.id}
                        </span>
                      </td>

                      {/* Technology Name & Image */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {tech.imageUrl && (
                            <img
                              src={tech.imageUrl}
                              alt={tech.name}
                              className="w-10 h-10 rounded object-contain bg-gray-50 p-1"
                            />
                          )}
                          <div className="font-medium text-gray-900">
                            {tech.name}
                          </div>
                        </div>
                      </td>

                      {/* Image URL */}
                      <td className="p-4">
                        <a
                          href={tech.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-xs"
                        >
                          {tech.imageUrl}
                        </a>
                      </td>

                      {/* Created At */}
                      <td className="p-4 text-gray-600 text-sm">
                        {new Date(tech.createdAt).toLocaleDateString("en-US", {
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
                              onClick={() => openEditDialog(tech)}
                            >
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteId(tech._id)}
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
          {!loading && techStacks.length > 0 && (
            <div className="mt-4 text-sm text-gray-500">
              Total: {techStacks.length} technologies
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Technology Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Technology</DialogTitle>
            <DialogDescription>
              Add a new technology to your stack. It will be added at the end
              and you can reorder it later.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <ImageUrlUpload
                  label="Image URL *"
                  value={formData.imageUrl}
                  onChange={(value) => setFormData({ ...formData, imageUrl: value })}
                  placeholder="https://example.com/logo.png"
                  uploadLabel="Upload Logo"
                  previewAlt="Preview"
                  previewClassName="h-20 object-contain"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setFormData({ name: "", imageUrl: "" });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Technology"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Technology Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Technology</DialogTitle>
            <DialogDescription>
              Update the technology information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEdit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="e.g., React, Node.js, MongoDB"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <ImageUrlUpload
                  label="Image URL *"
                  value={formData.imageUrl}
                  onChange={(value) => setFormData({ ...formData, imageUrl: value })}
                  placeholder="https://example.com/logo.png"
                  uploadLabel="Upload Logo"
                  previewAlt="Preview"
                  previewClassName="h-20 object-contain"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingTech(null);
                  setFormData({ name: "", imageUrl: "" });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Technology"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              technology stack and remove it from our servers.
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
