import { useNavigate } from "react-router-dom";

const RecuperarCorreo = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth">
      <div className="auth__card auth__card--form">
        <button
          type="button"
          className="auth__back-button"
          onClick={() => navigate("/auth/login")}
        >
          ←
        </button>

        <h2 className="auth__form-title">Recuperar Contraseña</h2>
        <p className="auth__form-subtitle">Verificación por Gmail</p>
        <p className="auth__form-subtitle">Ingresa tu correo electrónico</p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">
            Correo
            <input
              className="auth__input"
              type="email"
              placeholder="correo@mail.com"
            />
          </label>

          <button
            type="button"
            className="auth__button auth__button--secondary"
            onClick={() => navigate("/auth/recuperar-sms")}
          >
            Recuperar por SMS
          </button>

          <button className="auth__button auth__button--primary" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarCorreo;

