"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (!userStr) {
      router.push('/')
      return
    }
    const user = JSON.parse(userStr)
    if (user.role !== 'admin') {
      router.push('/')
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - composant réutilisable */}
      <Sidebar
        title="Admin Panel"
        links={[
          { href: "/admin/dashbord", label: "Dashboard" }
        ]}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar - composant réutilisable */}
        <Navbar title="Admin Dashboard" userName="Admin" />

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
