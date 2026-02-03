import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword"; // ✅ NEW IMPORT

// SELLER COMPONENTS
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrders from "./pages/seller/SellerOrders";

// ADMIN COMPONENTS
import AdminDashboard from "./pages/admin/AdminDashboard";

// CUSTOMER COMPONENTS
import CustomerDashboard from "./pages/customer/CustomerDashboard";

import ProtectedRoute from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const location = useLocation();
  const { token, user } = useAuth();
  const role = user?.role;

  // Define which pages should not show the Navbar
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password"; // ✅ HIDE NAVBAR ON RESET PAGE

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ================= ROOT REDIRECT LOGIC ================= */}
        <Route
          path="/"
          element={
            role === "ROLE_ADMIN"
              ? <Navigate to="/admin" />
              : role === "ROLE_SELLER"
              ? <Navigate to="/seller" />
              : <Products />
          }
        />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/login"
          element={
            !token
              ? <Login />
              : role === "ROLE_ADMIN"
              ? <Navigate to="/admin" />
              : role === "ROLE_SELLER"
              ? <Navigate to="/seller" />
              : <Navigate to="/" />
          }
        />

        <Route
          path="/signup"
          element={!token ? <Signup /> : <Navigate to="/" />}
        />

        {/* ✅ FORGOT PASSWORD ROUTE */}
        <Route 
          path="/forgot-password" 
          element={<ForgotPassword />} 
        />

        {/* ================= CUSTOMER ROUTES ================= */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="ROLE_CUSTOMER">
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* ✅ This single hub now manages Profile, Orders, and Payments via Tabs */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute role="ROLE_CUSTOMER">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= SELLER ROUTES ================= */}
        <Route
          path="/seller"
          element={
            <ProtectedRoute role="ROLE_SELLER">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/orders"
          element={
            <ProtectedRoute role="ROLE_SELLER">
              <SellerOrders />
            </ProtectedRoute>
          }
        />

        {/* Using Dashboard as placeholder for profile to keep logic simple */}
        <Route
          path="/seller/profile"
          element={
            <ProtectedRoute role="ROLE_SELLER">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}