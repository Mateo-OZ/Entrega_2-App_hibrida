import { useState, useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { FaHome, FaTasks, FaHistory, FaUser, FaCheckCircle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import tareasData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import "../Tarea/tarea.scss";

const Tareas = () => {
    const navigate = useNavigate();
    const tareasPorPagina = 10;

    // Estados
    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.getItem("tareas");
        return saved ? JSON.parse(saved) : tareasData;
    });

    const [usuarios, setUsuarios] = useState(() => {
        const saved = localStorage.getItem("usuarios");
        return saved ? JSON.parse(saved) : usuariosData;
    });

    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");
    const [paginaActual, setPaginaActual] = useState(1);
    const [modoVista, setModoVista] = useState("mis"); // "mis" o "todas"
    const [showModal, setShowModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [nuevoTrabajo, setNuevoTrabajo] = useState("");
    const [encargadoSeleccionado, setEncargadoSeleccionado] = useState("");
    const [estadoSeleccionado, setEstadoSeleccionado] = useState("Pendiente");

    // Efectos para guardar en localStorage
    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    useEffect(() => {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }, [usuarios]);

    // Obtener usuario actual
    const getCurrentUser = () => {
        const storedUser = localStorage.getItem("usuarioActivo");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                return parsed.nombre_completo || "Invitado";
            } catch {
                console.error("usuarioActivo inválido");
            }
        }
        return "Invitado";
    };

    const usuarioActivo = getCurrentUser();

    // Obtener ID del usuario actual
    const getCurrentUserId = () => {
        const usuario = usuarios.find(u => u.nombre_completo === usuarioActivo);
        return usuario ? usuario.id : null;
    };

    const currentUserId = getCurrentUserId();

    // Funciones de utilidad
    const getNombreUsuario = (id_usuario) => {
        const usuario = usuarios.find(u => u.id === id_usuario);
        return usuario ? usuario.nombre_completo : "Usuario no encontrado";
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Pendiente":
                return "estado-pendiente";
            case "En Proceso":
                return "estado-proceso";
            case "Completado":
                return "estado-completado";
            default:
                return "estado-pendiente";
        }
    };

    // Obtener categorías únicas
    const categoriasUnicas = ["Todas", ...new Set(tareas.map(t => t.version).filter(Boolean))];

    // Filtrar tareas por categoría y modo de vista (excluyendo Completadas)
    const tareasActivas = tareas.filter(t => t.estado !== "Completado");

    const tareasFiltradasPorCategoria = categoriaSeleccionada === "Todas"
        ? tareasActivas
        : tareasActivas.filter(t => t.version === categoriaSeleccionada);

    const tareasFiltradas = modoVista === "mis" && currentUserId
        ? tareasFiltradasPorCategoria.filter(t => t.id_usuario === currentUserId)
        : tareasFiltradasPorCategoria;

    // Calcular paginación
    const indexUltimaTarea = paginaActual * tareasPorPagina;
    const indexPrimeraTarea = indexUltimaTarea - tareasPorPagina;
    const tareasPaginadas = tareasFiltradas.slice(indexPrimeraTarea, indexUltimaTarea);
    const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);

    // Manejadores de eventos
    const handlePageChange = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (e) => {
        setCategoriaSeleccionada(e.target.value);
        setPaginaActual(1);
    };

    const handleModoVistaChange = (modo) => {
        setModoVista(modo);
        setPaginaActual(1);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNuevoTrabajo("");
        setEncargadoSeleccionado("");
        setEstadoSeleccionado("Pendiente");
    };

    const handleAddTask = (e) => {
        e.preventDefault();
        if (!nuevoTrabajo.trim()) {
            toast.error("La tarea no puede estar vacía");
            return;
        }

        if (!encargadoSeleccionado) {
            toast.error("Debes seleccionar un encargado");
            return;
        }

        const ultimoId = tareas.length > 0 ? Math.max(...tareas.map((t) => t.id)) : 0;

        const nuevaTarea = {
            id: ultimoId + 1,
            id_usuario: parseInt(encargadoSeleccionado),
            trabajo_a_realizar: nuevoTrabajo,
            estado: estadoSeleccionado,
            version: categoriaSeleccionada === "Todas" ? "General" : categoriaSeleccionada
        };

        setTareas([...tareas, nuevaTarea]);

        // Crear notificación para el usuario asignado
        if (encargadoSeleccionado === currentUserId?.toString()) {
            const storedNoti = localStorage.getItem("notificaciones");
            const notificaciones = storedNoti ? JSON.parse(storedNoti) : [];

            const nuevaNotificacion = {
                id: Date.now(),
                mensaje: `Te han asignado una tarea: ${nuevaTarea.trabajo_a_realizar}`,
                fecha: new Date().toISOString(),
                leida: false
            };

            localStorage.setItem(
                "notificaciones",
                JSON.stringify([nuevaNotificacion, ...notificaciones])
            );
        }

        toast.success("Tarea añadida correctamente");
        handleCloseModal();
    };

    // Funciones para completar tarea
    const handleOpenCompleteModal = (tarea) => {
        setTareaSeleccionada(tarea);
        setEstadoSeleccionado(tarea.estado);
        setShowCompleteModal(true);
    };

    const handleCloseCompleteModal = () => {
        setShowCompleteModal(false);
        setTareaSeleccionada(null);
        setEstadoSeleccionado("Pendiente");
    };

    const handleUpdateTaskStatus = (e) => {
        e.preventDefault();

        if (!tareaSeleccionada) return;

        const tareasActualizadas = tareas.map(t =>
            t.id === tareaSeleccionada.id
                ? { ...t, estado: estadoSeleccionado }
                : t
        );

        setTareas(tareasActualizadas);

        // Si la tarea se completó, crear notificación
        if (estadoSeleccionado === "Completado") {
            const storedNoti = localStorage.getItem("notificaciones");
            const notificaciones = storedNoti ? JSON.parse(storedNoti) : [];

            const nuevaNotificacion = {
                id: Date.now(),
                mensaje: `La tarea "${tareaSeleccionada.trabajo_a_realizar}" ha sido completada`,
                fecha: new Date().toISOString(),
                leida: false
            };

            localStorage.setItem(
                "notificaciones",
                JSON.stringify([nuevaNotificacion, ...notificaciones])
            );

            toast.success("¡Tarea completada! 🎉");
        } else {
            toast.success(`Estado actualizado a: ${estadoSeleccionado}`);
        }

        handleCloseCompleteModal();
    };

    return (
        <div className="tareas">
            {/* Header */}
            <header className="tareas__header">
                <h1 className="tareas__title">OikosFlow</h1>
                <div className="tareas__top">
                    <div>
                        <h2>Hola, {usuarioActivo}.</h2>
                        <p>Gestión de Tareas</p>
                    </div>
                    <div className="tareas__icons">
                        <FaBell onClick={() => navigate("/notificaciones")} />
                        <FaUserCircle onClick={() => navigate("/perfil")} />
                    </div>
                </div>
            </header>

            {/* Filtros */}
            <div className="tareas__filtros-container">
                {/* Filtro de modo (Mis tareas / Todas) */}
                <div className="tareas__modo-filtro">
                    <button
                        className={modoVista === "mis" ? "active" : ""}
                        onClick={() => handleModoVistaChange("mis")}
                    >
                        Mis tareas
                    </button>
                    <button
                        className={modoVista === "todas" ? "active" : ""}
                        onClick={() => handleModoVistaChange("todas")}
                    >
                        Todas las tareas
                    </button>
                </div>

                {/* Filtro por categoría */}
                <div className="tareas__filtros">
                    <label htmlFor="categoria">Filtrar por: </label>
                    <select
                        id="categoria"
                        value={categoriaSeleccionada}
                        onChange={handleCategoryChange}
                        className="filtro-select"
                    >
                        {categoriasUnicas.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    <span className="resultados-count">
                        {tareasFiltradas.length} tareas activas • Página {paginaActual} de {totalPaginas || 1}
                    </span>
                </div>
            </div>

            {/* Indicador de scroll horizontal para móviles */}
            <div className="scroll-hint">
                <span>← Desliza para ver más →</span>
            </div>

            {/* Tabla */}
            <section className="tareas__table">
                <div className="table__header">
                    <span>#</span>
                    <span>Encargado</span>
                    <span>Tarea</span>
                    <span>Estado</span>
                    <span>Categoría</span>
                    <span>Acciones</span> {/* Esto ahora se verá completo */}
                </div>

                {tareasPaginadas.map((tarea) => (
                    <div className="table__row" key={tarea.id}>
                        <span>{tarea.id}</span>
                        <span>{getNombreUsuario(tarea.id_usuario)}</span>
                        <span>{tarea.trabajo_a_realizar}</span>
                        <span className={getStatusClass(tarea.estado)}>
                            {tarea.estado}
                        </span>
                        <span>{tarea.version || "General"}</span>
                        <span>
                            <button
                                className="btn-completar"
                                onClick={() => handleOpenCompleteModal(tarea)}
                                title="Cambiar estado"
                            >
                                <FaCheckCircle />
                            </button>
                        </span>
                    </div>
                ))}

                {tareasFiltradas.length === 0 && (
                    <div className="table__empty">
                        No hay tareas activas {modoVista === "mis" ? "asignadas a ti" : "en esta categoría"}
                    </div>
                )}
            </section>

            {/* Botón Añadir Tarea */}
            <button className="btn-add tareas__add-btn" onClick={() => setShowModal(true)}>
                + Añadir Tarea
            </button>

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="tareas__paginacion">
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
                                className={`paginacion-numero ${paginaActual === num ? 'activo' : ''}`}
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

            {/* Barra de navegación inferior fija */}
            <nav className="tareas__bottom-nav">
                <NavLink to="/home" end className={({ isActive }) => isActive ? "active" : ""}>
                    <FaHome />
                    <span>Home</span>
                </NavLink>
                <NavLink to="/tareas" className={({ isActive }) => isActive ? "active" : ""}>
                    <FaTasks />
                    <span>Tareas</span>
                </NavLink>
                <NavLink to="/historial" className={({ isActive }) => isActive ? "active" : ""}>
                    <FaHistory />
                    <span>Historial</span>
                </NavLink>
                <NavLink to="/perfil" className={({ isActive }) => isActive ? "active" : ""}>
                    <FaUser />
                    <span>Perfil</span>
                </NavLink>
            </nav>

            {/* Modal para añadir tarea */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2 className="modal-title">Añadir Tarea</h2>

                        <form onSubmit={handleAddTask} className="modal-form">
                            <div className="form-group">
                                <label>Encargado</label>
                                <select
                                    value={encargadoSeleccionado}
                                    onChange={(e) => setEncargadoSeleccionado(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccionar encargado</option>
                                    {usuarios.map((usuario) => (
                                        <option key={usuario.id} value={usuario.id}>
                                            {usuario.nombre_completo}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Tarea</label>
                                <input
                                    type="text"
                                    value={nuevoTrabajo}
                                    onChange={(e) => setNuevoTrabajo(e.target.value)}
                                    placeholder="Descripción de la tarea"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    value={estadoSeleccionado}
                                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                                >
                                    <option>Pendiente</option>
                                    <option>En Proceso</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Categoría</label>
                                <select
                                    value={categoriaSeleccionada}
                                    onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                                >
                                    {categoriasUnicas.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
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

            {/* Modal para completar/actualizar tarea */}
            {showCompleteModal && tareaSeleccionada && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2 className="modal-title">Actualizar Estado</h2>
                        <p className="modal-subtitle">{tareaSeleccionada.trabajo_a_realizar}</p>

                        <form onSubmit={handleUpdateTaskStatus} className="modal-form">
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    value={estadoSeleccionado}
                                    onChange={(e) => setEstadoSeleccionado(e.target.value)}
                                >
                                    <option>Pendiente</option>
                                    <option>En Proceso</option>
                                    <option>Completado</option>
                                </select>
                            </div>

                            <div className="modal-buttons">
                                <button type="button" className="btn-cancel" onClick={handleCloseCompleteModal}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-add-task">
                                    Actualizar
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