import { useState, useEffect } from "react";
import tareasData from "../data/tareas_datos.json";
import "../Tarea/tarea.scss";
import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";

const Tareas = () => {
    const usuarioActivo =
        localStorage.getItem("usuarioActivo") || "Tiago";

    // ✅ CORREGIDO
    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.getItem("tareas");
        return saved ? JSON.parse(saved) : tareasData;
    });

    const [showModal, setShowModal] = useState(false);
    const [nuevoTrabajo, setNuevoTrabajo] = useState("");
    const [encargadoSeleccionado, setEncargadoSeleccionado] =
        useState(usuarioActivo);
    const [estadoSeleccionado, setEstadoSeleccionado] =
        useState("Activo");
    const [modoVista, setModoVista] = useState("mis");

    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    const handleCloseModal = () => {
        setShowModal(false);
        setNuevoTrabajo("");
        setEncargadoSeleccionado(usuarioActivo);
        setEstadoSeleccionado("Activo");
    };

    // ✅ FILTRO CORRECTO
    const tareasFiltradas =
        modoVista === "mis"
            ? tareas.filter(
                (t) =>
                    t.nombre_encargado
                        .trim()
                        .toLowerCase() === usuarioActivo.toLowerCase()
            )
            : tareas;

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!nuevoTrabajo.trim()) return;

        const ultimoId =
            tareas.length > 0
                ? Math.max(...tareas.map((t) => t.id))
                : 0;

        const nuevaTarea = {
            id: ultimoId + 1,
            nombre_encargado: encargadoSeleccionado,
            trabajo_a_realizar: nuevoTrabajo,
            estado: estadoSeleccionado
        };

        setTareas([...tareas, nuevaTarea]);
        setShowModal(false);
        setNuevoTrabajo("");
    };

    return (
        <div className="tareas">

            <h1 className="tareas__title">OikosFlow</h1>

            {/* ✅ TÍTULO DINÁMICO */}
            <h2 className="tareas__subtitle">
                {modoVista === "mis"
                    ? `Tareas de ${usuarioActivo}`
                    : "Tareas del Hogar"}
            </h2>

            <div className="tareas__filtro">
                <button
                    className={modoVista === "mis" ? "active" : ""}
                    onClick={() => setModoVista("mis")}
                >
                    Mis tareas
                </button>

                <button
                    className={modoVista === "todas" ? "active" : ""}
                    onClick={() => setModoVista("todas")}
                >
                    Tareas del hogar
                </button>
            </div>

            <div className="tareas__table">
                <div className="table__header">
                    <span>#</span>
                    <span>Nombre Encargado</span>
                    <span>Trabajo a Realizar</span>
                    <span>Estado</span>
                </div>

                {/* ✅ USANDO EL FILTRO CORRECTO */}
                {tareasFiltradas.map((tarea) => (
                    <div className="table__row" key={tarea.id}>
                        <span>{tarea.id}</span>
                        <span>{tarea.nombre_encargado}</span>
                        <span>{tarea.trabajo_a_realizar}</span>
                        <span className={`estado ${tarea.estado.toLowerCase()}`}>
                            {tarea.estado}
                        </span>
                    </div>
                ))}
            </div>

            <button className="btn-add" onClick={() => setShowModal(true)}>
                Añadir Tarea
            </button>

            <nav className="bottom-nav">
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

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">

                        <h2 className="modal-title">Añadir Tarea</h2>

                        <form onSubmit={handleAddTask} className="modal-form">

                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <select
                                    value={encargadoSeleccionado}
                                    onChange={(e) => setEncargadoSeleccionado(e.target.value)}
                                >
                                    {[
                                        "Tiago", "Darlene", "Ronald", "Jerome", "Robert",
                                        "Bessie", "Mark", "Angela", "John", "Laura",
                                        "Pedro", "Sofia", "Daniel"
                                    ].map((nombre) => (
                                        <option key={nombre}>{nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Tarea</label>
                                <input
                                    type="text"
                                    value={nuevoTrabajo}
                                    onChange={(e) => setNuevoTrabajo(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    value={estadoSeleccionado}
                                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                                >
                                    <option>Activo</option>
                                    <option>Inactivo</option>
                                    <option>Deshabilitado</option>
                                </select>
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
                                    Añadir
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tareas;