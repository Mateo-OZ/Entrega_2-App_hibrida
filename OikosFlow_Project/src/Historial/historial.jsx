import { useState, useEffect } from "react";
import historialData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import "./historial.scss";
import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";

const Historial = () => {

  const tareasPorPagina = 6;

  const [tareas, setTareas] = useState(() => {
    const saved = localStorage.getItem("tareas");
    return saved ? JSON.parse(saved) : historialData;
  });

  const [usuarios, setUsuarios] = useState(() => {
    const saved = localStorage.getItem("usuarios");
    return saved ? JSON.parse(saved) : usuariosData;
  });

  const [showModal, setShowModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    localStorage.setItem("tareas", JSON.stringify(tareas));
  }, [tareas]);

  useEffect(() => {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // ===== OBTENER NOMBRE DEL USUARIO =====
  const getNombreUsuario = (id_usuario) => {
    const usuario = usuarios.find(u => u.id === id_usuario);
    return usuario ? usuario.nombre_completo : "Usuario no encontrado";
  };

  const getStatusClass = (status) => {
    const statusMap = {
      "Pendiente": "estado-pendiente",
      "En Proceso": "estado-proceso",
      "Completado": "estado-completado"
    };

    return statusMap[status] || "estado-pendiente";
  };

  // ===== PAGINACIÓN =====
  const indexUltimo = paginaActual * tareasPorPagina;
  const indexPrimero = indexUltimo - tareasPorPagina;
  const tareasPaginadas = tareas.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(tareas.length / tareasPorPagina);

  const handlePageChange = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== BÚSQUEDA =====
  const handleSearch = (e) => {
    e.preventDefault();

    const filtrados = historialData.filter((tarea) =>
      tarea.trabajo_a_realizar
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );

    setTareas(filtrados);
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
          <span>Encargado</span>
          <span>Tarea</span>
          <span>Estado</span>
          <span>Categoría</span>
        </div>

        {tareasPaginadas.map((tarea) => (
          <div className="table__row" key={tarea.id}>
            <span>{getNombreUsuario(tarea.id_usuario)}</span>
            <span>{tarea.trabajo_a_realizar}</span>
            <span className={getStatusClass(tarea.estado)}>
              {tarea.estado}
            </span>
            <span>{tarea.version || "General"}</span>
          </div>
        ))}

        {tareas.length === 0 && (
          <div className="table__empty">
            No hay resultados
          </div>
        )}

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

            <h2 className="modal-title">Buscar Tarea</h2>

            <form onSubmit={handleSearch} className="modal-form">

              <div className="form-group">
                <label>Tarea</label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Ej: Limpiar"
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