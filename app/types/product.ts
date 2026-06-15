export interface IProduct {
  _id: string;
  productName: string;
  description: string;
  price: number;
  category: "Electronic" | "clothes" | "Books" | "Home" | "Other";
  stockQuantity: number;
  createdAt?: string;
  updatedAt?: string;
}
