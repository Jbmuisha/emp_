'use client';

import { IProduct } from '@/app/types/product';
import { Search } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [loading, setLoading] = useState(true);

const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronic');
  const [stockQuantity, setStockQuantity] = useState('');

  const [editProductId, setEditProductId] = useState<string | null>(null);

  // ✅ DELETE MODAL STATE
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const resetForm = () => {
    setProductName('');
    setPrice('');
    setDescription('');
    setCategory('Electronic');
    setStockQuantity('');
    setEditProductId(null);
  };

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all required fields BEFORE making API call
    if (!productName || !price || !description || !category || !stockQuantity) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const payload = {
        productName,
        price,
        description,
        category,
        stockQuantity,
      };

      if (editProductId) {
        const res = await fetch(`/api/products/[id]/${editProductId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Update failed');

        const updated = (await res.json()) as IProduct;

        setProducts((prev) =>
          prev.map((p) => (p._id === editProductId ? updated : p))
        );
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Create failed');
        }

        const created = (await res.json()) as IProduct;

        setProducts((prev) => [created, ...prev]);
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  //  DELETE FUNCTION
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Delete failed');

      setProducts((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete product');
    }
  };

const filteredProducts = products.filter((p) =>
    p.productName?.toLowerCase().includes(globalFilter.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

      {/* FORM */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-xl font-bold mb-6">Products Manager</h1>


        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
        <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Product name"
            className="border p-2 rounded"
            required
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-2 rounded"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="border p-2 rounded"
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Electronic">Electronic</option>
            <option value="clothes">Clothes</option>
            <option value="Books">Books</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            placeholder="Stock quantity"
            className="border p-2 rounded"
            required
          />

          <button
            type="submit"
            className="bg-black text-white py-2 rounded lg:col-span-3"
          >
            {editProductId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </div>

      {/* SEARCH */}
      <div className="mt-6 bg-white p-4 rounded-xl border">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-2.5 w-4 h-4" />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search products..."
            className="pl-9 border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* LIST */}
      <div className="mt-6 bg-white p-6 rounded-xl border">
        {loading ? (
          <p>Loading...</p>
        ) : filteredProducts.length === 0 ? (
          <p>No products found</p>
        ) : (
          <ul className="space-y-3">
            {filteredProducts.map((p) => (
              <li
                key={p._id}
                className="border p-3 rounded flex justify-between items-center"
              >
<div>
                  <p className="font-semibold">{p.productName}</p>
                  <p className="text-sm text-gray-500">{p.category}</p>
                </div>

                <div className="flex items-center gap-4">
                  <p>${p.price}</p>

                  <button
                    onClick={() => setDeleteId(p._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ✅ BEAUTIFUL DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          />

          {/* Modal */}
          <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-lg font-bold text-gray-900">
              Delete Product
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to delete this product? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {
        editProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditProductId(null)}
            />

            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-bold text-gray-900">
                Edit Product
              </h2>

              <p className="text-sm text-gray-600 mt-2">
                You are currently editing a product. Make your changes and click Update Product to save.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditProductId(null)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) 
      }

    </div>
  );
}