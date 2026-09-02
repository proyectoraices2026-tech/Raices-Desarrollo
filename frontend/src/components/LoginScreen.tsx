import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginScreenProps {
  onLoginSubmit: (data: { email: string; password: string }) => void;
  onForgotPassword: () => void;
  onBackToOnboarding: () => void;
}

/* Pantalla que captura las credenciales para iniciar sesión */
export function LoginScreen({
  onLoginSubmit,
  onForgotPassword,
  onBackToOnboarding,
}: LoginScreenProps) {
  /* Estados de los campos y de la visibilidad de la contraseña */
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Detiene el envío del navegador y entrega las credenciales a la página */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSubmit({ email, password });
  };

  return (
    <div className="min-h-screen bg-[#DFE5DC] flex flex-col justify-between p-6 md:p-12 relative">

      <div className="w-full max-w-sm mx-auto flex items-center justify-start pt-2">
        <button
          onClick={onBackToOnboarding}
          className="p-2 text-[#3E5C4A] hover:bg-[#4E705B]/10 rounded-full transition duration-200"
          title="Volver"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto my-auto py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-8">
          Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFFFFF] text-sm  transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2D4A3E] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-4 pr-11 py-3 bg-white border border-transparent rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm  transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-xs font-semibold text-[#2D4A3E] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A]  transition duration-200 mt-4"
          >
            Login
          </button>
        </form>
      </div>

      <div className="h-6"></div>
    </div>
  );
}
