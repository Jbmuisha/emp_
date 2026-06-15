'use client'
import { IProduct } from "@/app/types/product";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminProducts() {
  const router = useRouter();
  const [product,setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (res.ok && data.products) {
          // Handle case where data is wrapped in { products: [...] }
          setProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, []);



  return (
    //list just products for admin views

    <div className=" max-w-4xl mx-auto p-5">

      <h1 className="text-2xl font-bold mb-5">Products</h1>

      <div className="mt-6 bg-white rounded-xl boder">
        <div className="relative mb-4">


        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200"
        />
        </div>

        <div >
          {loading ? (
            <p>Loading products...</p>
          ) : (
            <div className="space-y-4">
              {product
                .filter((p) =>
                  p.productName.toLowerCase().includes(globalFilter.toLowerCase())
                )
                .map((p) => (
                  <div
                    key={p._id}
                    className="border p-3 rounded flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{p.productName}</p>
                      <p className="text-sm text-gray-500">{p.category}</p>
                      <p className="text-sm text-gray-500">${p.price}</p>
                      <p className="text-sm text-gray-500">Stock: {p.stockQuantity}</p>
                    </div>

                  </div>
                ))}
            </div>
          )}



          </div>

      </div>
    </div>
  );
}
