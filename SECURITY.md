# Seguridad — Raíces

Este documento cubre las medidas de seguridad adicionales del proyecto, sobre la autenticación construida con Supabase Auth.

## CORS

**Estado: completo.**

La API de Supabase está diseñada para ser llamada directo desde el navegador usando la `anon key` pública, así que restringir CORS de forma tradicional (como se haría en un backend propio) no aplica de la misma manera aquí. La protección real de los datos vive en las políticas de **Row Level Security (RLS)** de cada tabla, no en configurar orígenes permitidos.

## CSRF

**Estado: completo.**

La app usa tokens JWT que el SDK de Supabase envía en el header `Authorization`, no cookies de sesión automáticas. Como el ataque de CSRF depende de que el navegador mande cookies sin que el usuario lo note, este esquema de autenticación reduce ese riesgo de forma significativa.

## Rate limiting / protección contra fuerza bruta

**Estado: código y documentación listos, falta confirmar valores exactos del proyecto (requiere acceso al dashboard).**

Supabase Auth aplica rate limiting automático por dirección IP usando un algoritmo de "cubeta de tokens": máximo 30 solicitudes, con recarga progresiva; al exceder el límite responde con error `429`.

Del lado del frontend, se agregó manejo específico para el error `429`: cuando ocurre, se muestra un mensaje claro al usuario ("Hiciste demasiados intentos... espera unos minutos") en vez de un error técnico (ver `src/lib/logger.ts` y los handlers en `App.tsx`).

**Nota sobre correos:** el límite de 2 correos/hora que documenta Supabase aplica solo a su SMTP por defecto. El proyecto usa un proveedor de correo propio (SMTP custom) en vez del de Supabase, precisamente para evitar esa restricción, ese límite específico de correos ya NO aplica tal cual. El rate limiting por IP a nivel de solicitudes (los 30 tokens mencionados arriba) es independiente del proveedor de correo y sigue vigente.

**Evidencia de prueba:** se probaron 12 intentos de login fallidos seguidos (contraseña incorrecta) y el sistema no llegó a bloquear por rate limit — cada intento devolvió un error normal `400 Invalid login credentials`, registrado correctamente por el logger. Esto confirma que el límite de 30 solicitudes de la "cubeta" sigue activo en el proyecto (no fue desactivado), ya que 12 intentos no lo agotan.

**Confirmado en el dashboard (Authentication > Rate Limits):**

Límite -> Valor configurado
Envío de correos -> 30/hora
Envío de SMS -> 30/hora
Refresco de tokens de sesión -> 150 cada 5 min (1800/hora)
Verificación de OTP/magic link -> 30 cada 5 min (360/hora)
Sign-ups y sign-ins -> 30 cada 5 min (360/hora)
Usuarios anónimos -> 30/hora

**Confirmado en Project Settings > Auth > SMTP Settings:** el proyecto
usa SMTP personalizado (`smtp.gmail.com`, puerto 587), no el de
Supabase.

**⚠️ Hallazgo:** Supabase muestra una advertencia activa : el proveedor configurado (una cuenta de Gmail personal está pensado para correo personal, no
transaccional, y puede tener problemas de entrega o bloqueos).
Recomendación: considerar un proveedor SMTP transaccional (SendGrid, Resend, Mailgun, etc.) antes de producción.

## Row Level Security (RLS)

**Estado: verificado**

Confirmado en Authentication > Policies:

- **Tabla `profiles`**: SÍ existe (contrario a lo que se documentó antes durante la integración) y tiene RLS activado con 3 políticas:
  - `Permitir inserción de perfil propio` (INSERT, authenticated)
  - `Usuario edita su propio perfil` (UPDATE, authenticated)
  - `Usuario ve su propio perfil` (SELECT, authenticated)

- **Tabla `roles`**: tiene RLS activado pero **cero políticas creadas**, lo que significa que actualmente nadie puede leer ni escribir esa tabla desde el frontend (bloqueo total por API).

## Logging y monitoreo básico

**Estado: logging del frontend completo y probado**

- **Errores críticos del frontend:** se agregó `src/lib/logger.ts`, que registra en la consola del navegador cada error de autenticación con fecha, acción y código de estado (`[auth-error] {...}`). Probado en vivo: cada intento fallido de login genera su entrada correspondiente en consola.
- **Accesos:** Supabase registra automáticamente los intentos de login, registro y errores de autenticación en Authentication > Logs del dashboard.

Se revisó Authentication > Logs, Supabase sí registra automáticamente, con severidad y hora exacta:

- Logins (`Login`, `/token`)
- Registros (`/signup`)
- Cierres de sesión (`/logout`)
- Verificación de correo (`/verify`), incluyendo el caso de enlaces
  inválidos o expirados (`403: Email link is invalid or has expired`)
- Recuperación de contraseña (`/recover`)
- Consultas de usuario (`/user`)
