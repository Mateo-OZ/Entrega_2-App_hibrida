import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RecuperarSms = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Te hemos enviado un SMS con instrucciones para recuperar tu contraseña.");
  };

  return (
    <div className="auth">
      <div className="auth__card auth__card--form">
        <div className="auth__header">
          <button
            type="button"
            className="auth__back-button"
            onClick={() => navigate("/auth/login")}
          >
            ←
          </button>
          <span className="auth__header-title">Recuperar</span>
        </div>

        <h2 className="auth__form-title">Recuperar Contraseña</h2>
        <p className="auth__form-subtitle">Verificación por SMS</p>
        <p className="auth__form-subtitle auth__form-subtitle--muted">
          Ingresa tu número de teléfono asociado a la cuenta y recibirás un código.
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

          <button className="auth__button auth__button--primary" type="submit">
            Enviar SMS
          </button>
        </form>

        <div className="auth__form-footer">
          <span>¿Prefieres correo?</span>
          <button
            type="button"
            className="auth__link-button auth__link-button--small"
            onClick={() => navigate("/auth/recuperar-correo")}
          >
            Recuperar por Gmail
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSms;

