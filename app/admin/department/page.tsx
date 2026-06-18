'use client';

import { IDepartment } from "@/app/types/department";
import { IUser } from "@/app/types/Users";
import { Search, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from 'react';

export default function AdminDepartment() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [employees, setEmployees] = useState<IUser[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [userSelected, setUserSelected] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');

// Fetch departments and employees on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Fetching data...');
        
        const [deptRes, userRes] = await Promise.all([
          fetch('/api/department'),
          fetch('/api/users')
        ]);

        const userData = await userRes.json();
        const deptData = await deptRes.json();
        
        console.log('📋 Department API response:', deptData);
        console.log('👥 Users API response:', userData);
        console.log('📋 Is deptData an array?', Array.isArray(deptData));
        console.log('📋 deptData length:', deptData?.length);
        
        if (Array.isArray(deptData) && deptData.length > 0) {
          setDepartments(deptData);
          console.log('✅ Departments loaded from API:', deptData);
        } else {
          // Fallback: default departments if DB is empty
          console.log('⚠️ Using fallback departments - API returned:', deptData);
          setDepartments([
            { _id: '1', name: 'HR', description: 'Human Resources' },
            { _id: '2', name: 'Engineering', description: 'Engineering' },
            { _id: '3', name: 'Sales', description: 'Sales' },
            { _id: '4', name: 'Marketing', description: 'Marketing' },
            { _id: '5', name: 'Finance', description: 'Finance' },
          ]);
        }
        if (Array.isArray(userData)) {
          setEmployees(userData);
          console.log('✅ Employees loaded:', userData.length);
        }
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        // Fallback on error
        setDepartments([
          { _id: '1', name: 'HR', description: 'Human Resources' },
          { _id: '2', name: 'Engineering', description: 'Engineering' },
          { _id: '3', name: 'Sales', description: 'Sales' },
          { _id: '4', name: 'Marketing', description: 'Marketing' },
          { _id: '5', name: 'Finance', description: 'Finance' },
        ]);
      } finally {
        setLoading(false);
        console.log('📦 Current departments state:', departments);
      }
    };

    fetchData();
  }, []);

  const handleDepartment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userSelected || !selectedDepartmentId) return;

    try {
      const res = await fetch(`/api/users/${userSelected._id}`, {
        method: 'PUT',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ departmentId: selectedDepartmentId })
      });

      if (res.ok) {
        const updatedUser = await res.json() as IUser;
        setEmployees((prevEmployees) => 
          prevEmployees.map((emp) =>
            emp._id === userSelected._id ? { ...emp, departmentId: selectedDepartmentId } : emp
          )

        );
        setUserSelected(updatedUser);
        setSelectedDepartmentId("");

        alert("Department updated successfully!");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update department.");
      }
    } catch (err) {
      console.error('Error updating department:', err);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!globalFilter || globalFilter.trim() === "") {
      return employees || [];
    }
    const searchTerm = globalFilter.trim().toLowerCase();
    return (employees || []).filter((emp: IUser) => {
      const username = String(emp?.username || "").toLowerCase();
      const email = String(emp?.email || "").toLowerCase();
      return username.includes(searchTerm) || email.includes(searchTerm);
    });
  }, [globalFilter, employees]);

  const handleEditClick = (emp: IUser) => {
    setUserSelected(emp);
    setSelectedDepartmentId(emp.departmentId || '');
  };

  return (
    <div className="max-w-7xl mx-auto p-5 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl border border-slate-100 p-6">
        <h1 className="text-xl font-bold mb-6">Assign Department to Employees</h1>

        <form onSubmit={handleDepartment} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label htmlFor="" className="block text-sm uppercase tracking-wider text-slate-900">Target Employee</label>
            <div className="w-full text-sm bg-slate-200 font-medium text-black rounded-lg p-2.5">
              {userSelected ? `${userSelected.username} (${userSelected.email})` : "No employee selected"}
            </div>
          </div>

          <div>
            <label htmlFor="department" className="block text-sm uppercase tracking-wider text-slate-900">Department</label>
            <select 
              name="department" 
              id="department"
              disabled={false}
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-black"
            >
              <option value="" className="text-black font-bold">Choose Department</option>
              {departments.map((dept) => (
                <option value={dept._id} key={dept._id} className="text-black font-bold">{dept.name}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={!userSelected || !selectedDepartmentId}
            className="bg-black hover:bg-blue-600 text-white disabled:bg-slate-100 font-semibold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            Commit Assignment Changes
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 p-5 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Department Management Directory</h2>
              <p className="text-xs text-slate-400 font-medium">Active roster of employees</p>
            </div>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-black" />
            <input 
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search employees"
              className="w-full rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm border border-black pl-9 pr-4 py-2.5"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-amber-50 mt-4">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="font-bold text-slate-950 uppercase tracking-wider">
              <tr>
                <th className="p-4">Employee</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Department</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            
            
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-medium">Loading...</td>
                </tr>
              ) : (filteredEmployees?.length ?? 0) === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center font-medium bg-slate-50/50">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="p-4">{emp.username}</td>
                    <td className="p-4">{emp.email}</td>
                    <td className="p-4 text-mist-950" >
                      {(() => {
                        const activeDept = departments.find(d => d._id === emp.departmentId);
                        return activeDept ? activeDept.name : "—";
                      })()}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleEditClick(emp)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
