import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Inicio = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    if (usuarioActivo) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__image" />

        <div className="auth__logo-circle" />

        <h1 className="auth__title">OikosFlow</h1>
        <p className="auth__subtitle">Tu hogar, tu equipo, tu tarea</p>

        <div className="auth__actions">
          <button
            className="auth__button auth__button--primary"
            onClick={() => navigate("/auth/registro")}
          >
            Registro
          </button>
          <button
            className="auth__button auth__button--secondary"
            onClick={() => navigate("/auth/login")}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inicio;

