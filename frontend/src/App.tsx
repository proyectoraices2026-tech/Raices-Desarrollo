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

/* 
    Rutas privadas

    Esto se refiere a las rutas dentro de la app que requieren de que el usuario se encuentre autenticado
    se hace uso del AuthContext mediante useAuth para verificar la validez de la sesión, en caso de que la
    sesión no exista o haya expirado el intento de acceder a la ruta será "denegado" mandando al usario al login
*/
/* children hace referencia al componento encapsulado dentro de <PrivateRoute/> */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  /* llamado a los atributos necesarios para validar la sesión mediante useAuth */
  const { user, loading } = useAuth();

  /* 
    Si loading es true, es decir que el llamado a la base de datos por alguna razón 
    no está respondiendo, por ende para evitar imprevistos se crea un componente que
    indica que la app está cargando
  */
  if (loading) return <div className="flex min-h-screen items-center justify-center">
    <span className="loading loading-spinner loading-lg" />
  </div>;

  /* 
    Aquí se valida si el usuario actual existe (sesión válida), si existe se envía al componente encapsulado, si no
    se "denienga" el acceso enviando al usuario a login
  */
  return user ? <>{children}</> : <Navigate to="/login" />;
}

/* 
    Rutas exclusivas para admins

    Esto se refiere a las rutas dentro de la app que requieren de un usuario cuyo rol sea administrador
    se hace uso del AuthContext mediante useAuth para verificar el rol del usuario, en caso de que este sea
    administrador, si no posee este rol el intento de acceder a la ruta será "denegado" mandando al usario al HomePage
*/
/* children hace referencia al componento encapsulado dentro de <AdminRoute/> */
function AdminRoute({ children }: { children: React.ReactNode }) {
  /* llamado a los atributos necesarios para validar la sesión mediante useAuth */
  const { user, role, loading } = useAuth();

  /* 
    Si loading es true, es decir que el llamado a la base de datos por alguna razón 
    no está respondiendo, por ende para evitar imprevistos se crea un componente que
    indica que la app está cargando
  */
  if (loading) return <div className="flex min-h-screen items-center justify-center">
    <span className="loading loading-spinner loading-lg" />
  </div>;
  /* 
    Aquí se valida si el usuario actual existe (sesión válida), si existe se envía al componente encapsulado, si no
    se "denienga" el acceso enviando al usuario a login
  */  
  if (!user) return <Navigate to="/login" />;

  /* 
    Por otro lado, si el usuario si se encuentra logueado, pero su rol no es admin, se le 
    "denienga" el acceso enviando al usuario a HomePage
  */
  if (role !== "admin") return <Navigate to="/home" />;

  return <>{children}</>;
}

function App() {

  return (
    <BrowserRouter>
    {/*Rutas públicas que por motivos de logística no deben de requerir de autenticación*/}
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/*Ruta privada, requiere autenticación por parte del usuario*/}
        <Route path="/home" element={
          <PrivateRoute>
            <MainPage />
          </PrivateRoute>
        } />

        {/*Ruta privada, requiere autenticación por parte del usuario*/}
        <Route path="/profile" element={
          <PrivateRoute>
            <UpdateUser />
          </PrivateRoute>
        } />

        {/*Ruta privada, requiere autenticación por parte del usuario*/}
        <Route path="/catalog" element={
          <PrivateRoute>
            <Catalog />
          </PrivateRoute>
        } />

        {/*Ruta de admin, sólo deja pasar a usuarios con rol admin*/}
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
