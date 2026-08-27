import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { logout } from '../features/auth/authSlice';

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard', { withCredentials: true })
      .then((res) => setStats(res.data))
      .catch((err) => console.error('Failed to load dashboard', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : !stats ? (
        <p className="text-red-600">Failed to load dashboard data.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Dealers</p>
              <p className="text-2xl font-bold">{stats.totalDealers}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
              <p className="text-xs text-orange-600">{stats.pendingOrders} pending</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold">Rs. {stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Outstanding Balance</p>
              <p className="text-2xl font-bold text-red-600">
                Rs. {stats.totalOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow-md">
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-bold text-orange-600">{stats.lowStockCount}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="font-semibold mb-4">Revenue — Last 6 Months</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.revenueChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                <Bar dataKey="revenue" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {stats.lowStockProducts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="font-semibold mb-4">Low Stock Alerts</h2>
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Product</th>
                    <th className="p-2">Current Stock</th>
                    <th className="p-2">Minimum Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.lowStockProducts.map((p) => (
                    <tr key={p._id} className="border-b">
                      <td className="p-2">{p.name}</td>
                      <td className="p-2 text-red-600 font-semibold">{p.currentStock}</td>
                      <td className="p-2">{p.minimumStock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default DashboardPage;