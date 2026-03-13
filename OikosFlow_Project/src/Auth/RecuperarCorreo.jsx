import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const RecuperarCorreo = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Te hemos enviado un correo con instrucciones para recuperar tu contraseña.");
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
        <p className="auth__form-subtitle">Verificación por Gmail</p>
        <p className="auth__form-subtitle auth__form-subtitle--muted">
          Ingresa el correo asociado a tu cuenta y te enviaremos instrucciones.
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">
            Correo
            <input
              className="auth__input"
              type="email"
              placeholder="correo@mail.com"
            />
          </label>

          <button className="auth__button auth__button--primary" type="submit">
            Enviar correo
          </button>
        </form>

        <div className="auth__form-footer">
          <span>¿Prefieres SMS?</span>
          <button
            type="button"
            className="auth__link-button auth__link-button--small"
            onClick={() => navigate("/auth/recuperar-sms")}
          >
            Recuperar por SMS
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecuperarCorreo;

