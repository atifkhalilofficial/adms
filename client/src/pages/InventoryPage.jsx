import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchTransactions, createTransaction } from '../features/inventory/inventorySlice';

function InventoryPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.inventory);

  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    product: '',
    warehouse: '',
    type: 'in',
    quantity: '',
    reason: 'purchase',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchTransactions());

    axios
      .get('http://localhost:5000/api/products', { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products', err));

    axios
      .get('http://localhost:5000/api/warehouses', { withCredentials: true })
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error('Failed to load warehouses', err));
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      product: '',
      warehouse: '',
      type: 'in',
      quantity: '',
      reason: 'purchase',
      notes: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTransaction(form)).then((result) => {
      if (!result.error) {
        setShowForm(false);
        resetForm();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Log Transaction'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <select
            name="product"
            value={form.product}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} (stock: {p.currentStock})
              </option>
            ))}
          </select>

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

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="in">Stock In</option>
            <option value="out">Stock Out</option>
          </select>

          <select
            name="reason"
            value={form.reason}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
            <option value="damage">Damage</option>
            <option value="correction">Correction</option>
            <option value="transfer">Transfer</option>
          </select>

          <input
            name="quantity"
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
            min="1"
          />

          <input
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Transaction
          </button>
        </form>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Product</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Type</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Reason</th>
              <th className="p-3">By</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tx) => (
              <tr key={tx._id} className="border-b">
                <td className="p-3">{new Date(tx.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{tx.product?.name || '—'}</td>
                <td className="p-3">{tx.warehouse?.name || '—'}</td>
                <td className="p-3">
                  <span
                    className={
                      tx.type === 'in'
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    }
                  >
                    {tx.type === 'in' ? 'IN' : 'OUT'}
                  </span>
                </td>
                <td className="p-3">{tx.quantity}</td>
                <td className="p-3">{tx.reason}</td>
                <td className="p-3">{tx.createdBy?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InventoryPage;