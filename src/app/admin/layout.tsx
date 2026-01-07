import AdminSidebar from "../components/admin/admin-sidebar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="ml-0 md:ml-[280px] flex-1 min-h-screen bg-gray-50 p-6">
        {children}
        <Toaster position="top-right" richColors />
      </main>
    </div>
  );
}
