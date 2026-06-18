# Fix Plan for TypeScript and ESLint Issues

## TODO List

### Step 1: Fix component naming conventions (React hooks/rules-of-hooks)
- [x] Fix /app/admin/dashbord/page.tsx - rename adminDashboard to AdminDashboard
- [x] Fix /app/employee/dashbord/page.tsx - rename employeeDasbord to EmployeeDashboard

### Step 2: Fix empty interfaces in type definitions
- [x] Fix /app/types/index.ts - replace empty interfaces with proper types

### Step 3: Fix unused variables
- [x] Fix /app/admin/usermanage/page.tsx - handle unused 'props' in cell renderer
- [x] Fix /app/page.tsx - handle 'err' variable in catch block

### Step 4: Configure ESLint for backend files
- [x] Update eslint config to ignore backend JS files

### Step 5: Run build to verify fixes
- [x] Run npm run build to verify all TypeScript errors are resolved

## Summary of Fixed TypeScript Errors:
- Operator '>' cannot be applied to types - Fixed with proper column typing
- Type 'boolean' has no properties in common with type - Fixed with proper interface
- Type annotations can only be used in TypeScript files - Fixed proper typing
- Empty interface declarations - Fixed with proper types

'use client'

import { IDepartment } from "@/app/types/department";
import { IUser } from "@/app/types/Users";
import { Search, UserPlus, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDepartment() {
  const router = useRouter();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [employees, setEmployees] = useState<IUser[]>([]); // Added state for your employee list
  
  const [globalFilter, setGlobalFilter] = useState('');
  const [userselected, setUserSelected] = useState<IUser | null>(null);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // --- 1. Mock Data Initialization (Replace with your actual fetch logic) ---
  useEffect(() => {
    // Simulating database fetches
    const sampleDepartments: IDepartment[] = [
      { id: "dept-1", name: "Engineering" },
      { id: "dept-2", name: "Marketing" },
      { id: "dept-3", name: "Human Resources" }
    ];

    const sampleEmployees: IUser[] = [
      { id: "u-101", name: "Alice Smith", email: "alice@company.com", departmentId: "dept-1" },
      { id: "u-102", name: "Bob Johnson", email: "bob@company.com", departmentId: "" },
      { id: "u-103", name: "Charlie Davis", email: "charlie@company.com", departmentId: "dept-2" }
    ];

    setDepartments(sampleDepartments);
    setEmployees(sampleEmployees);
    setLoading(false);
  }, []);

  // --- 2. Form Submission Handler ---
  const handleAssignDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userselected || !selectedDepartmentId) return;

    // Local state update mutation logic
    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.id === userselected.id 
          ? { ...emp, departmentId: selectedDepartmentId } 
          : emp
      )
    );

    // Reset selection contexts safely
    setUserSelected(null);
    setSelectedDepartmentId('');
    
    // Optional router verification refresh
    router.refresh();
  };

  // --- 3. Dynamic Search Filter Logic ---
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
    emp.email.toLowerCase().includes(globalFilter.toLowerCase())
  );

  if (loading) {
    return <div className="p-8 text-center font-medium text-slate-500">Loading workspace files...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-5 space-y-6">
      
      {/* SECTION A: ASSIGNMENT FORM PIPELINE */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
        <h1 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-800"> 
          Assign Department to Employers
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Select an employee from the table directory below to modify their structural division.
        </p>

        <form onSubmit={handleAssignDepartment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Target Employee Visual Anchor */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Employee</label>
            <div className="w-full text-sm border border-slate-200 bg-slate-50 p-2.5 rounded-lg font-medium text-slate-700">
              {userselected ? `${userselected.name} (${userselected.email})` : "❌ No worker selected"}
            </div>
          </div>

          {/* Department Selection Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Department</label>
            <select 
              disabled={!userselected}
              value={selectedDepartmentId}
              onChange={(e) => setSelectedDepartmentId(e.target.value)}
              className="w-full text-sm border border-slate-200 p-2.5 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="">Choose department alignment...</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Action Trigger Button */}
          <button 
            type="submit"
            disabled={!userselected || !selectedDepartmentId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 text-white disabled:text-slate-400 font-semibold text-sm py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            Commit Assignment Changes
          </button>
        </form>
      </div>

      {/* SECTION B: CORE DIRECTORY INFRASTRUCTURE */}
      <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Department Management Directory</h2>
            <p className="text-xs text-slate-400 font-medium">Active roster calculations matching parameters</p>
          </div>
          
          {/* Search Input Bar Element */}
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search employers to assign department..."
              className="w-full text-sm border border-slate-200 pl-9 pr-4 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Directory Data Grid Representation */}
        <div className="overflow-x-auto rounded-lg border border-slate-100">
          <table className="w-full text-left text-sm text-slate-600 border-collapse">
            <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
              <tr>
                <th className="p-4">Employee Identity</th>
                <th className="p-4">Contact Coordinates</th>
                <th className="p-4">Assigned Department</th>
                <th className="p-4 text-right">Operational Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-medium bg-slate-50/50">
                    No workforce entries matched the filtering search query metrics.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const activeDept = departments.find(d => d.id === emp.departmentId);
                  const isCurrentlySelected = userselected?.id === emp.id;

                  return (
                    <tr 
                      key={emp.id} 
                      className={`hover:bg-slate-50/70 transition-colors ${isCurrentlySelected ? 'bg-blue-50/40 hover:bg-blue-50/50' : ''}`}
                    >
                      <td className="p-4 font-semibold text-slate-800">{emp.name}</td>
                      <td className="p-4 text-slate-500">{emp.email}</td>
                      <td className="p-4">
                        {activeDept ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            {activeDept.name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-semibold">
                            <ShieldAlert className="w-3 h-3" />
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setUserSelected(emp);
                            setSelectedDepartmentId(emp.departmentId || '');
                          }}
                          className={`text-xs font-bold px-3 py-1.5 rounded-md border transition-all ${
                            isCurrentlySelected 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isCurrentlySelected ? "Modifying..." : "Select to Assign"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

