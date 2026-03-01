import { useNavigate } from "react-router-dom";

const Registro = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth">
      <div className="auth__card auth__card--form">
        <h2 className="auth__form-title">Crea una cuenta</h2>
        <p className="auth__form-subtitle">
          Ingresa los datos de tu cuenta o{" "}
          <button
            type="button"
            className="auth__link-button"
            onClick={() => navigate("/auth/login")}
          >
            inicia sesión
          </button>
        </p>

        <form className="auth__form" onSubmit={handleSubmit}>
          <label className="auth__label">
            Nombre Completo
            <input
              className="auth__input"
              type="text"
              placeholder="Nombre completo"
            />
          </label>

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

          <label className="auth__label">
            Fecha de nacimiento
            <input className="auth__input" type="date" />
          </label>

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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registro;

