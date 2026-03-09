import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaCheckCircle, FaExclamationTriangle, FaTimes, FaClock } from "react-icons/fa";
import usuariosBase from "../Data/usuarios.json";

const LOGIN_SUCCESS_TOAST_ID = "login-success";

const Login = () => {
  const navigate = useNavigate();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  // Toast de éxito (personalizado, único y de 2s)
  const mostrarToastExito = (mensaje) => {
    // Cerrar cualquier toast de éxito previo del login
    toast.dismiss(LOGIN_SUCCESS_TOAST_ID);

    toast.custom(
      (t) => (
        <div className={`toast-exito-personalizado ${t.visible ? "toast-enter" : "toast-exit"}`}>
          <div className="toast-exito-icon">
            <FaCheckCircle />
          </div>
          <div className="toast-exito-contenido">
            <div className="toast-exito-titulo">{mensaje}</div>
          </div>
        </div>
      ),
      {
        id: LOGIN_SUCCESS_TOAST_ID,
        duration: 2000,
        position: "top-center",
      }
    );
  };

  // Toast de error (exactamente igual al del Home)
  const mostrarToastError = (mensaje) => {
    toast.custom((t) => (
      <div className={`toast-advertencia-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
        <FaExclamationTriangle className="toast-advertencia-icon" />
        <div className="toast-advertencia-contenido">
          <div className="toast-advertencia-titulo">{mensaje}</div>
          <div className="toast-advertencia-footer">
            <FaClock className="toast-advertencia-time-icon" />
            <span className="toast-advertencia-time">Verifica tus datos</span>
          </div>
        </div>
        <button onClick={() => toast.dismiss(t.id)} className="toast-advertencia-cerrar">
          <FaTimes />
        </button>
      </div>
    ), {
      duration: 3000,
      position: 'top-center',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!correo || !contrasena) {
      mostrarToastError("Por favor completa todos los campos");
      return;
    }

    if (!correo.includes("@") || !correo.includes(".")) {
      mostrarToastError("El correo no tiene un formato válido");
      return;
    }

    if (contrasena.length < 6) {
      mostrarToastError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    const stored = localStorage.getItem("usuarios");
    const usuarios = stored ? JSON.parse(stored) : usuariosBase;

    const encontrado = usuarios.find(
      (u) =>
        u.correo.toLowerCase() === correo.toLowerCase() &&
        u.contrasena === contrasena
    );

    if (!encontrado) {
      mostrarToastError("Correo o contraseña incorrectos");
      return;
    }

    // Guardar en localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", JSON.stringify(encontrado));

    // Mostrar toast de éxito (IGUAL al del Home)
    mostrarToastExito("¡Sesión iniciada correctamente!");

    // Redirigir después del toast
    setTimeout(() => {
      navigate("/home");
    }, 1500);
  };

  return (
    <div className="auth">
      <div className="auth__card auth__card--form">
        <div className="auth__header">
          <button
            type="button"
            className="auth__back-button"
            onClick={() => navigate("/auth")}
          >
            ←
          </button>
          <span className="auth__header-title">Login</span>
        </div>

        <h2 className="auth__form-title">¡Bienvenido!</h2>
        <p className="auth__form-subtitle">Inicia sesión en tu cuenta</p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">
            Correo
            <input
              className="auth__input"
              type="email"
              placeholder="correo@mail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>

          <label className="auth__label">
            Contraseña
            <input
              className="auth__input"
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </label>

          <button className="auth__button auth__button--primary" type="submit">
            Iniciar Sesión
          </button>
        </form>

        <button
          type="button"
          className="auth__link-button auth__link-button--small"
          onClick={() => navigate("/auth/recuperar-sms")}
        >
          Olvidé Contraseña
        </button>
      </div>
    </div>
  );
};

export default Login;