import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchOrders, createOrder, updateOrderStatus } from '../features/orders/orderSlice';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

function OrdersPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.orders);

  const [dealers, setDealers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [dealer, setDealer] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [items, setItems] = useState([{ product: '', quantity: 1 }]);

  useEffect(() => {
    dispatch(fetchOrders());

    axios
      .get('http://localhost:5000/api/dealers', { withCredentials: true })
      .then((res) => setDealers(res.data))
      .catch((err) => console.error('Failed to load dealers', err));

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
    setDealer('');
    setWarehouse('');
    setItems([{ product: '', quantity: 1 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([...items, { product: '', quantity: 1 }]);
  };

  const removeItemRow = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateEstimatedTotal = () => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p._id === item.product);
      if (!product) return sum;
      return sum + product.price * Number(item.quantity || 0);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      dealer,
      warehouse,
      items: items.map((item) => ({
        product: item.product,
        quantity: Number(item.quantity),
      })),
    };
    dispatch(createOrder(orderData)).then((result) => {
      if (!result.error) {
        toast.success('Order placed');
        setShowForm(false);
        resetForm();
      } else {
        toast.error(result.payload || 'Failed to place order');
      }
    });
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateOrderStatus({ id, status })).then((result) => {
      if (!result.error) {
        toast.success(`Order marked as ${status}`);
      } else {
        toast.error(result.payload || 'Failed to update order status');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'New Order'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select
              value={dealer}
              onChange={(e) => setDealer(e.target.value)}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select Dealer</option>
              {dealers.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.name} ({d.businessName})
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
                    {p.name} — Rs. {p.price} (stock: {p.currentStock})
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="border rounded px-3 py-2 w-24"
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
              Place Order
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="🧾"
          title="No orders yet"
          description="Create your first order to get started."
          actionLabel="New Order"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Dealer</th>
              <th className="p-3">Warehouse</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((order) => (
              <tr key={order._id} className="border-b align-top">
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{order.dealer?.name || '—'}</td>
                <td className="p-3">{order.warehouse?.name || '—'}</td>
                <td className="p-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="text-sm">
                      {item.product?.name || 'Unknown'} × {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="p-3">Rs. {order.totalAmount.toLocaleString()}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OrdersPage;