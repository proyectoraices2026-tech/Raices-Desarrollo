import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(

  
  <StrictMode>
    {/*
      StrictMode ocasiona que la app brinde alertas o errores que puede que no afecten el funcionamiento 
      de la app, pero podrían poner en riesgo la integridad de variables que no deberían de verse afectadas 
      o evitar asumir que la base de datos va a responder y exigir un loading para evitar fallas.
    */}

    {/* AuthProvider función de AuthContext encapsula app para que los datos de la sesión sean accesibles en todo momento */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
