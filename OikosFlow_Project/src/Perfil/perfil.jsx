import { useState, useEffect } from "react";
import "./perfil.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import profileImage from "../Data/profile.jpg";
import usuariosBase from "../Data/usuarios.json";

const Perfil = () => {

  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nombre_completo: "",
    telefono: "",
    fecha_nacimiento: "",
    correo: ""
  });

  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    fecha_nacimiento: "",
    correo: ""
  });

  // Carga el usuarioActivo desde localStorage y lo asigna al estado
  useEffect(() => {
    const stored = localStorage.getItem("usuarioActivo");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Actualiza el usuario mostrado
        setUsuario({
          nombre_completo: parsed.nombre_completo || "",
          telefono: parsed.telefono || "",
          fecha_nacimiento: parsed.fecha_nacimiento || "",
          correo: parsed.correo || ""
        });

        setFormData(parsed);
      } catch (error) {
        console.error("Error leyendo usuarioActivo:", error);
      }
    }
  }, []);

  // Actualiza usuario, tareas, historial y miembros en localStorage
  const handleEdit = (e) => {
    e.preventDefault();

    const nombreAnterior = usuario.nombre_completo;
    const nombreNuevo = formData.nombre_completo;

    const stored = localStorage.getItem("usuarios");
    const usuarios = stored ? JSON.parse(stored) : usuariosBase;

    const actualizados = usuarios.map((u) =>
      u.correo === usuario.correo ? { ...u, ...formData } : u
    );

    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    localStorage.setItem("usuarioActivo", JSON.stringify(formData));

    // Actualiza en las tareas el nombre del usuario
    const tareasStored = localStorage.getItem("tareas");
    if (tareasStored) {
      const tareas = JSON.parse(tareasStored);
      const tareasActualizadas = tareas.map((t) =>
        t.nombre_encargado === nombreAnterior
          ? { ...t, nombre_encargado: nombreNuevo }
          : t
      );
      localStorage.setItem("tareas", JSON.stringify(tareasActualizadas));
    }

    // actualiza en historial el nombre del usuario
    const historialStored = localStorage.getItem("historial");
    if (historialStored) {
      const historial = JSON.parse(historialStored);
      const historialActualizado = historial.map((h) =>
        h.nombre_encargado === nombreAnterior
          ? { ...h, nombre_encargado: nombreNuevo }
          : h
      );
      localStorage.setItem("historial", JSON.stringify(historialActualizado));
    }

    // Actualizar en home los nommbres de los miembros
    const membersStored = localStorage.getItem("members");
    if (membersStored) {
      const members = JSON.parse(membersStored);
      const membersActualizados = members.map((m) =>
        m.nombre_encargado === nombreAnterior
          ? { ...m, nombre_encargado: nombreNuevo }
          : m
      );
      localStorage.setItem("members", JSON.stringify(membersActualizados));
    }
    // Actualiza el estado y cierra el modal
    setUsuario(formData);
    setShowModal(false);
  };

  // Cierra el modal de edición sin hacer cambios
  const handleCloseModal = () => {
    setShowModal(false);
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

        {/* Inputs en modo para que el usuario solo pueda ver la información sin editar */}
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
          onClick={() => setShowModal(true)}
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
            //borra el usuario activo del local storage
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

      {/* MODAL EDITAR */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h2 className="modal-title">Editar Perfil</h2>

            <form onSubmit={handleEdit} className="modal-form">

              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={formData.nombre_completo}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre_completo: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Telefono</label>
                <input
                  type="text"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label>Fecha Nacimiento</label>
                <input
                  type="text"
                  value={formData.fecha_nacimiento}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_nacimiento: e.target.value })
                  }
                />
              </div>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn-add-task">
                  Guardar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default Perfil;