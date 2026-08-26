import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers, createSupplier } from '../features/suppliers/supplierSlice';

function SuppliersPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.suppliers);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      name: '',
      companyName: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createSupplier(form)).then((result) => {
      if (!result.error) {
        setShowForm(false);
        resetForm();
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Supplier'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Contact Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border rounded px-3 py-2 col-span-2"
          />
          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Supplier
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
              <th className="p-3">Name</th>
              <th className="p-3">Company</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Address</th>
            </tr>
          </thead>
          <tbody>
            {list.map((supplier) => (
              <tr key={supplier._id} className="border-b">
                <td className="p-3">{supplier.name}</td>
                <td className="p-3">{supplier.companyName || '—'}</td>
                <td className="p-3">{supplier.phone}</td>
                <td className="p-3">{supplier.email || '—'}</td>
                <td className="p-3">{supplier.address || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SuppliersPage;