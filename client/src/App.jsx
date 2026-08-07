import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-white shadow-sm flex gap-4">
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
        <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;