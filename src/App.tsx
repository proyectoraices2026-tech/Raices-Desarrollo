import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { VerifyAccountScreen } from './components/VerifyAccountScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { CreateNewPasswordScreen } from './components/CreateNewPasswordScreen';
import { HomeScreen } from './components/HomeScreen';
import { EditProfileScreen } from './components/EditProfileScreen';
import { supabase } from './lib/supabase';
import { useAuth } from './context/AuthContext';

function Loading() {
  return (
    <div className="min-h-screen bg-[#DFE5DC] flex items-center justify-center">
      Cargando...
    </div>
  );
}

// Solo accesible si HAY sesión (home, profile)
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

// Solo accesible si NO hay sesión (onboarding, login, register, forgot)
function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return user ? <Navigate to="/home" replace /> : <>{children}</>;
}

function OnboardingRoute() {
  const navigate = useNavigate();
  return (
    <OnboardingScreen
      onSelectLogin={() => navigate('/login')}
      onSelectRegister={() => navigate('/register')}
    />
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLoginSubmit = async (data: { email: string; password: string }) => {
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setAuthError(error.message);
      alert(`Error al iniciar sesión: ${error.message}`);
      return;
    }
    navigate('/home');
  };

  return (
    <>
      <LoginScreen
        onLoginSubmit={handleLoginSubmit}
        onForgotPassword={() => navigate('/forgot')}
        onBackToOnboarding={() => navigate('/')}
      />
      {authError && <p className="text-red-600 text-sm text-center mt-4">{authError}</p>}
    </>
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const handleRegisterSubmit = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: `${data.firstName} ${data.lastName}`.trim(), phone: data.phone },
      },
    });
    if (error) {
      setAuthError(error.message);
      alert(`Error al registrar: ${error.message}`);
      return;
    }
    navigate('/verify', { state: { email: data.email } });
  };

  return (
    <>
      <RegisterScreen onRegisterSubmit={handleRegisterSubmit} onBackToOnboarding={() => navigate('/')} />
      {authError && <p className="text-red-600 text-sm text-center mt-4">{authError}</p>}
    </>
  );
}

function VerifyRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email ?? '';

  return (
    <VerifyAccountScreen
      email={email}
      onResendCode={async () => {
        const { error } = await supabase.auth.resend({ type: 'signup', email });
        alert(error ? `No se pudo reenviar: ${error.message}` : 'Correo reenviado.');
      }}
      onBackToRegister={() => navigate('/register')}
    />
  );
}

function ForgotRoute() {
  const navigate = useNavigate();

  const handleSendResetInstruction = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      alert(`Error: ${error.message}`);
      return;
    }
    alert('Te enviamos un enlace para restablecer tu contraseña. Revisa tu correo.');
    navigate('/login');
  };

  return (
    <ForgotPasswordScreen
      onSendResetInstruction={handleSendResetInstruction}
      onBackToLogin={() => navigate('/login')}
    />
  );
}

// OJO: esta ruta NO está protegida por PublicOnlyRoute ni PrivateRoute a propósito.
// Cuando el usuario hace clic en el link de recuperación, Supabase SÍ crea una
// sesión temporal — si esta ruta fuera "PrivateRoute" no pasaría nada raro, pero
// si fuera "PublicOnlyRoute" te mandaría a /home en vez de dejarte cambiar la
// contraseña. Por eso queda libre.
function ResetPasswordRoute() {
  const navigate = useNavigate();

  const handleResetPasswordSubmit = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      alert(`Error al cambiar contraseña: ${error.message}`);
      return;
    }
    alert('¡Contraseña cambiada! Inicia sesión con la nueva.');
    await supabase.auth.signOut();
    navigate('/login', { replace: true });
  };

  return (
    <CreateNewPasswordScreen
      onResetPasswordSubmit={handleResetPasswordSubmit}
      onBackToVerify={() => navigate('/login')}
    />
  );
}

function HomeRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/', { replace: true });
  };

  return (
    <HomeScreen
      email={user?.email ?? ''}
      onLogout={handleLogout}
      onEditProfile={() => navigate('/profile')}
    />
  );
}

function ProfileRoute() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSaveProfile = async ({ name, email }: { name: string; email: string }) => {
    const updatePayload: { email?: string; data?: Record<string, unknown> } = { data: { name } };
    if (email !== user?.email) updatePayload.email = email;
    const { error } = await supabase.auth.updateUser(updatePayload);
    if (error) throw error;
  };

  return (
    <EditProfileScreen
      currentName={(user?.user_metadata?.name as string) ?? ''}
      currentEmail={user?.email ?? ''}
      onSave={handleSaveProfile}
      onBack={() => navigate('/home')}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicOnlyRoute><OnboardingRoute /></PublicOnlyRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><LoginRoute /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterRoute /></PublicOnlyRoute>} />
        <Route path="/verify" element={<VerifyRoute />} />
        <Route path="/forgot" element={<PublicOnlyRoute><ForgotRoute /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<ResetPasswordRoute />} />
        <Route path="/home" element={<PrivateRoute><HomeRoute /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfileRoute /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}