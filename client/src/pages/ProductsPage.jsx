import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from '../features/products/productSlice';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

function ProductsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.products);

  const [warehouses, setWarehouses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    bagSize: '',
    price: 0,
    openingStock: 0,
    minimumStock: 10,
    warehouse: '',
  });

  useEffect(() => {
    dispatch(fetchProducts());

    axios
      .get('http://localhost:5000/api/warehouses', { withCredentials: true })
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error('Failed to load warehouses', err));
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      name: '',
      sku: '',
      category: '',
      brand: '',
      bagSize: '',
      price: 0,
      openingStock: 0,
      minimumStock: 10,
      warehouse: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateProduct({ id: editingId, data: form })).then((result) => {
        if (!result.error) {
          toast.success('Product updated');
          setShowForm(false);
          setEditingId(null);
          resetForm();
        } else {
          toast.error(result.payload || 'Failed to update product');
        }
      });
    } else {
      dispatch(createProduct(form)).then((result) => {
        if (!result.error) {
          toast.success('Product added');
          setShowForm(false);
          resetForm();
        } else {
          toast.error(result.payload || 'Failed to add product');
        }
      });
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      brand: product.brand || '',
      bagSize: product.bagSize || '',
      price: product.price,
      openingStock: product.openingStock,
      minimumStock: product.minimumStock,
      warehouse: product.warehouse?._id || '',
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      dispatch(deleteProduct(id)).then((result) => {
        if (!result.error) {
          toast.success('Product deleted');
        } else {
          toast.error(result.payload || 'Failed to delete product');
        }
      });
    }
  };

  const handleImageUpload = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadPromise = dispatch(uploadProductImage({ id, file })).unwrap();
      toast.promise(uploadPromise, {
        loading: 'Uploading image...',
        success: 'Image uploaded',
        error: 'Failed to upload image',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="sku"
            placeholder="SKU"
            value={form.sku}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="brand"
            placeholder="Brand"
            value={form.brand}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="bagSize"
            placeholder="Bag Size (e.g. 50kg)"
            value={form.bagSize}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="openingStock"
            type="number"
            placeholder="Opening Stock"
            value={form.openingStock}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="minimumStock"
            type="number"
            placeholder="Minimum Stock"
            value={form.minimumStock}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <select
            name="warehouse"
            value={form.warehouse}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Warehouse</option>
            {warehouses.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name} ({w.city})
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {editingId ? 'Update Product' : 'Save Product'}
          </button>
        </form>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={8} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No products yet"
          description="Add your first product to start tracking stock."
          actionLabel="Add Product"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Image</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="p-3">{product.name}</td>
                <td className="p-3">{product.sku}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">{product.price}</td>
                <td className="p-3">
                  {product.currentStock}
                  {product.currentStock <= product.minimumStock && (
                    <span className="ml-2 text-xs text-red-600 font-semibold">Low</span>
                  )}
                </td>
                <td className="p-3">{product.warehouse?.name || '—'}</td>
                <td className="p-3">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <label className="text-blue-600 text-sm cursor-pointer hover:underline">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(product._id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductsPage;