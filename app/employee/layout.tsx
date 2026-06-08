"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCalendarDay, FaFileWord, FaMeetup, FaTachometerAlt, FaWallet } from "react-icons/fa";
import { UserData } from "@/app/types";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function EmployeeLayout({
   children,
}:{
  children: React.ReactNode;
}){
  const router = useRouter();
  
  // State explicitly typed using the interface above
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/");
      return;
    }
    try {
      const userData: UserData = JSON.parse(userStr);
      setUser(userData);
      if (userData.role !== "employee") {
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to parse user data from localStorage", error);
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  const employeeLinks = [
    { href: "/employee/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/employee/salary", label: "Salary", icon: <FaWallet /> },
    { href: "/employee/department", label: "Department", icon: <FaFileWord /> },
    { href: "/employee/attendance", label: "Attendance", icon: <FaCalendarDay /> },
    { href: "/employee/meeting", label: "Meeting", icon: <FaMeetup /> },
  ];

  const userName = user?.name || user?.email || "Employee";

  return (
    <div className="flex min-h-screen">
      <Sidebar
        title="Employee Panel"
        links={employeeLinks}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col">
        <Navbar title="Employee Dashboard" userName={userName} />
        <main className="flex-1 p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}
