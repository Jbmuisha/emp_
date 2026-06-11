"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { FaAccessibleIcon, FaListAlt, FaTachometerAlt, FaWallet } from "react-icons/fa";
import { FaFileCircleCheck, FaList } from "react-icons/fa6";

export default function EmployeeLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState("employee");

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      router.push("/");
      return;
    }
    try {
      const userData = JSON.parse(userStr);

      if (userData.role !== "employee") {
        router.push("/");
      } else {
        setUser(userData.name || userData.email || "employee");
      }
    } catch (error) {
      console.error("Failed to parse user data", error);
      router.push("/");
    }
  }, [router]);

  const employeeItems = [
    { href: "/employee/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/employee/products", label: "Products", icon: <FaListAlt /> },
    { href: "/employee/programs", label: "Programs", icon: <FaFileCircleCheck /> },
    { href: "/employee/appointment", label: "Appointment", icon: <FaList /> },
    { href: "/employee/attendance", label: "Attendance", icon: <FaAccessibleIcon /> },
    { href: "/employee/finances", label: "Finances", icon: <FaWallet /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar
        title="Admin Panel"
        links={employeeItems}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Navbar
          title="Admin Dashboard"
          userName={user}
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
