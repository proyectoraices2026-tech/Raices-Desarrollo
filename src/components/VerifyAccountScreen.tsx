import { ArrowLeft, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';

interface VerifyAccountScreenProps {
  email?: string;
  onResendCode: () => void;
  onBackToRegister: () => void;
}

export function VerifyAccountScreen({
  email = '',
  onResendCode,
  onBackToRegister,
}: VerifyAccountScreenProps) {
  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

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
      <div className="w-full max-w-sm mx-auto flex items-center justify-start pt-2">
        <button
          onClick={onBackToRegister}
          className="p-2 text-[#3E5C4A] hover:bg-[#4E705B]/10 rounded-full transition duration-200"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto my-auto py-6 flex flex-col items-center justify-between min-h-[400px]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#4E705B]/10 flex items-center justify-center mb-6">
            <Mail className="w-8 h-8 text-[#4E705B]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-3">
            Revisa tu correo
          </h1>
          <p className="text-center text-xs md:text-sm font-medium text-[#2D4A3E]/80 leading-relaxed max-w-xs mx-auto mb-8">
            Te enviamos un enlace de confirmación a{' '}
            <span className="font-bold text-[#2D4A3E]">{email}</span>. Ábrelo desde ese mismo dispositivo para activar tu cuenta.
          </p>
        </div>

        <div className="text-center my-6 space-y-1">
          <p className="text-xs font-medium text-[#2D4A3E]">
            ¿No recibiste el correo?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={timeLeft > 0}
              className={`font-semibold underline ${
                timeLeft === 0 ? 'text-[#2D4A3E] cursor-pointer hover:text-[#4E705B]' : 'text-slate-400 cursor-not-allowed'
              }`}
            >
              Reenviar correo
            </button>
          </p>
          {timeLeft > 0 && (
            <p className="text-xs font-semibold text-[#2D4A3E]">Puedes reenviarlo en {formatTime(timeLeft)}</p>
          )}
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}