// Registro básico de errores críticos de autenticación.
// Escribe a la consola de forma estructurada; si más adelante el equipo
// decide mandar esto a un servicio externo, este es el único archivo
// que habría que tocar.

type AuthAction =
  | 'login'
  | 'register'
  | 'logout'
  | 'reset-password-request'
  | 'reset-password-confirm'
  | 'update-profile';

export function logAuthError(action: AuthAction, error: unknown) {
  const err = error as { message?: string; status?: number } | null;
  const entry = {
    timestamp: new Date().toISOString(),
    action,
    status: err?.status ?? 'unknown',
    message: err?.message ?? 'Error desconocido',
  };
  console.error('[auth-error]', entry);
}

// Convierte errores técnicos de Supabase en mensajes que un usuario
// normal entiende, y detecta específicamente el caso de rate limiting.
export function getFriendlyAuthErrorMessage(error: unknown): string {
  const err = error as { message?: string; status?: number } | null;

  if (err?.status === 429 || err?.message?.toLowerCase().includes('rate limit')) {
    return 'Hiciste demasiados intentos en poco tiempo. Espera unos minutos antes de volver a intentarlo.';
  }

  return err?.message ?? 'Ocurrió un error inesperado. Intenta de nuevo.';
}
