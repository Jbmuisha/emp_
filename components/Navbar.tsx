"use client";
import { FaBell, FaSearch, FaUser } from "react-icons/fa";
import Image from "next/image";

interface NavbarProps {
  title: string;
  userName: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showTranslate?: boolean;
  showLogo?: boolean;
}

export default function Navbar({
  title,
  userName,
  showSearch = true,
  showNotifications = true,
  showTranslate = false,
  showLogo = false,
}: NavbarProps) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">

      {/* Left Side - Logo + Title */}
      <div className="flex items-center gap-3">
        {showLogo && (
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded" />
        )}
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">

        {/* Search Input */}
        {showSearch && (
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg">
            <FaSearch className="text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-slate-700 outline-none w-40 placeholder-slate-400"
            />
          </div>
        )}

        {/* Translate */}
        {showTranslate && (
          <select className="text-sm border border-slate-200 rounded-lg px-2 py-2 text-slate-600 bg-white outline-none cursor-pointer hover:bg-slate-50">
            <option value="en">🇬🇧 EN</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="ar">🇸🇦 AR</option>
          </select>
        )}

        {/* Notifications */}
        {showNotifications && (
          <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
            <FaBell className="text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}

        {/* Profile */}
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
          <FaUser className="text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{userName}</span>
        </div>

      </div>
    </nav>
  );
}