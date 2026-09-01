import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface ForgotPasswordScreenProps {
  onSendResetInstruction: (email: string) => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordScreen({
  onSendResetInstruction,
  onBackToLogin,
}: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSendResetInstruction(email);
    }
  };

  return (
    <div className="min-h-screen bg-[#DFE5DC] flex flex-col justify-between p-6 md:p-12 relative">
      
      {/* Botón Superior Back */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-start pt-2">
        <button
          onClick={onBackToLogin}
          className="p-2 text-[#3E5C4A] hover:bg-[#4E705B]/10 rounded-full transition duration-200"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="w-full max-w-sm mx-auto my-auto py-6 flex flex-col justify-between min-h-[480px]">
        
        <div>
          {/* Título y Descripción */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-3">
            Forgot Password
          </h1>
          <p className="text-center text-xs md:text-sm font-medium text-[#2D4A3E]/80 leading-relaxed max-w-xs mx-auto mb-8">
            No worries! Enter your email address below and we will send you a link to reset password.
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm  transition"
              />
            </div>
          </form>
        </div>

        {/* Botón Principal */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200 mt-8"
        >
          Send Reset Instruction
        </button>

      </div>

      <div className="h-4" />
    </div>
  );
}