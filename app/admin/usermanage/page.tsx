"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Edit2, Inbox, Loader2, Search, Trash2, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { IUser } from "../../types/Users";

export default function UserManagerForm() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // Form Fields State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");

  // Fetch initial records from Database on mount
  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Submit handler pushes data to database API endpoint
  const handleCreateUser = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !email || !password) return;

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      if (!response.ok) throw new Error("Network error saved failed.");
      const savedUser = (await response.json()) as IUser;

      setUsers([savedUser, ...users]); // Prepend new user to layout
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Error saving record to database.");
    }
  };
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        // Assuming the button's value is the user ID
      });

      if (!response.ok) throw new Error("Network error delete failed.");
      setUsers(users.filter((user) => user._id !== userId)); // Remove deleted user from layout
    } catch (err) {
      alert("Error deleting record from database.");
    }
  };
  const handleUpdateUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: "USER_ID_HERE", username, email, role }), // Replace with actual user ID and updated fields
      });
      if (!response.ok) throw new Error("Network error update failed.");
      const updatedUser = (await response.json()) as IUser;
      setUsers(
        users.map((userId) =>
          userId._id === updatedUser._id ? updatedUser : userId,
        ),
      ); // Update user in layout
    } catch (err) {
      alert("Error updating record in database.");
    }
  };

  // Setup Column Def mapped to MongoDB keys
  const columnHelper = createColumnHelper<IUser>();

  const columns = [
    columnHelper.accessor("username", {
      header: "Username",
    }),
    columnHelper.accessor("email", {
      header: "Email Address",
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => {
        const val = info.getValue();
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              val === "admin"
                ? "bg-purple-50 text-purple-700 border-purple-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {val}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: (info) => (
        <div className="flex justify-end gap-2">
          <button
            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition"
            onClick={() => handleUpdateUser(info.row.original._id)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-slate-100 transition"
            onClick={() => handleDeleteUser(info.row.original._id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ] as never[];

  const table = useReactTable({
    data: users,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 sm:p-6">
      {/* Form Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" /> User Management
        </h1>
        <form
          onSubmit={handleCreateUser}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-800 text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-800 text-sm"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-800 text-sm"
              required
            />
          </div>
          <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "admin" | "employee")}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 bg-black text-sm"
            >
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search database records..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              disabled={users.length === 0}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-xs uppercase tracking-wider">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-3">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />{" "}
                      Connecting to database...
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-12 text-center text-slate-400"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Inbox className="w-8 h-8 text-slate-300" />
                      <span>No active users found.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
