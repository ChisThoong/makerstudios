"use client";
import { motion } from "framer-motion";
import { LayoutGrid, Newspaper, Gamepad2, LogOut } from "lucide-react";

async function logout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login"; 
  }
export default function AdminSidebar() {
  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutGrid className="w-5 h-5" />,
    },
    {
      label: "Blogs",
      href: "/admin/blogs",
      icon: <Newspaper className="w-5 h-5" />,
    },
    {
      label: "Games",
      href: "/admin/games",
      icon: <Gamepad2 className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-[280px] h-screen h-full bg-gradient-to-b from-slate-50 to-gray-100 shadow-xl flex flex-col relative overflow-hidden border-r border-gray-200">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Logo */}
      <div className="relative z-10 px-5 py-6 border-b border-gray-200">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12  flex items-center justify-center overflow-hidden">
            <img 
              src="/images/logo.png" 
              alt="Maker Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">
              Maker Studios
            </h1>
            <p className="text-xs text-gray-500">Management Console</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex flex-col gap-2 mt-6 px-3 flex-1">
        {navItems.map((item, i) => (
          <a key={i} href={item.href}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl hover:bg-blue-50 text-gray-600 hover:text-blue-600 cursor-pointer transition-all border border-transparent hover:border-blue-200 hover:shadow-sm group"
            >
              <div className="relative">
                {item.icon}
                <div className="absolute inset-0 bg-blue-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm font-medium">
                {item.label}
              </span>
            </motion.div>
          </a>
        ))}
      </nav>

      {/* User Info & Logout */}
      <div className="relative z-10 px-5 py-4 border-t border-gray-200 space-y-3">
        {/* User Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-200 shadow-sm"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 truncate">Admin System</div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={async () => {
            await fetch("/api/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 cursor-pointer transition-all border border-red-200 hover:border-red-300 hover:shadow-sm group"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </motion.button>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-5 py-4 text-center">
        <div className="text-xs text-gray-400">
          <p>© 2025 Maker Studios</p>
          
        </div>
      </div>
    </aside>
  );
}