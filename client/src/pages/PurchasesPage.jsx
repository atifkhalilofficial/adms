import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchPurchases, createPurchase } from '../features/purchases/purchaseSlice';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

function PurchasesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.purchases);

  const [suppliers, setSuppliers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [supplier, setSupplier] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1, unitCost: '' }]);

  useEffect(() => {
    dispatch(fetchPurchases());

    axios
      .get('http://localhost:5000/api/suppliers', { withCredentials: true })
      .then((res) => setSuppliers(res.data))
      .catch((err) => console.error('Failed to load suppliers', err));

    axios
      .get('http://localhost:5000/api/warehouses', { withCredentials: true })
      .then((res) => setWarehouses(res.data))
      .catch((err) => console.error('Failed to load warehouses', err));

    axios
      .get('http://localhost:5000/api/products', { withCredentials: true })
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to load products', err));
  }, [dispatch]);

  const resetForm = () => {
    setSupplier('');
    setWarehouse('');
    setItems([{ product: '', quantity: 1, unitCost: '' }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { product: '', quantity: 1, unitCost: '' }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateEstimatedTotal = () => {
    return items.reduce((sum, item) => {
      return sum + Number(item.unitCost || 0) * Number(item.quantity || 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const purchaseData = {
      supplier,
      warehouse,
      items: items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
        unitCost: Number(item.unitCost),
      })),
    };
    dispatch(createPurchase(purchaseData)).then((result) => {
      if (!result.error) {
        toast.success('Purchase recorded');
        setShowForm(false);
        resetForm();
      } else {
        toast.error(result.payload || 'Failed to record purchase');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchases</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Purchase'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select Supplier</option>
              {suppliers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} {s.companyName ? `(${s.companyName})` : ''}
                </option>
              ))}
            </select>

            <select
              value={warehouse}
              onChange={(e) => setWarehouse(e.target.value)}
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
          </div>

          <h3 className="font-semibold mb-2">Items</h3>
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 mb-3 items-center">
              <select
                value={item.product}
                onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                className="border rounded px-3 py-2 flex-1"
                required
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} (stock: {p.currentStock})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="border rounded px-3 py-2 w-24"
                required
              />

              <input
                type="number"
                min="0"
                placeholder="Unit Cost"
                value={item.unitCost}
                onChange={(e) => handleItemChange(index, 'unitCost', e.target.value)}
                className="border rounded px-3 py-2 w-32"
                required
              />

              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItemRow(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addItemRow}
            className="text-blue-600 hover:underline text-sm mb-4"
          >
            + Add another item
          </button>

          <div className="flex justify-between items-center border-t pt-4">
            <p className="font-semibold">
              Estimated Total: Rs. {calculateEstimatedTotal().toLocaleString()}
            </p>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Save Purchase
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="🛒"
          title="No purchases yet"
          description="Record your first purchase to restock inventory."
          actionLabel="New Purchase"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Supplier</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {list.map((purchase) => (
              <tr key={purchase._id} className="border-b align-top">
                <td className="p-3">{new Date(purchase.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{purchase.supplier?.name || '—'}</td>
                <td className="p-3">{purchase.warehouse?.name || '—'}</td>
                <td className="p-3">
                  {purchase.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      {item.product?.name || 'Unknown'} × {item.quantity} @ Rs. {item.unitCost}
                    </div>
                  ))}
                </td>
                <td className="p-3">Rs. {purchase.totalCost.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PurchasesPage;