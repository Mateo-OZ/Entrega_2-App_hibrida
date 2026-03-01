import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Sesión iniciada correctamente.");
    navigate("/home");
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
            />
          </label>

          <label className="auth__label">
            Contraseña
            <input
              className="auth__input"
              type="password"
              placeholder="••••••••"
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

