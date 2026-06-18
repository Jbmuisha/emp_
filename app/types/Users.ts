export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "employee";
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}
