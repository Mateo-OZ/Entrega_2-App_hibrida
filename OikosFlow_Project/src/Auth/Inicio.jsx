import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { FaPalette } from "react-icons/fa";

const DARK_THEMES = ["dark-green", "dark-orange", "dark-blue"];

const Inicio = () => {
  const navigate = useNavigate();
  const { theme, cycleTheme } = useTheme();
  const isDark = DARK_THEMES.includes(theme);
  const glassWallSrc = isDark ? "/images/glass-wall-dark.jpeg" : "/images/glass-wall.jpeg";

  useEffect(() => {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    if (usuarioActivo) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__brand">
          <div className="auth__image">
            <img key={glassWallSrc} src={glassWallSrc} alt="OikosFlow" />
          </div>
          <div className="auth__logo-circle">
            <img src="/images/logo-oikosflow.png" alt="Logo OikosFlow" />
          </div>
        </div>

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

      <button
        type="button"
        className="auth__theme-toggle"
        onClick={cycleTheme}
        aria-label="Cambiar tema"
        title="Cambiar tema (color y modo claro/oscuro)"
      >
        <FaPalette />
      </button>
    </div>
  );
};

export default Inicio;

