"use client";

import { ChevronLeft, ChevronRight, Clock, Pencil, Plus, Trash2, Users, X } from "lucide-react";
import { useMemo, useState } from "react";

type Department = {
  id: string;
  name: string;
  color: string; // hex
};

type Employee = {
  id: string;
  name: string;
  departmentId: string;
};

type Shift = {
  id: string;
  employeeId: string;
  day: number; // 0=Mon ... 6=Sun
  start: string;
  end: string;
  task: string;
};

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const DAY_FULL = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const DEPT_PALETTE = [
  "#2563EB", // blue
  "#D97706", // amber
  "#059669", // emerald
  "#DB2777", // pink
  "#7C3AED", // violet
  "#0891B2", // cyan
  "#DC2626", // red
  "#65A30D", // lime
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function hoursBetween(start: string, end: string) {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  let mins = eh * 60 + em - (sh * 60 + sm);
  if (mins < 0) mins += 24 * 60;
  return Math.round((mins / 60) * 10) / 10;
}

export default function AdminWork() {
  const [departments, setDepartments] = useState<Department[]>([
    { id: "d1", name: "Cuisine", color: DEPT_PALETTE[0] },
    { id: "d2", name: "Service", color: DEPT_PALETTE[1] },
    { id: "d3", name: "Caisse", color: DEPT_PALETTE[2] },
  ]);

  const [employees, setEmployees] = useState<Employee[]>([
    { id: "e1", name: "Jean Muisha", departmentId: "d1" },
    { id: "e2", name: "Aminata Diallo", departmentId: "d2" },
  ]);

  const [shifts, setShifts] = useState<Shift[]>([]);

  const [view, setView] = useState<"schedule" | "employees">("schedule");
  const [weekOffset, setWeekOffset] = useState(0);

  // ---- modals ----
  const [shiftModal, setShiftModal] = useState<{
    open: boolean;
    editingId?: string;
  } | null>(null);

  const [employeeModal, setEmployeeModal] = useState<{
    open: boolean;
    editingId?: string;
  } | null>(null);

  const [deptModal, setDeptModal] = useState<{
    open: boolean;
    editingId?: string;
  } | null>(null);

  const [deptFilter, setDeptFilter] = useState<string | "all">("all");

  // ---- week range label ----
  const weekLabel = useMemo(() => {
    const base = new Date(2026, 5, 15); // a Monday reference in June 2026
    base.setDate(base.getDate() + weekOffset * 7);
    const end = new Date(base);
    end.setDate(end.getDate() + 6);
    const fmt = (d: Date) =>
      d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    return `${fmt(base)} – ${fmt(end)}`;
  }, [weekOffset]);

  const employeesByDept = useMemo(() => {
    const map = new Map<string, Employee[]>();
    departments.forEach((d) => map.set(d.id, []));
    employees.forEach((e) => {
      if (!map.has(e.departmentId)) map.set(e.departmentId, []);
      map.get(e.departmentId)!.push(e);
    });
    return map;
  }, [departments, employees]);

  const visibleEmployees = useMemo(() => {
    if (deptFilter === "all") return employees;
    return employees.filter((e) => e.departmentId === deptFilter);
  }, [employees, deptFilter]);

  const getDept = (id: string) => departments.find((d) => d.id === id);
  const getEmployee = (id: string) => employees.find((e) => e.id === id);

  const shiftsFor = (employeeId: string, day: number) =>
    shifts.filter((s) => s.employeeId === employeeId && s.day === day);

  const weeklyHours = (employeeId: string) =>
    shifts
      .filter((s) => s.employeeId === employeeId)
      .reduce((sum, s) => sum + hoursBetween(s.start, s.end), 0);

  // ---- shift form state ----
  const [shiftDeptInput, setShiftDeptInput] = useState("");
  const [shiftEmpInput, setShiftEmpInput] = useState("");
  const [shiftDayInput, setShiftDayInput] = useState<number | "">("");
  const [taskInput, setTaskInput] = useState("");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");

  const shiftFormEmployees = useMemo(() => {
    if (!shiftDeptInput) return [];
    return employees.filter((e) => e.departmentId === shiftDeptInput);
  }, [employees, shiftDeptInput]);

  // Open the form blank, or pre-filled from a grid cell (department/employee/day known)
  const openNewShift = (employeeId?: string, day?: number) => {
    const emp = employeeId ? getEmployee(employeeId) : undefined;
    setShiftDeptInput(emp?.departmentId ?? "");
    setShiftEmpInput(employeeId ?? "");
    setShiftDayInput(typeof day === "number" ? day : "");
    setTaskInput("");
    setStartInput("");
    setEndInput("");
    setShiftModal({ open: true });
  };

  const openEditShift = (shift: Shift) => {
    const emp = getEmployee(shift.employeeId);
    setShiftDeptInput(emp?.departmentId ?? "");
    setShiftEmpInput(shift.employeeId);
    setShiftDayInput(shift.day);
    setTaskInput(shift.task);
    setStartInput(shift.start);
    setEndInput(shift.end);
    setShiftModal({ open: true, editingId: shift.id });
  };

  const saveShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftModal) return;
    if (!shiftDeptInput || !shiftEmpInput || shiftDayInput === "" || !startInput || !endInput) return;

    if (shiftModal.editingId) {
      setShifts((prev) =>
        prev.map((s) =>
          s.id === shiftModal.editingId
            ? {
                ...s,
                employeeId: shiftEmpInput,
                day: shiftDayInput as number,
                start: startInput,
                end: endInput,
                task: taskInput,
              }
            : s
        )
      );
    } else {
      setShifts((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          employeeId: shiftEmpInput,
          day: shiftDayInput as number,
          start: startInput,
          end: endInput,
          task: taskInput,
        },
      ]);
    }
    setShiftModal(null);
  };

  const deleteShift = (id: string) => {
    setShifts((prev) => prev.filter((s) => s.id !== id));
    setShiftModal(null);
  };

  // ---- employee form state ----
  const [empNameInput, setEmpNameInput] = useState("");
  const [empDeptInput, setEmpDeptInput] = useState("");

  const openNewEmployee = () => {
    setEmpNameInput("");
    setEmpDeptInput(departments[0]?.id ?? "");
    setEmployeeModal({ open: true });
  };

  const openEditEmployee = (emp: Employee) => {
    setEmpNameInput(emp.name);
    setEmpDeptInput(emp.departmentId);
    setEmployeeModal({ open: true, editingId: emp.id });
  };

  const saveEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empNameInput.trim() || !empDeptInput) return;

    if (employeeModal?.editingId) {
      setEmployees((prev) =>
        prev.map((em) =>
          em.id === employeeModal.editingId
            ? { ...em, name: empNameInput.trim(), departmentId: empDeptInput }
            : em
        )
      );
    } else {
      setEmployees((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name: empNameInput.trim(), departmentId: empDeptInput },
      ]);
    }
    setEmployeeModal(null);
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setShifts((prev) => prev.filter((s) => s.employeeId !== id));
    setEmployeeModal(null);
  };

  // ---- department form state ----
  const [deptNameInput, setDeptNameInput] = useState("");
  const [deptColorInput, setDeptColorInput] = useState(DEPT_PALETTE[0]);

  const openNewDept = () => {
    setDeptNameInput("");
    setDeptColorInput(DEPT_PALETTE[departments.length % DEPT_PALETTE.length]);
    setDeptModal({ open: true });
  };

  const openEditDept = (dept: Department) => {
    setDeptNameInput(dept.name);
    setDeptColorInput(dept.color);
    setDeptModal({ open: true, editingId: dept.id });
  };

  const saveDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptNameInput.trim()) return;

    if (deptModal?.editingId) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === deptModal.editingId
            ? { ...d, name: deptNameInput.trim(), color: deptColorInput }
            : d
        )
      );
    } else {
      setDepartments((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name: deptNameInput.trim(), color: deptColorInput },
      ]);
    }
    setDeptModal(null);
  };

  const deleteDept = (id: string) => {
    if (employeesByDept.get(id)?.length) return; // guard: don't delete dept in use
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    setDeptModal(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* HEADER */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Gestion des horaires
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Plannifiez les quarts de travail par employé et par département.
            </p>
          </div>

          {/* View switch */}
         
        </div>

        {view === "schedule" ? (
          <ScheduleView
            departments={departments}
            employees={visibleEmployees}
            deptFilter={deptFilter}
            setDeptFilter={setDeptFilter}
            getDept={getDept}
            shiftsFor={shiftsFor}
            weeklyHours={weeklyHours}
            weekLabel={weekLabel}
            setWeekOffset={setWeekOffset}
            openNewShift={openNewShift}
            openEditShift={openEditShift}
          />
        ) : (
          <EmployeesView
            departments={departments}
            employeesByDept={employeesByDept}
            weeklyHours={weeklyHours}
            openNewEmployee={openNewEmployee}
            openEditEmployee={openEditEmployee}
            openNewDept={openNewDept}
            openEditDept={openEditDept}
          />
        )}
      </div>

      {/* SHIFT MODAL — Department -> Employee -> Day -> time/task, then submit */}
      {shiftModal?.open && (
        <Modal onClose={() => setShiftModal(null)}>
          <ModalHeader
            title={shiftModal.editingId ? "Modifier le quart" : "Nouveau quart"}
            subtitle="Choisissez le département, l'employé et le jour"
            accent={shiftDeptInput ? getDept(shiftDeptInput)?.color : undefined}
            onClose={() => setShiftModal(null)}
          />
          <form onSubmit={saveShift} className="p-5 space-y-4">
            <Field label="Département" htmlFor="shift-dept">
              <select
                id="shift-dept"
                value={shiftDeptInput}
                onChange={(e) => {
                  setShiftDeptInput(e.target.value);
                  // Reset employee if it no longer belongs to the chosen department
                  const stillValid = employees.some(
                    (em) => em.id === shiftEmpInput && em.departmentId === e.target.value
                  );
                  if (!stillValid) setShiftEmpInput("");
                }}
                required
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir un département</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Employé" htmlFor="shift-emp">
              <select
                id="shift-emp"
                value={shiftEmpInput}
                onChange={(e) => setShiftEmpInput(e.target.value)}
                required
                disabled={!shiftDeptInput}
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="">
                  {shiftDeptInput ? "Choisir un employé" : "Choisissez d'abord un département"}
                </option>
                {shiftFormEmployees.map((em) => (
                  <option key={em.id} value={em.id}>
                    {em.name}
                  </option>
                ))}
              </select>
              {shiftDeptInput && shiftFormEmployees.length === 0 && (
                <p className="text-xs text-amber-600 mt-1.5">
                  Aucun employé dans ce département pour instant.
                </p>
              )}
            </Field>

            <Field label="Jour" htmlFor="shift-day">
              <select
                id="shift-day"
                value={shiftDayInput}
                onChange={(e) =>
                  setShiftDayInput(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir un jour</option>
                {DAY_FULL.map((d, i) => (
                  <option key={d} value={i}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Début" htmlFor="start-time">
                <input
                  id="start-time"
                  type="time"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>
              <Field label="Fin" htmlFor="end-time">
                <input
                  id="end-time"
                  type="time"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  required
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm tabular-nums focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </Field>
            </div>

            {startInput && endInput && (
              <p className="text-xs text-slate-500 -mt-2 flex items-center gap-1">
                <Clock size={12} />
                Durée : {hoursBetween(startInput, endInput)} h
              </p>
            )}

            <Field label="Tâche / Description" htmlFor="task">
              <textarea
                id="task"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Ex. Préparation des commandes, accueil clients…"
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Field>

            <div className="flex items-center justify-between pt-2">
              {shiftModal.editingId ? (
                <button
                  type="button"
                  onClick={() => deleteShift(shiftModal.editingId!)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 px-2 py-2"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShiftModal(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* EMPLOYEE MODAL */}
      {employeeModal?.open && (
        <Modal onClose={() => setEmployeeModal(null)}>
          <ModalHeader
            title={employeeModal.editingId ? "Modifier l'employé" : "Nouvel employé"}
            onClose={() => setEmployeeModal(null)}
          />
          <form onSubmit={saveEmployee} className="p-5 space-y-4">
            <Field label="Nom complet" htmlFor="emp-name">
              <input
                id="emp-name"
                type="text"
                value={empNameInput}
                onChange={(e) => setEmpNameInput(e.target.value)}
                placeholder="Ex. Marie Tshibangu"
                required
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Field>

            <Field label="Département" htmlFor="emp-dept">
              <select
                id="emp-dept"
                value={empDeptInput}
                onChange={(e) => setEmpDeptInput(e.target.value)}
                required
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {departments.length === 0 && <option value="">Aucun département</option>}
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>

            <div className="flex items-center justify-between pt-2">
              {employeeModal.editingId ? (
                <button
                  type="button"
                  onClick={() => deleteEmployee(employeeModal.editingId!)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 px-2 py-2"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEmployeeModal(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={departments.length === 0}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* DEPARTMENT MODAL */}
      {deptModal?.open && (
        <Modal onClose={() => setDeptModal(null)}>
          <ModalHeader
            title={deptModal.editingId ? "Modifier le département" : "Nouveau département"}
            onClose={() => setDeptModal(null)}
          />
          <form onSubmit={saveDept} className="p-5 space-y-4">
            <Field label="Nom du département" htmlFor="dept-name">
              <input
                id="dept-name"
                type="text"
                value={deptNameInput}
                onChange={(e) => setDeptNameInput(e.target.value)}
                placeholder="Ex. Entretien"
                required
                className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </Field>

            <Field label="Couleur" htmlFor="dept-color">
              <div className="flex flex-wrap gap-2">
                {DEPT_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setDeptColorInput(c)}
                    aria-label={`Choisir la couleur ${c}`}
                    className="w-8 h-8 rounded-full flex items-center justify-center ring-offset-2 transition"
                    style={{
                      backgroundColor: c,
                      boxShadow: deptColorInput === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                    }}
                  >
                    {deptColorInput === c && <span className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                ))}
              </div>
            </Field>

            <div className="flex items-center justify-between pt-2">
              {deptModal.editingId ? (
                <button
                  type="button"
                  onClick={() => deleteDept(deptModal.editingId!)}
                  disabled={!!employeesByDept.get(deptModal.editingId!)?.length}
                  title={
                    employeesByDept.get(deptModal.editingId!)?.length
                      ? "Réassignez les employés avant de supprimer"
                      : undefined
                  }
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 px-2 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDeptModal(null)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------------------------------- Schedule (weekly grid) ---------------------------------- */

function ScheduleView({
  departments,
  employees,
  deptFilter,
  setDeptFilter,
  getDept,
  shiftsFor,
  weeklyHours,
  weekLabel,
  setWeekOffset,
  openNewShift,
  openEditShift,
}: {
  departments: Department[];
  employees: Employee[];
  deptFilter: string | "all";
  setDeptFilter: (v: string | "all") => void;
  getDept: (id: string) => Department | undefined;
  shiftsFor: (employeeId: string, day: number) => Shift[];
  weeklyHours: (employeeId: string) => number;
  weekLabel: string;
  setWeekOffset: React.Dispatch<React.SetStateAction<number>>;
  openNewShift: (employeeId?: string, day?: number) => void;
  openEditShift: (shift: Shift) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset((w) => w - 1)}
            aria-label="Semaine précédente"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-800 min-w-[120px] text-center tabular-nums">
            {weekLabel}
          </span>
          <button
            onClick={() => setWeekOffset((w) => w + 1)}
            aria-label="Semaine suivante"
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Department filter pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setDeptFilter("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                deptFilter === "all"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
              }`}
            >
              Tous
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setDeptFilter(d.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition ${
                  deptFilter === d.id
                    ? "text-white border-transparent"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
                style={deptFilter === d.id ? { backgroundColor: d.color } : undefined}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: deptFilter === d.id ? "white" : d.color }}
                />
                {d.name}
              </button>
            ))}
          </div>

          {/* Explicit add-shift entry point: opens the Department -> Employee -> Day form */}
          <button
            onClick={() => openNewShift()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
          >
            <Plus size={14} />
            Ajouter un quart
          </button>
        </div>
      </div>

      {/* Grid */}
      {employees.length === 0 ? (
        <EmptyState
          title="Aucun employé à afficher"
          description="Ajoutez un employé dans l'onglet Employés pour commencer à planifier son horaire."
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[820px]">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 border-b border-slate-200 w-[200px]">
                  Employé
                </th>
                {DAY_LABELS.map((d) => (
                  <th
                    key={d}
                    className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-2 py-3 border-b border-l border-slate-200 min-w-[110px]"
                  >
                    {d}
                  </th>
                ))}
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wide px-3 py-3 border-b border-l border-slate-200 w-[80px]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => {
                const dept = getDept(emp.departmentId);
                return (
                  <tr key={emp.id} className="group">
                    <td className="sticky left-0 z-10 bg-white group-hover:bg-slate-50 px-4 py-3 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                          style={{ backgroundColor: dept?.color ?? "#94A3B8" }}
                        >
                          {initials(emp.name)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {emp.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {dept?.name ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    {DAY_LABELS.map((_, dayIdx) => {
                      const dayShifts = shiftsFor(emp.id, dayIdx);
                      return (
                        <td
                          key={dayIdx}
                          className="align-top border-b border-l border-slate-100 p-1.5"
                        >
                          <div className="flex flex-col gap-1">
                            {dayShifts.map((s) => (
                              <button
                                key={s.id}
                                onClick={() => openEditShift(s)}
                                className="text-left rounded-lg px-2 py-1.5 text-white text-[11px] leading-tight hover:brightness-95 transition"
                                style={{ backgroundColor: dept?.color ?? "#64748B" }}
                              >
                                <p className="font-bold tabular-nums">
                                  {s.start}–{s.end}
                                </p>
                                {s.task && (
                                  <p className="text-white/85 truncate mt-0.5">{s.task}</p>
                                )}
                              </button>
                            ))}
                            <button
                              onClick={() => openNewShift(emp.id, dayIdx)}
                              className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 text-slate-300 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 py-1.5 transition"
                              aria-label={`Ajouter un quart pour ${emp.name} le ${DAY_FULL[dayIdx]}`}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </td>
                      );
                    })}
                    <td className="text-center border-b border-l border-slate-100 px-2 py-3">
                      <span className="text-sm font-bold text-slate-700 tabular-nums">
                        {weeklyHours(emp.id)}h
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Employees (by department) ---------------------------------- */

function EmployeesView({
  departments,
  employeesByDept,
  weeklyHours,
  openNewEmployee,
  openEditEmployee,
  openNewDept,
  openEditDept,
}: {
  departments: Department[];
  employeesByDept: Map<string, Employee[]>;
  weeklyHours: (employeeId: string) => number;
  openNewEmployee: () => void;
  openEditEmployee: (emp: Employee) => void;
  openNewDept: () => void;
  openEditDept: (dept: Department) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {departments.length} département{departments.length !== 1 ? "s" : ""} ·{" "}
          {[...employeesByDept.values()].reduce((n, list) => n + list.length, 0)} employé(s)
        </p>
        <div className="flex gap-2">
          <button
            onClick={openNewDept}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            <Plus size={15} />
            Département
          </button>
          <button
            onClick={openNewEmployee}
            disabled={departments.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={15} />
            Employé
          </button>
        </div>
      </div>

      {departments.length === 0 ? (
        <EmptyState
          title="Aucun département"
          description="Créez un département (ex. Cuisine, Service) avant d'ajouter des employés."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((dept) => {
            const list = employeesByDept.get(dept.id) ?? [];
            return (
              <div
                key={dept.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => openEditDept(dept)}
                  className="w-full flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition text-left"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: dept.color }}
                    />
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <span className="text-xs text-slate-400 font-medium">
                      {list.length} employé{list.length !== 1 ? "s" : ""}
                    </span>
                  </span>
                  <Pencil size={13} className="text-slate-300" />
                </button>

                {list.length === 0 ? (
                  <p className="px-4 py-5 text-sm text-slate-400">
                    Aucun employé dans ce département.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {list.map((emp) => (
                      <li key={emp.id}>
                        <button
                          onClick={() => openEditEmployee(emp)}
                          className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition text-left"
                        >
                          <span className="flex items-center gap-2.5 min-w-0">
                            <span
                              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: dept.color }}
                            >
                              {initials(emp.name)}
                            </span>
                            <span className="text-sm font-medium text-slate-700 truncate">
                              {emp.name}
                            </span>
                          </span>
                          <span className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-semibold text-slate-400 tabular-nums">
                              {weeklyHours(emp.id)}h / sem.
                            </span>
                            <Pencil size={12} className="text-slate-300" />
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- Shared UI primitives ---------------------------------- */

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function ModalHeader({
  title,
  subtitle,
  accent,
  onClose,
}: {
  title: string;
  subtitle?: string;
  accent?: string;
  onClose: () => void;
}) {
  return (
    <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
      <div className="flex items-center gap-2.5">
        {accent && (
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: accent }} />
        )}
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <button
        onClick={onClose}
        aria-label="Fermer"
        className="text-slate-400 hover:text-slate-600 p-1 -m-1"
      >
        <X size={18} />
      </button>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <Users size={20} className="text-slate-400" />
      </div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="text-xs text-slate-400 mt-1 max-w-xs">{description}</p>
    </div>
  );
}