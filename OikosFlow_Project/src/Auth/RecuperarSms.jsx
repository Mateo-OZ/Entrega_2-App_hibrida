import { useNavigate } from "react-router-dom";

const RecuperarSms = () => {
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
        <p className="auth__form-subtitle">Verificación por SMS</p>
        <p className="auth__form-subtitle">
          Ingresa tu número de teléfono asociado a la cuenta
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">
            Teléfono
            <div className="auth__phone-row">
              <span className="auth__phone-prefix">+57</span>
              <input
                className="auth__input"
                type="tel"
                placeholder="Número"
              />
            </div>
          </label>

          <button
            type="button"
            className="auth__button auth__button--secondary"
            onClick={() => navigate("/auth/recuperar-correo")}
          >
            Recuperar por Gmail
          </button>

          <button className="auth__button auth__button--primary" type="submit">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarSms;

