import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface VerifyAccountScreenProps {
  email?: string;
  onVerifySubmit: (code: string) => void;
  onResendCode: () => void;
  onBackToRegister: () => void;
}

//Aqui hay datos hardcodeados para probar la pantalla 
export function VerifyAccountScreen({
  email = 'johndoe@gmail.com',
  onVerifySubmit,
  onResendCode,
  onBackToRegister,
}: VerifyAccountScreenProps) {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(59);

  // Temporizador regresivo de 59 segundos
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 4) {
      onVerifySubmit(code);
    }
  };

  const handleResend = () => {
    if (timeLeft === 0) {
      setTimeLeft(59);
      onResendCode();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#DFE5DC] flex flex-col justify-between p-6 md:p-12 relative">
      
      {/* Botón Superior Back */}
      <div className="w-full max-w-sm mx-auto flex items-center justify-start pt-2">
        <button
          onClick={onBackToRegister}
          className="p-2 text-[#3E5C4A] hover:bg-[#4E705B]/10 rounded-full transition duration-200"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="w-full max-w-sm mx-auto my-auto py-6 flex flex-col justify-between min-h-[500px]">
        
        <div>
          {/* Título y Mensaje */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-3">
            Verify Account
          </h1>
          <p className="text-center text-xs md:text-sm font-medium text-[#2D4A3E]/80 leading-relaxed max-w-xs mx-auto mb-8">
            Code has been send to <span className="font-bold text-[#2D4A3E]">{email}</span>. Enter the code to verify your account.
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">
                Enter Code
              </label>
              <input
                type="text"
                maxLength={4}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="4 Digit Code"
                className="w-full px-4 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm  transition tracking-widest text-center font-bold"
              />
            </div>
          </form>
        </div>

        {/* Reenvío de Código y Temporizador */}
        <div className="text-center my-6 space-y-1">
          <p className="text-xs font-medium text-[#2D4A3E]">
            Didn’t Receive Code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`font-semibold underline ${
                timeLeft === 0
                  ? 'text-[#2D4A3E] cursor-pointer hover:text-[#4E705B]'
                  : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              Resend Code
            </button>
          </p>
          <p className="text-xs font-semibold text-[#2D4A3E]">
            Resend code in {formatTime(timeLeft)}
          </p>
        </div>

        {/* Botón Principal */}
        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] transition duration-200"
        >
          Verify Account
        </button>

      </div>

      <div className="h-4" />
    </div>
  );
}