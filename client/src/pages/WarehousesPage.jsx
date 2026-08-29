import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  fetchWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from '../features/warehouses/warehouseSlice';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

function WarehousesPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.warehouses);

  const [managers, setManagers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    location: '',
    city: '',
    manager: '',
    capacity: 0,
    contactPhone: '',
  });

  useEffect(() => {
    dispatch(fetchWarehouses());

    axios
      .get('http://localhost:5000/api/users?role=warehouse_manager', { withCredentials: true })
      .then((res) => setManagers(res.data))
      .catch((err) => console.error('Failed to load managers', err));
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      name: '',
      location: '',
      city: '',
      manager: '',
      capacity: 0,
      contactPhone: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      dispatch(updateWarehouse({ id: editingId, data: form })).then((result) => {
        if (!result.error) {
          toast.success('Warehouse updated');
          setShowForm(false);
          setEditingId(null);
          resetForm();
        } else {
          toast.error(result.payload || 'Failed to update warehouse');
        }
      });
    } else {
      dispatch(createWarehouse(form)).then((result) => {
        if (!result.error) {
          toast.success('Warehouse added');
          setShowForm(false);
          resetForm();
        } else {
          toast.error(result.payload || 'Failed to add warehouse');
        }
      });
    }
  };

  const handleEdit = (warehouse) => {
    setForm({
      name: warehouse.name,
      location: warehouse.location,
      city: warehouse.city,
      manager: warehouse.manager?._id || '',
      capacity: warehouse.capacity,
      contactPhone: warehouse.contactPhone || '',
    });
    setEditingId(warehouse._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this warehouse?')) {
      dispatch(deleteWarehouse(id)).then((result) => {
        if (!result.error) {
          toast.success('Warehouse deleted');
        } else {
          toast.error(result.payload || 'Failed to delete warehouse');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Warehouses</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Warehouse'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Warehouse Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <select
            name="manager"
            value={form.manager}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            value={form.capacity}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="contactPhone"
            placeholder="Contact Phone"
            value={form.contactPhone}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {editingId ? 'Update Warehouse' : 'Save Warehouse'}
          </button>
        </form>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="🏭"
          title="No warehouses yet"
          description="Add your first warehouse to start tracking inventory locations."
          actionLabel="Add Warehouse"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Name</th>
              <th className="p-3">Location</th>
              <th className="p-3">City</th>
              <th className="p-3">Manager</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((warehouse) => (
              <tr key={warehouse._id} className="border-b">
                <td className="p-3">{warehouse.name}</td>
                <td className="p-3">{warehouse.location}</td>
                <td className="p-3">{warehouse.city}</td>
                <td className="p-3">{warehouse.manager?.name || '—'}</td>
                <td className="p-3">{warehouse.capacity}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(warehouse)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(warehouse._id)}
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

export default WarehousesPage;