import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth">
      <div className="auth__card auth__card--form">
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

