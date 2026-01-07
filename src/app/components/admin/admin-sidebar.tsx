"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  Newspaper,
  Gamepad2,
  Layers,
  LogOut,
  Menu,
  X,
  MailCheck,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/",
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
    {
      label: "Technology Stack",
      href: "/admin/technology-stack",
      icon: <Layers className="w-5 h-5" />,
    },
    {
      label: "Subscibers",
      href: "/admin/subscribers",
      icon: <MailCheck className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-50 md:hidden bg-white p-2 rounded-xl shadow border"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Overlay (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[280px]
          bg-gradient-to-b from-slate-50 to-gray-100
          border-r border-gray-200 shadow-xl
          flex flex-col
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header / Logo */}
        <div className="relative px-5 py-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 overflow-hidden">
              <img
                src="/images/logo.png"
                alt="Maker Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Maker Studios
              </h1>
              <p className="text-xs text-gray-500">
                Management Console
              </p>
            </div>
          </div>

          {/* Close (mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-5 right-5 md:hidden"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item, i) => {
            const active = isActive(item.href);

            return (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl
                  transition-all
                  ${
                    active
                      ? "bg-blue-100 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600 border border-transparent"
                  }
                `}
              >
                {item.icon}
                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </motion.a>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-5 py-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="text-sm font-semibold text-gray-800 truncate">
              Admin System
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
              bg-red-50 hover:bg-red-100 text-red-600
              border border-red-200 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 text-center text-xs text-gray-400">
          © 2025 Maker Studios
        </div>
      </aside>
    </>
  );
}
