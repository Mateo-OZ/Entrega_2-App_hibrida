import { useState, useEffect } from "react";
import historialData from "../Data/historial_datos.json";
import "./historial.scss";
import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";

const Historial = () => {

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("historial");
    return saved ? JSON.parse(saved) : historialData;
  });

  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");

  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(members));
  }, [members]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Activo":
        return "Estado Activo";
      case "Inactivo":
        return "Estado Inactivo";
      case "Deshabilitado":
        return "Estado Deshabilitado";
      default:
        return "";
    }
  };

  const handleToggleView = () => {
    if (visibleCount >= members.length) {
      setVisibleCount(6);
    } else {
      setVisibleCount(members.length);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const filtrados = historialData.filter((member) =>
      member.nombre_encargado
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );

    setMembers(filtrados);
    setShowModal(false);
    setBusqueda("");
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setBusqueda("");
  };

  return (
    <div className="historial">

      <h1 className="historial__title">OikosFlow</h1>

      <section className="historial__table">
        <div className="table__header">
          <span>#</span>
          <span>Nombre Encargado</span>
          <span>Trabajo a Realizar</span>
          <span>Estado</span>
        </div>

        {members.slice(0, visibleCount).map((member) => (
          <div className="table__row" key={member.id}>
            <span>{member.id}</span>
            <span>{member.nombre_encargado}</span>
            <span>{member.trabajo_a_realizar}</span>
            <span className={getStatusClass(member.estado)}>
              {member.estado}
            </span>
          </div>
        ))}
      </section>

      {/* CONTROLES */}
      <div className="historial__controls">

        <div className="historial__more">
          {members.length > 6 && (
            <button onClick={handleToggleView}>
              {visibleCount >= members.length
                ? "Ver Menos..."
                : "Ver Más..."}
            </button>
          )}
        </div>

        <button
          className="btn btn-add"
          onClick={() => setShowModal(true)}
        >
          Buscar
        </button>

      </div>

      {/* BOTTOM NAV */}
      <nav className="historial__bottom-nav">
        <NavLink to="/home" end>
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

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h2 className="modal-title">Buscar Encargado</h2>

            <form onSubmit={handleSearch} className="modal-form">

              <div className="form-group">
                <label>Nombre</label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: Tiago"
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
                  Buscar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Historial;