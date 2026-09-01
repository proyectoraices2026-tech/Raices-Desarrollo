import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MainPage from './pages/MainPage';
import UpdateUser from './pages/UpdateUser';
import ResetPassword from './pages/ResetPassword';
import Catalog from './pages/Catalog';
import AdminProducts from './pages/AdminProducts';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center">
    <span className="loading loading-spinner loading-lg" />
  </div>;

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center">
    <span className="loading loading-spinner loading-lg" />
  </div>;

  if (!user) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/home" />;

  return <>{children}</>;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/home" element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <UpdateUser />
          </PrivateRoute>
        } />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/catalog" element={
          <PrivateRoute>
            <Catalog />
          </PrivateRoute>
        } />
        <Route path="/admin/products/new" element={
          <AdminRoute>
            <AdminProducts/>
          </AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  )

}

export default App
