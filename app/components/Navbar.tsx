"use client";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";
import type { NavbarProps } from "@/app/types";

export default function Navbar({ title, userName }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <FaSearch className="text-slate-600" />
        </button>

        {/* Notifications */}
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
          <FaBell className="text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
          <FaUser className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{userName}</span>
        </div>
      </div>
    </nav>
  );
}
