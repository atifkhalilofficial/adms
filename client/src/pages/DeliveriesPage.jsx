import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchDeliveries, createDelivery, updateDeliveryStatus } from '../features/deliveries/deliverySlice';

function DeliveriesPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.deliveries);

  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    order: '',
    vehicle: '',
    scheduledDate: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchDeliveries());

    axios
      .get('http://localhost:5000/api/orders', { withCredentials: true })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error('Failed to load orders', err));

    axios
      .get('http://localhost:5000/api/vehicles', { withCredentials: true })
      .then((res) => setVehicles(res.data))
      .catch((err) => console.error('Failed to load vehicles', err));
  }, [dispatch]);

  const resetForm = () => {
    setForm({ order: '', vehicle: '', scheduledDate: '', notes: '' });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createDelivery(form)).then((result) => {
      if (!result.error) {
        setShowForm(false);
        resetForm();
      }
    });
  };

  const handleStatusChange = (id, status) => {
    dispatch(updateDeliveryStatus({ id, status }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Deliveries</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Schedule Delivery'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <select
            name="order"
            value={form.order}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Order</option>
            {orders.map((o) => (
              <option key={o._id} value={o._id}>
                {o.dealer?.name} — Rs. {o.totalAmount} ({o.status})
              </option>
            ))}
          </select>

          <select
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.registrationNumber} — {v.driverName}
              </option>
            ))}
          </select>

          <input
            name="scheduledDate"
            type="date"
            value={form.scheduledDate}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
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
            Save Delivery
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
              <th className="p-3">Dealer</th>
              <th className="p-3">Vehicle</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Scheduled</th>
              <th className="p-3">Delivered</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d._id} className="border-b">
                <td className="p-3">{d.order?.dealer?.name || '—'}</td>
                <td className="p-3">{d.vehicle?.registrationNumber || '—'}</td>
                <td className="p-3">{d.vehicle?.driverName || '—'}</td>
                <td className="p-3">{new Date(d.scheduledDate).toLocaleDateString()}</td>
                <td className="p-3">
                  {d.deliveredDate ? new Date(d.deliveredDate).toLocaleDateString() : '—'}
                </td>
                <td className="p-3">
                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(d._id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
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

export default DeliveriesPage;