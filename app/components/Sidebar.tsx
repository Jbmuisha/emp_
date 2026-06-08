"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SidebarProps } from "@/app/types";

export default function Sidebar({ title, links, onLogout }: SidebarProps) {
  const router = useRouter();

  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo/Title */}
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white"
              >
                {link.icon && <span className="text-lg">{link.icon}</span>}
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white font-semibold"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
}
