"use client";


import { IDepartment } from "@/app/types/department";
import { IScheduler, SchedulerDay } from "@/app/types/schedule";
import { IUser } from "@/app/types/Users";
import { Calendar, Clock, Plus, Users, X } from "lucide-react";
import { useState } from "react";

const DAYS: SchedulerDay[] = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function SchedulerUI() {
  const [departmentname, setDepartment] = useState<IDepartment[]>([]);
  const [employees, setEmployees] = useState<IUser[]>([]);

  const [selectDay, setSelectedDay] = useState<SchedulerDay | null>(null);
  const [isAjouterOpen, setIsAjouterOpen] = useState(false);

  const [startTime, setStartTime] = useState<string>("09:00"); // default morning time
  const [endTime, setEndTime] = useState<string>("17:00");

  const [schedulers, setSchedulers] = useState<IScheduler[]>([]);

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative">
      {/* TOP BAR */}
      <header className="bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Calendar size={16} className="text-primary-foreground" />
          </div>

          <div>
            <h1 className="text-sm font-semibold">StaffFlow</h1>
            <p className="text-xs text-muted-foreground">Gestion des horaires</p>
          </div>
        </div>

        {/* 1. BUTTON HIDDEN WHEN DIALOG IS OPEN */}
        {!isAjouterOpen && (
          <button
            onClick={() => setIsAjouterOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2 transition"
          >
            <Plus size={15} />
            Ajouter un quart
          </button>
        )}
      </header>

      {/* 2. DIALOG OVERLAY AND BOX */}
      {isAjouterOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-xl relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Icon Button */}
            <button
              onClick={() => setIsAjouterOpen(false)}
              className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-bold mb-2">Ajouter un nouveau quart</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Remplissez les détails pour planifier un nouvel horaire.
            </p>

            <div className="space-y-4 mb-6">
              <form action="" className="grid grid-cols-1 gap-2">
                <select
                  className="w-full border border-slate-300 text-sm rounded-lg p-2.5 flex flex-col gap-2"
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                >
                  <option value="">choose the department</option>
                  {departmentname.map((dept) => (
                    <option value={dept._id} key={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>

                <select
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-black col-span flex flex-cols-1 gap-2"
                  value={selectedEmployeeId}
                  onChange={(e) => setSelectedEmployeeId(e.target.value)}
                >
                  <option value="">choose the employees</option>
                  {employees.map((emp) => (
                    <option value={emp._id} key={emp._id}>
                      {emp.username}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-7 gap-7">
                  {/* les jours*/}
                  {DAYS.map((d) => {
                    const isSelected = selectDay === d;
                    return (
                      <button
                        type="button" // Prevents form submission
                        key={d}
                        onClick={() => setSelectedDay(d)}
                        className={`py-2 text-xs font-semibold rounded-xl border transition ${
                          isSelected
                            ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock size={12} /> Heure de début
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock size={12} /> Heure de fin
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm rounded-xl p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsAjouterOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (!selectedDepartmentId || !selectedEmployeeId || !selectDay) return;

                  const newSchedule: IScheduler = {
                    id: crypto.randomUUID(),
                    departmentId: selectedDepartmentId,
                    employeeId: selectedEmployeeId,
                    days: selectDay,
                    time: {
                      start: startTime,
                      end: endTime,
                    },
                  };

                  setSchedulers((prev) => [...prev, newSchedule]);
                  setIsAjouterOpen(false);
                }}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6">
        {/* GRID CARD */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          {/* HEADER ROW */}
          <div className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700 bg-slate-100/60 dark:bg-slate-700/40">
            <div className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <Users size={14} />
              <span className="text-xs font-semibold uppercase tracking-wider">Employés</span>
            </div>

            {DAYS.map((d) => (
              <div
                key={d}
                className="px-3 py-3 text-center border-r border-slate-200 dark:border-slate-700 last:border-r-0"
              >
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{d}</p>
              </div>
            ))}
          </div>

          {/* EMPLOYEE ROWS */}
          {(employees.length ? employees : [{ _id: "", username: "", email: "", role: "employee" } as IUser]).map((emp) => (
            <div
              key={emp._id || "placeholder"}
              className="grid grid-cols-8 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-100/70 dark:hover:bg-slate-700/40 transition"
            >
              <div className="px-4 py-3 border-r border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                <p className="text-sm font-semibold">{emp.username || "—"}</p>
                <p className="text-xs text-slate-600 dark:text-slate-300">{emp.role}</p>
              </div>

              {DAYS.map((d) => (
                <div
                  key={d}
                  className="border-r border-slate-200 dark:border-slate-700 last:border-r-0 min-h-[70px] p-2 flex items-center justify-center"
                >
                  <button
                    onClick={() => {
                      setSelectedDay(d);
                      setIsAjouterOpen(true);
                    }}
                    className="opacity-0 hover:opacity-100 transition text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    type="button"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

