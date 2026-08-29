import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchVehicles, createVehicle } from '../features/vehicles/vehicleSlice';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

function VehiclesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.vehicles);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    registrationNumber: '',
    type: 'truck',
    driverName: '',
    driverPhone: '',
    capacity: '',
  });

  useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      registrationNumber: '',
      type: 'truck',
      driverName: '',
      driverPhone: '',
      capacity: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createVehicle(form)).then((result) => {
      if (!result.error) {
        toast.success('Vehicle added');
        setShowForm(false);
        resetForm();
      } else {
        toast.error(result.payload || 'Failed to add vehicle');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={form.registrationNumber}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="truck">Truck</option>
            <option value="van">Van</option>
            <option value="pickup">Pickup</option>
            <option value="other">Other</option>
          </select>
          <input
            name="driverName"
            placeholder="Driver Name"
            value={form.driverName}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="driverPhone"
            placeholder="Driver Phone"
            value={form.driverPhone}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="capacity"
            placeholder="Capacity (e.g. 5 tons)"
            value={form.capacity}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Vehicle
          </button>
        </form>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={5} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="🚛"
          title="No vehicles yet"
          description="Add a vehicle to start scheduling deliveries."
          actionLabel="Add Vehicle"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Registration</th>
              <th className="p-3">Type</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Capacity</th>
            </tr>
          </thead>
          <tbody>
            {list.map((v) => (
              <tr key={v._id} className="border-b">
                <td className="p-3">{v.registrationNumber}</td>
                <td className="p-3">{v.type}</td>
                <td className="p-3">{v.driverName}</td>
                <td className="p-3">{v.driverPhone}</td>
                <td className="p-3">{v.capacity || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VehiclesPage;