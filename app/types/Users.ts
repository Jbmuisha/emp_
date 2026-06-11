export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: "admin" | "employee";
  createdAt?: string;
  updatedAt?: string;
}