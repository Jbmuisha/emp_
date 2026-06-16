export interface IDepartment {
  _id: string;
  name: string ,enum: "HR" | "Engineering" | "Sales" | "Marketing" | "Finance" | "Other";
  description: string;
  createdAt?: string;
  updatedAt?: string;
}