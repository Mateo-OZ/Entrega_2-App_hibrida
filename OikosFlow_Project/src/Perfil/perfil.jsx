import "./perfil.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import profileImage from "../Data/profile.jpg";

const Perfil = () => {

  const navigate = useNavigate();

  const usuario = {
    nombre: "Juan Pérez",
    telefono: "+57 3001234567",
    fechaNacimiento: "10/05/1998",
    correo: "juan@email.com"
  };

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
          <input type="text" value={usuario.nombre} readOnly />
        </div>

        <div className="form-group">
          <label>Telefono</label>
          <input type="text" value={usuario.telefono} readOnly />
        </div>

        <div className="form-group">
          <label>Fecha Nacimiento</label>
          <input type="text" value={usuario.fechaNacimiento} readOnly />
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
          onClick={() => navigate("/editar-perfil")}
        >
          Editar
        </button>
      </div>

      <div className="perfil__actions">
        <button 
          className="btn btn-add"
          onClick={() => navigate("/cambiar-contrasena-correo")}
        >
          Cambiar <br /> Contraseña
        </button>

        <button 
          className="btn btn-add"
          onClick={() => navigate("/login")}
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