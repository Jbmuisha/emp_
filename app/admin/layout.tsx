"use client";
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import {
  FaCalendarDay,
  FaFileWord,
  FaMeetup,
  FaMoneyBill,
  FaTachometerAlt,
  FaUser,
  FaWallet,
  FaWordpress,
} from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  useEffect(() => {
    // read user data once after mount (safe to access localStorage here)
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);
      setUserName(user.name || user.email || 'Admin');
    } catch (error) {
      console.error("Failed to parse user data", error);
    }
  }, []);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        router.push('/');
      }
    } catch (error) {
      console.error("Failed to parse user data", error);
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const adminLinks = [
    { href: "/admin/dashboard",   label: "Dashboard",   icon: <FaTachometerAlt /> },
    { href: "/admin/products",    label: "Products",    icon: <FaTachometerAlt /> },
    { href: "/admin/salary",      label: "Salary",      icon: <FaWallet />        },
    { href: "/admin/department",  label: "Department",  icon: <FaFileWord />      },
    { href: "/admin/attendance",  label: "Attendance",  icon: <FaCalendarDay />   },
    { href: "/admin/appointment", label: "Appointment", icon: <FaMeetup />        },
    { href: "/admin/work",        label: "Workschedular",        icon: <FaWordpress />     },
    { href: "/admin/finance",     label: "Finance",     icon: <FaMoneyBill />     },

    {href:"/admin/usermanage",label:"usermanger",icon:<FaUser/>}
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar
        title="Admin Panel"
        links={adminLinks}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          title="Admin Dashboard"
          userName={userName}
          showSearch
          showNotifications
          showTranslate
          showLogo
        />

        <main className="flex-1 p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}