"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import type { LayoutProps, User } from "../types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaAccessibleIcon, FaLine, FaListAlt, FaTachometerAlt, FaWallet } from "react-icons/fa";
import { FaFileCircleCheck, FaList } from "react-icons/fa6";
import { errorMonitor } from "events";

export default function EmployeeLayout({ children }: LayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState("emplyoyee");

  useEffect(() => {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
      router.push("/");
      return;
    }
    try{

    const userData = JSON.parse(userStr);

    if (userData.role !== "employee") {
      router.push("/");
    
    }
    else{
      setUser(userData.name || userData.email || "employee");
    }
  }catch(error){
   console.error("Failed to parse user data", error);
   router.push('/');

  }
  }, [router]);



  const employeeItem=[
    {href:"/employee/dashbord",label:"dashbord",icon:<FaTachometerAlt/>},
    {href:"/employee/products",label:"products",icon:<FaListAlt/>},
    {href:"/employee/programs",label:"programs",icon:<FaFileCircleCheck/>},
    {href:"/employee/appointment",label:"appointement",icon:<FaList/>},
    {href:"/employee/attendance",label:"attendace",icon:<FaAccessibleIcon/>},
    {href:"/employee/finances",label:"finances",icon:<FaWallet/>}

  ]

  function handleLogout(): void {
    throw new Error("Function not implemented.");
  }

  return(
    
   <div className="flex min-h-screen">
         <Sidebar
           title="Admin Panel"
           links={employeeItem}
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
       </div>)
};