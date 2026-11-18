import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { lazy, Suspense } from "react";

//Rutas indispensables para la apertura de la página por lo que no pueden ceder turno
import Catalog from './pages/Catalog';
import ScrollToTop from './components/ScrollToTop';
import GuidePopup from './components/GuidePopup';
import ChatBubble from './components/ChatBubble';
import WelcomeTour from './components/WelcomeTour';

//Rutas lazy que esperan su turno para cargar
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const MainPage = lazy(() => import("./pages/MainPage"));
const UpdateUser = lazy(() => import("./pages/UpdateUser"));
const UpdatePasswordFromProfile = lazy(() => import("./pages/UpdatePasswordFromProfile"));
const AdminProducts = lazy(() => import("./pages/AdminProducts"));
const AdminRequests = lazy(() => import("./pages/AdminRequests"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminStats = lazy(() => import("./pages/AdminStats"));
const AdminAssignPlants = lazy(() => import("./pages/AdminAssignPlants"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const MyPlants = lazy(() => import("./pages/MyPlants"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Cart = lazy(() => import("./pages/Cart"));
const MyRequests = lazy(() => import("./pages/MyRequests"));
const TermsAndConditions = lazy(() => import("./pages/TermsAndConditions"));
const Calendar = lazy(() => import("./pages/Calendar"));
const Chatbot = lazy(() => import("./pages/ChatBot"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Guides = lazy(() => import("./pages/Guides"));
const GardeningGuides = lazy(() => import("./pages/GardeningGuides"));
const ArchiveRequests = lazy(() => import("./pages/ArchiveRequests"));

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
  if (role !== "admin") return <Navigate to="/my-plants" />;

  return <>{children}</>;
}

function App() {

  return (
    <BrowserRouter>

      <ScrollToTop></ScrollToTop>
      <GuidePopup />
      <ChatBubble />
      <WelcomeTour />
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center">
            <span className="loading loading-spinner loading-lg" />
          </div>
        }
      >
        
          {/*Rutas públicas que por motivos de logística no deben de requerir de autenticación*/}
      <Routes>
        <Route path="/" element={<Catalog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/cart" element={<Cart />} />

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
        <Route path="/profile-password" element={
          <PrivateRoute>
            <UpdatePasswordFromProfile />
          </PrivateRoute>
        } />

        {/*Ruta privada, requiere autenticación por parte del usuario*/}
        <Route path="/calendar" element={
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        } />

        <Route path="/chatbot" element={
          <PrivateRoute>
            <Chatbot />
          </PrivateRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        {/*Ruta de admin: página aparte de estadísticas*/}
        <Route path="/admin/stats" element={
          <AdminRoute>
            <AdminStats />
          </AdminRoute>
        } />

        <Route path="/noticias" element={<NewsPage />} />


        {/*Ruta de admin, sólo deja pasar a usuarios con rol admin*/}
        <Route path="/admin/products/new" element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        } />
        {/*Ruta de admin, sólo deja pasar a usuarios con rol admin*/}
        <Route path="/admin/requests" element={
          <AdminRoute>
            <AdminRequests />
          </AdminRoute>
        } />

        <Route path="/admin/plants" element={
          <AdminRoute>
            <AdminAssignPlants />
          </AdminRoute>
        } />

        {/*Ruta privada, requiere autenticación por parte del usuario*/}
        <Route path="/my-plants" element={
          <PrivateRoute>
            <MyPlants />
          </PrivateRoute>
        } />

        {/*Ruta privada, requiere autenticación por parte del usuario*/}
        <Route path="/archive-requests" element={
          <PrivateRoute>
            <ArchiveRequests></ArchiveRequests>
          </PrivateRoute>
        } />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/gardening-guides" element={<GardeningGuides />} />
        <Route path="/notifications" element={
          <PrivateRoute>
            <Notifications />
          </PrivateRoute>
        } />
        <Route path="/my-requests" element={
          <PrivateRoute>
            <MyRequests />
          </PrivateRoute>
        } />
      
        </Routes>
      </Suspense>
      
    </BrowserRouter>
  )

}

export default App
