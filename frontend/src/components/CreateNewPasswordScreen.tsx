import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { validatePassword } from '../utils/ValidatePassword';

interface CreateNewPasswordScreenProps {
  onResetPasswordSubmit: (newPassword: string) => void;
  onBackToVerify: () => void;
}

export function CreateNewPasswordScreen({
  onResetPasswordSubmit,
  onBackToVerify,
}: CreateNewPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) {
      setError(passwordResult.message!);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    onResetPasswordSubmit(password);
  };

  return (
    <div className="min-h-screen bg-[#DFE5DC] flex flex-col justify-between p-6 md:p-12 relative">

      <div className="w-full max-w-sm mx-auto flex items-center justify-start pt-2">
        <button
          onClick={onBackToVerify}
          className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-[#2D4A3E] shadow-sm transition duration-200"
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="w-full max-w-sm mx-auto my-auto py-6 flex flex-col justify-between min-h-[500px]">

        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D4A3E] text-center mb-3">
            Create New Password
          </h1>
          <p className="text-center text-xs md:text-sm font-medium text-[#2D4A3E]/80 leading-relaxed max-w-xs mx-auto mb-8">
            Please enter and confirm your new password. You will need to login after you reset.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm shadow-sm transition"
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
              <p className="text-[11px] font-medium text-[#4E705B] mt-1">
                must contain 8 char. + 1 special char.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D4A3E] mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-white rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4E705B] text-sm shadow-sm transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-semibold text-center pt-1">
                {error}
              </p>
            )}
          </form>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-full bg-[#4E705B] text-white font-semibold text-sm hover:bg-[#3E5C4A] shadow-md transition duration-200 mt-8"
        >
          Reset Password
        </button>

      </div>

      <div className="h-4" />
    </div>
  );
}
