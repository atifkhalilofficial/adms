import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import DealersPage from "./pages/DealersPage";
import ProtectedRoute from "./components/ProtectedRoute";
import WarehousesPage from "./pages/WarehousesPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentsPage from "./pages/PaymentsPage";

function App() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-white shadow-sm flex gap-4">
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
        <Link to="/dashboard" className="text-blue-600 hover:underline">
          Dashboard
        </Link>
        <Link to="/dealers" className="text-blue-600 hover:underline">
          Dealers
        </Link>
        <Link to="/warehouses" className="text-blue-600 hover:underline">
          Warehouses
        </Link>
        <Link to="/products" className="text-blue-600 hover:underline">
          Products
        </Link>
        <Link to="/inventory" className="text-blue-600 hover:underline">
          Inventory
        </Link>
        <Link to="/orders" className="text-blue-600 hover:underline">
          Orders
        </Link>
        <Link to="/payments" className="text-blue-600 hover:underline">
          Payments
        </Link>
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
        <Route
          path="/dealers"
          element={
            <ProtectedRoute>
              <DealersPage />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/warehouses"
          element={
            <ProtectedRoute>
              <WarehousesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
