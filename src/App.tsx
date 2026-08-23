import { useState } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { VerifyAccountScreen } from './components/VerifyAccountScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { CreateNewPasswordScreen } from './components/CreateNewPasswordScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    'onboarding' | 'login' | 'register' | 'verify' | 'forgot' | 'reset-password'
  >('forgot');
  const [targetEmail, setTargetEmail] = useState('johndoe@gmail.com');

  const handleLoginSubmit = (data: { email: string; password: string }) => {
    console.log('Login data:', data);
    alert(`Logging in with: ${data.email}`);
  };

  const handleRegisterSubmit = (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setTargetEmail(data.email);
    setCurrentScreen('verify');
  };

  const handleSendResetInstruction = (email: string) => {
    setTargetEmail(email);
    setCurrentScreen('verify');
  };

  const handleVerifySubmit = (code: string) => {
    console.log('Verification code:', code);
    setCurrentScreen('reset-password');
  };

  const handleResetPasswordSubmit = (newPassword: string) => {
    console.log('New Password set:', newPassword);
    alert('Password reset successfully! Please login with your new password.');
    setCurrentScreen('login');
  };

  const handleGoogleLogin = () => {
    console.log('Logging in with Google...');
  };

  return (
    <main className="w-full min-h-screen">
      {currentScreen === 'onboarding' && (
        <OnboardingScreen
          onSelectLogin={() => setCurrentScreen('login')}
          onSelectRegister={() => setCurrentScreen('register')}
          onGoogleLogin={handleGoogleLogin}
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLoginSubmit={handleLoginSubmit}
          onGoogleLogin={handleGoogleLogin}
          onForgotPassword={() => setCurrentScreen('forgot')}
          onBackToOnboarding={() => setCurrentScreen('onboarding')}
        />
      )}

      {currentScreen === 'register' && (
        <RegisterScreen
          onRegisterSubmit={handleRegisterSubmit}
          onBackToOnboarding={() => setCurrentScreen('onboarding')}
        />
      )}

      {currentScreen === 'forgot' && (
        <ForgotPasswordScreen
          onSendResetInstruction={handleSendResetInstruction}
          onBackToLogin={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'verify' && (
        <VerifyAccountScreen
          email={targetEmail}
          onVerifySubmit={handleVerifySubmit}
          onResendCode={() => alert('New code sent')}
          onBackToRegister={() => setCurrentScreen('forgot')}
        />
      )}

      {currentScreen === 'reset-password' && (
        <CreateNewPasswordScreen
          onResetPasswordSubmit={handleResetPasswordSubmit}
          onBackToVerify={() => setCurrentScreen('verify')}
        />
      )}
    </main>
  );
}