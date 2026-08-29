import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { fetchPayments, createPayment } from '../features/payments/paymentSlice';
import TableSkeleton from '../components/TableSkeleton';
import EmptyState from '../components/EmptyState';

function PaymentsPage() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.payments);

  const [dealers, setDealers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    dealer: '',
    amount: '',
    method: 'cash',
    reference: '',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchPayments());

    axios
      .get('http://localhost:5000/api/dealers', { withCredentials: true })
      .then((res) => setDealers(res.data))
      .catch((err) => console.error('Failed to load dealers', err));
  }, [dispatch]);

  const resetForm = () => {
    setForm({
      dealer: '',
      amount: '',
      method: 'cash',
      reference: '',
      notes: '',
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createPayment(form)).then((result) => {
      if (!result.error) {
        toast.success('Payment recorded');
        setShowForm(false);
        resetForm();
      } else {
        toast.error(result.payload || 'Failed to record payment');
      }
    });
  };

  const selectedDealer = dealers.find((d) => d._id === form.dealer);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Record Payment'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mb-6 grid grid-cols-2 gap-4"
        >
          <select
            name="dealer"
            value={form.dealer}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          >
            <option value="">Select Dealer</option>
            {dealers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} — owes Rs. {d.outstandingBalance}
              </option>
            ))}
          </select>

          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cheque">Cheque</option>
            <option value="other">Other</option>
          </select>

          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
            min="1"
          />

          <input
            name="reference"
            placeholder="Reference (cheque #, transaction ID, etc.)"
            value={form.reference}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />

          <input
            name="notes"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={handleChange}
            className="border rounded px-3 py-2 col-span-2"
          />

          {selectedDealer && (
            <p className="col-span-2 text-sm text-gray-600">
              Current outstanding balance: <strong>Rs. {selectedDealer.outstandingBalance}</strong>
            </p>
          )}

          <button
            type="submit"
            className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Save Payment
          </button>
        </form>
      )}

      {loading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : list.length === 0 ? (
        <EmptyState
          icon="💵"
          title="No payments yet"
          description="Record a payment to start tracking dealer balances."
          actionLabel="Record Payment"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Date</th>
              <th className="p-3">Dealer</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Reference</th>
              <th className="p-3">By</th>
            </tr>
          </thead>
          <tbody>
            {list.map((payment) => (
              <tr key={payment._id} className="border-b">
                <td className="p-3">{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{payment.dealer?.name || '—'}</td>
                <td className="p-3">Rs. {payment.amount.toLocaleString()}</td>
                <td className="p-3">{payment.method.replace('_', ' ')}</td>
                <td className="p-3">{payment.reference || '—'}</td>
                <td className="p-3">{payment.createdBy?.name || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PaymentsPage;