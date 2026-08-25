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

**PENDIENTE:**

- Confirmar con Ricardo qué proveedor de SMTP están usando y qué límites de envío tiene ese proveedor.
- Verificar en el dashboard de Supabase (Authentication > Rate Limits) los valores exactos configurados para este proyecto en particular, y decidir si el equipo quiere ajustarlos antes de producción.

- _Falta de acceso al dashboard de Supabase._

## Row Level Security (RLS)

**Estado: pendiente, bloqueado por falta de acceso.**

**PENDIENTE:** verificar en Authentication > Policies que las tablas de datos de usuario tengan RLS activado, con políticas que limiten a cada usuario a ver/editar solo sus propios datos. Como resultado de la integración, el proyecto actualmente NO tiene una tabla `profiles` (se decidió usar `user_metadata` de Supabase Auth en su lugar), así que este punto aplica sobre todo a futuras tablas que el equipo cree (por ejemplo, para plantas o recordatorios).

_Falta de acceso al dashboard de Supabase_

## Logging y monitoreo básico

**Estado: logging del frontend completo y probado. Falta revisar logs de Supabase (requiere acceso al dashboard).**

- **Errores críticos del frontend:** se agregó `src/lib/logger.ts`, que registra en la consola del navegador cada error de autenticación con fecha, acción y código de estado (`[auth-error] {...}`). Probado en vivo: cada intento fallido de login genera su entrada correspondiente en consola.
- **Accesos:** Supabase registra automáticamente los intentos de login, registro y errores de autenticación en Authentication > Logs del dashboard.

**PENDIENTE:**

- Revisar Authentication > Logs en el dashboard para confirmar qué información queda disponible ahí y documentar cómo consultarla.
- _Requiere acceso al dashboard de Supabase (solicitado a Ricardo)._

---
