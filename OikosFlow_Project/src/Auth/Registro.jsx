import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import usuariosBase from "../Data/usuarios_datos.json";

const Registro = () => {
  const navigate = useNavigate();

  const [nombreCompleto, setNombreCompleto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombreCompleto || !telefono || !fechaNacimiento || !correo || !contrasena) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const stored = localStorage.getItem("usuarios");
    const usuarios = stored ? JSON.parse(stored) : usuariosBase;

    const existe = usuarios.some((u) => u.correo.toLowerCase() === correo.toLowerCase());
    if (existe) {
      toast.error("Ya existe un usuario con este correo");
      return;
    }

    const ultimoId = usuarios.length > 0 ? Math.max(...usuarios.map((u) => u.id)) : 0;

    const nuevoUsuario = {
      id: ultimoId + 1,
      nombre_completo: nombreCompleto,
      telefono: telefono,
      fecha_nacimiento: fechaNacimiento,
      correo,
      contrasena,
    };

    const actualizados = [...usuarios, nuevoUsuario];
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    localStorage.setItem("usuarioActivo", nombreCompleto);

    toast.success("Cuenta creada correctamente");
    navigate("/auth/login");
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
          <span className="auth__header-title">Registro</span>
        </div>

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
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
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
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>
          </label>

          <label className="auth__label">
            Fecha de nacimiento
            <input
              className="auth__input"
              type="text"
              placeholder="MM / DD / YYYY"
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
            />
          </label>

          <label className="auth__label">
            Correo
            <input
              className="auth__input"
              type="email"
              placeholder="correo@mail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
          </label>

          <label className="auth__label">
            Contraseña
            <input
              className="auth__input"
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
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

