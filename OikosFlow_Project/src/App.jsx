import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./Home/home.jsx";
import Tarea from "./Tarea/tarea.jsx";
import Historial from "./Historial/historial.jsx";
import Inicio from "./Auth/Inicio.jsx";
import Registro from "./Auth/Registro.jsx";
import Login from "./Auth/Login.jsx";
import RecuperarSms from "./Auth/RecuperarSms.jsx";
import RecuperarCorreo from "./Auth/RecuperarCorreo.jsx";
import Perfil from "./Perfil/perfil.jsx";
import "./App.css";
import "./Auth/auth.scss";

const RequireAuth = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("usuarioActivo");
  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("usuarioActivo");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <>
      <Toaster
        position="top-center"
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#2c2c2c",
            padding: "16px 24px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "500",
            minWidth: "320px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
          },
          success: {
            iconTheme: {
              primary: "#22c55e",   // Verde moderno
              secondary: "#ffffff"
            }
          },
          error: {
            iconTheme: {
              primary: "#ef4444",   // Rojo moderno
              secondary: "#ffffff"
            }
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route
          path="/home"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/tareas"
          element={
            <RequireAuth>
              <Tarea />
            </RequireAuth>
          }
        />
        <Route
          path="/historial"
          element={
            <RequireAuth>
              <Historial />
            </RequireAuth>
          }
        />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/auth" element={<Inicio />} />
        <Route path="/auth/registro" element={<Registro />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/recuperar-sms" element={<RecuperarSms />} />
        <Route path="/auth/recuperar-correo" element={<RecuperarCorreo />} />
      </Routes>
    </>
  );
}

export default App;
