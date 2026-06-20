export type SchedulerDay = "Lun" | "Mar" | "Mer" | "Jeu" | "Ven" | "Sam" | "Dim";

export interface IScheduler {
  id: string;
  departmentId?: string; // departmentId
  employeeId?: string; // userId/employeeId
  days: SchedulerDay; // single selected day
  time: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
}

