import { useState, useEffect } from "react";
import "./perfil.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import profileImage from "../Data/profile.jpg";

const Perfil = () => {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre_completo: "",
    telefono: "",
    fecha_nacimiento: "",
    correo: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("usuarioActivo");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUsuario({
          nombre_completo: parsed.nombre_completo || "",
          telefono: parsed.telefono || "",
          fecha_nacimiento: parsed.fecha_nacimiento || "",
          correo: parsed.correo || ""
        });
      } catch (error) {
        console.error("Error leyendo usuarioActivo:", error);
      }
    }
  }, []);

  return (
    <div className="perfil">

      <h1 className="perfil__title">OikosFlow</h1>

      {/* Imagen */}
      <div className="perfil__image">
        <img src={profileImage} alt="Perfil" />
      </div>

      {/* Campos */}
      <div className="perfil__form">

        <div className="form-group">
          <label>Nombre Completo</label>
          <input type="text" value={usuario.nombre_completo} readOnly />
        </div>

        <div className="form-group">
          <label>Telefono</label>
          <input type="text" value={usuario.telefono} readOnly />
        </div>

        <div className="form-group">
          <label>Fecha Nacimiento</label>
          <input type="text" value={usuario.fecha_nacimiento} readOnly />
        </div>

        <div className="form-group">
          <label>Correo</label>
          <input type="text" value={usuario.correo} readOnly />
        </div>

      </div>

      {/* BOTONES */}
      <div className="perfil__edit">
        <button 
          className="btn btn-add"
        >
          Editar
        </button>
      </div>

      <div className="perfil__actions">
        <button 
          className="btn btn-add"
          onClick={() => navigate("/auth/recuperar-sms")}
        >
          Cambiar <br /> Contraseña
        </button>

        <button 
          className="btn btn-add"
          onClick={() => {
            localStorage.removeItem("usuarioActivo");
            navigate("/auth");
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      {/* BOTTOM NAV */}
      <nav className="perfil__bottom-nav">
        <NavLink to="/home">
          <FaHome />
          <span>Home</span>
        </NavLink>

        <NavLink to="/tareas">
          <FaTasks />
          <span>Tareas</span>
        </NavLink>

        <NavLink to="/historial">
          <FaHistory />
          <span>Historial</span>
        </NavLink>

        <NavLink to="/perfil">
          <FaUser />
          <span>Perfil</span>
        </NavLink>
      </nav>

    </div>
  );
};

export default Perfil;