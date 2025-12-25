import AdminSidebar from "../components/admin/admin-sidebar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8 text-gray-500">
        {children}
        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
}
