'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminSalaries() {
  const router = useRouter();
  
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      router.push('/');
    }
  }, [router]);

  return (
    <div>
      <h1>Salary Management</h1>
      <p>Manage employee salaries here.</p>
    </div>
  );
}
