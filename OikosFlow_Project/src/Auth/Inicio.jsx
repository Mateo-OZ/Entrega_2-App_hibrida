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
      <div className="auth__card auth__card--inicio">
        <div className="auth__brand">
          <div className="auth__image">
            <img src="/images/glass-wall.jpeg" alt="OikosFlow" />
          </div>
          <div className="auth__logo-circle">
            <img src="/images/logo-oikosflow.png" alt="Logo OikosFlow" />
          </div>
        </div>

        <h1 className="auth__title">OikosFlow</h1>
        <p className="auth__subtitle">Tu hogar, tu equipo, tu tarea</p>
        <p className="auth__form-subtitle auth__form-subtitle--muted">
          Organiza las tareas, comparte responsabilidades y mantén todo bajo control.
        </p>

        <div className="auth__highlights">
          <div className="auth__highlight-pill">✔ Tareas compartidas</div>
          <div className="auth__highlight-pill">✔ Historial claro</div>
          <div className="auth__highlight-pill">✔ Recordatorios rápidos</div>
        </div>

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

