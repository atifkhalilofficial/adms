 import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => dispatch(logout())}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      <p>Welcome, {user?.name} ({user?.role})</p>
    </div>
  );
}

export default DashboardPage;