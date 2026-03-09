import { useState, useEffect } from "react";
import historialData from "../data/datos_tareas_unificados.json";
import "./historial.scss";
import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";

const Historial = () => {

  const tareasPorPagina = 10;

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("historial");
    return saved ? JSON.parse(saved) : historialData;
  });

  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

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

  // ===== PAGINACIÓN =====
  const indexUltimo = paginaActual * tareasPorPagina;
  const indexPrimero = indexUltimo - tareasPorPagina;
  const membersPaginados = members.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(members.length / tareasPorPagina);

  const handlePageChange = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== BÚSQUEDA =====
  const handleSearch = (e) => {
    e.preventDefault();

    const filtrados = historialData.filter((member) =>
      member.nombre_encargado
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );

    setMembers(filtrados);
    setPaginaActual(1);
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

        {membersPaginados.map((member) => (
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

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="historial__paginacion">

          <button
            onClick={() => handlePageChange(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="paginacion-btn"
          >
            ← Anterior
          </button>

          <div className="paginacion-numeros">
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`paginacion-numero ${paginaActual === num ? "activo" : ""}`}
              >
                {num}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="paginacion-btn"
          >
            Siguiente →
          </button>

        </div>
      )}

      {/* CONTROLES */}
      <div className="historial__controls">

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