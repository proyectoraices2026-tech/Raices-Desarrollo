import './App.css'
import TestDaisy from './pages/TestDaisy'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from './pages/MainPage';
import UpdateUser from './pages/UpdateUser';
import ResetPassword from './pages/ResetPassword';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex min-h-screen items-center justify-center">
    <span className="loading loading-spinner loading-lg" />
  </div>;

  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<TestDaisy />} />
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
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )

}

export default App
