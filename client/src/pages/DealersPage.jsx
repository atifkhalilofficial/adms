import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDealers, createDealer, updateDealer, deleteDealer } from '../features/dealers/dealerSlice';
function DealersPage() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.dealers);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    city: '',
    address: '',
    cnic: '',
    category: 'retailer',
    creditLimit: 0,
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchDealers());
  }, [dispatch]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const resetForm = () => {
  setForm({
    name: '',
    businessName: '',
    phone: '',
    email: '',
    province: '',
    district: '',
    city: '',
    address: '',
    cnic: '',
    category: 'retailer',
    creditLimit: 0,
  });
};


const handleEdit = (dealer) => {
  setForm({
    name: dealer.name,
    businessName: dealer.businessName,
    phone: dealer.phone,
    email: dealer.email || '',
    province: dealer.province,
    district: dealer.district,
    city: dealer.city,
    address: dealer.address,
    cnic: dealer.cnic,
    category: dealer.category,
    creditLimit: dealer.creditLimit,
  });
  setEditingId(dealer._id);
  setShowForm(true);
};

const handleDelete = (id) => {
  if (window.confirm('Delete this dealer?')) {
    dispatch(deleteDealer(id));
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (editingId) {
    dispatch(updateDealer({ id: editingId, data: form })).then(() => {
      setShowForm(false);
      setEditingId(null);
      resetForm();
    });
  } else {
    dispatch(createDealer(form)).then(() => {
      setShowForm(false);
      resetForm();
    });
  }
};

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dealers</h1>
        <button
  onClick={() => {
    setShowForm(!showForm);
    setEditingId(null);
    resetForm();
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  {showForm ? 'Cancel' : 'Add Dealer'}
</button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <input
            name="name"
            placeholder="Dealer Name"
            value={form.name}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="businessName"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
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
            name="province"
            placeholder="Province"
            value={form.province}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="district"
            placeholder="District"
            value={form.district}
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
          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <input
            name="cnic"
            placeholder="CNIC"
            value={form.cnic}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="retailer">Retailer</option>
            <option value="wholesaler">Wholesaler</option>
            <option value="distributor">Distributor</option>
          </select>
          <input
            name="creditLimit"
            type="number"
            placeholder="Credit Limit"
            value={form.creditLimit}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
          <button
  type="submit"
  className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
>
  {editingId ? 'Update Dealer' : 'Save Dealer'}
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
              <th className="p-3">Business</th>
              <th className="p-3">Phone</th>
              <th className="p-3">City</th>
              <th className="p-3">Category</th>
              <th className="p-3">Credit Limit</th>
              <th className="p-3">Outstanding</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((dealer) => (
              <tr key={dealer._id} className="border-b">
                <td className="p-3">{dealer.name}</td>
                <td className="p-3">{dealer.businessName}</td>
                <td className="p-3">{dealer.phone}</td>
                <td className="p-3">{dealer.city}</td>
                <td className="p-3">{dealer.category}</td>
                <td className="p-3">{dealer.creditLimit}</td>
                <td className="p-3">{dealer.outstandingBalance}</td>
                <td className="p-3 flex gap-2">
  <button
    onClick={() => handleEdit(dealer)}
    className="text-blue-600 hover:underline text-sm"
  >
    Edit
  </button>
  <button
    onClick={() => handleDelete(dealer._id)}
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

export default DealersPage;