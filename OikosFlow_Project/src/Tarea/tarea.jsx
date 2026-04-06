import { useState, useEffect } from "react";
import {
    FaBell, FaUserCircle, FaHome, FaTasks, FaHistory, FaUser,
    FaCheckCircle, FaExclamationTriangle, FaSpinner, FaTimes,
    FaClock, FaSyncAlt, FaStar,
    FaBroom, FaFileInvoice, FaShoppingCart, FaLeaf,
    FaWrench, FaBoxes, FaBed, FaQuestionCircle, FaClipboardList
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import tareasData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import "./tarea.scss";

const TareasPrueba = () => {
    const navigate = useNavigate();
    const tareasPorPagina = 6;

    // ===== ESTADOS =====
    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.getItem("tareas");
        return saved ? JSON.parse(saved) : tareasData;
    });

    const [usuarios, setUsuarios] = useState(() => {
        const saved = localStorage.getItem("usuarios");
        return saved ? JSON.parse(saved) : usuariosData;
    });

    const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
    const [paginaActual, setPaginaActual] = useState(1);
    const [modoVista, setModoVista] = useState("mis");
    const [showModal, setShowModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [tareaSeleccionada, setTareaSeleccionada] = useState(null);
    const [formData, setFormData] = useState({
        nuevoTrabajo: "",
        encargadoSeleccionado: "",
        estadoSeleccionado: "Pendiente",
        categoriaFormulario: "Todas"
    });

    // ===== EFECTOS =====
    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    useEffect(() => {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }, [usuarios]);

    // ===== FUNCIONES DE UTILIDAD =====
    const getCurrentUser = () => {
        const storedUser = localStorage.getItem("usuarioActivo");
        if (storedUser) {
            try {
                return JSON.parse(storedUser).nombre_completo || "Invitado";
            } catch {
                console.error("usuarioActivo inválido");
            }
        }
        return "Invitado";
    };

    const usuarioActivo = getCurrentUser();
    const currentUserId = usuarios.find(u => u.nombre_completo === usuarioActivo)?.id || null;

    const getNombreUsuario = (id) => usuarios.find(u => u.id === id)?.nombre_completo || "Usuario no encontrado";

    const getStatusClass = (status) => {
        const map = { "Pendiente": "estado-pendiente", "En Proceso": "estado-proceso", "Completado": "estado-completado" };
        return map[status] || "estado-pendiente";
    };

    // ===== AVATAR =====
    const getInitials = (nombre) => {
        if (!nombre || nombre === "Usuario no encontrado") return "?";
        const palabras = nombre.trim().split(" ");
        if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
        return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
    };

    const getAvatarColor = (nombre) => {
        const colores = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"];
        let hash = 0;
        for (let i = 0; i < nombre.length; i++) hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
        return colores[Math.abs(hash) % colores.length];
    };

    // ===== CATEGORÍA =====
    const getCategoryIcon = (categoria) => {
        const iconMap = {
            "Aseo": <FaBroom />, "Administración": <FaFileInvoice />, "Suministros": <FaShoppingCart />,
            "Jardinería": <FaLeaf />, "Mantenimiento": <FaWrench />, "Organización": <FaBoxes />,
            "Lencería": <FaBed />, "General": <FaClipboardList />
        };
        return iconMap[categoria] || <FaQuestionCircle />;
    };

    const getCategoryColor = (categoria) => {
        const colorMap = {
            "Aseo": "#4ECDC4", "Administración": "#45B7D1", "Suministros": "#96CEB4",
            "Jardinería": "#88D4AB", "Mantenimiento": "#FFA07A", "Organización": "#DDA0DD",
            "Lencería": "#F7DC6F", "General": "#BB8FCE"
        };
        return colorMap[categoria] || "#95A5A6";
    };

    // ===== PAGINACIÓN INTELIGENTE =====
    const getPaginationNumbers = (currentPage, totalPages) => {
        if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage, currentPage + 1, currentPage + 2, '...', totalPages];
    };

    // ===== FILTROS =====
    const categoriasUnicas = ["Todas", ...new Set(tareas.map(t => t.version).filter(Boolean))];
    const tareasActivas = tareas.filter(t => t.estado !== "Completado");
    const tareasFiltradasPorCategoria = categoriaFiltro === "Todas" ? tareasActivas : tareasActivas.filter(t => t.version === categoriaFiltro);
    const tareasFiltradas = modoVista === "mis" && currentUserId ? tareasFiltradasPorCategoria.filter(t => t.id_usuario === currentUserId) : tareasFiltradasPorCategoria;
    const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);
    const tareasPaginadas = tareasFiltradas.slice((paginaActual - 1) * tareasPorPagina, paginaActual * tareasPorPagina);

    // ===== VALIDACIONES =====
    const validarSoloTexto = (texto) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);

    // ===== TOASTS =====
    const mostrarToastExito = (mensaje) => {
        toast.custom((t) => (
            <div className={`toast-exito-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
                <FaCheckCircle className="toast-exito-icon" />
                <div className="toast-exito-contenido"><div className="toast-exito-titulo">{mensaje}</div></div>
            </div>
        ), { duration: 2000, position: 'top-center' });
    };

    const mostrarToastAdvertencia = (mensaje, errores = []) => {
        toast.custom((t) => (
            <div className={`toast-advertencia-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
                <FaExclamationTriangle className="toast-advertencia-icon" />
                <div className="toast-advertencia-contenido">
                    <div className="toast-advertencia-titulo">{mensaje}</div>
                    {errores.length > 0 && (
                        <div className="toast-advertencia-detalles">
                            {errores.map((error, idx) => <p key={idx}>• {error}</p>)}
                        </div>
                    )}
                    <div className="toast-advertencia-footer">
                        <FaClock className="toast-advertencia-time-icon" />
                        <span className="toast-advertencia-time">Revisa los campos</span>
                    </div>
                </div>
                <button onClick={() => toast.dismiss(t.id)} className="toast-advertencia-cerrar"><FaTimes /></button>
            </div>
        ), { duration: 4000, position: 'top-center' });
    };

    const simularCarga = async (mensaje = "Guardando tarea...") => {
        const toastId = toast.custom(
            <div className="toast-carga-personalizado">
                <FaSpinner className="toast-carga-icon fa-spin" />
                <div className="toast-carga-contenido">
                    <div className="toast-carga-titulo">{mensaje}</div>
                    <div className="toast-carga-barra"><div className="toast-carga-progreso"></div></div>
                </div>
            </div>,
            { duration: Infinity, position: 'top-center' }
        );
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.dismiss(toastId);
    };

    // ===== MANEJADORES =====
    const handlePageChange = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (e) => {
        setCategoriaFiltro(e.target.value);
        setPaginaActual(1);
    };

    const handleModoVistaChange = (modo) => {
        setModoVista(modo);
        setPaginaActual(1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setFormData({
        nuevoTrabajo: "",
        encargadoSeleccionado: "",
        estadoSeleccionado: "Pendiente",
        categoriaFormulario: "Todas"
    });

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        const errores = [];

        if (!formData.nuevoTrabajo.trim()) {
            errores.push("La descripción de la tarea está vacía");
        } else if (!validarSoloTexto(formData.nuevoTrabajo)) {
            errores.push("La tarea solo puede contener letras y espacios (sin números)");
        }
        if (!formData.encargadoSeleccionado) errores.push("No has seleccionado un encargado");

        if (errores.length > 0) {
            mostrarToastAdvertencia("Campos incompletos o inválidos", errores);
            return;
        }

        const ultimoId = tareas.length > 0 ? Math.max(...tareas.map(t => t.id)) : 0;
        const nuevaTarea = {
            id: ultimoId + 1,
            id_usuario: parseInt(formData.encargadoSeleccionado),
            trabajo_a_realizar: formData.nuevoTrabajo,
            estado: formData.estadoSeleccionado,
            version: formData.categoriaFormulario === "Todas" ? "General" : formData.categoriaFormulario
        };

        await simularCarga();
        setTareas([...tareas, nuevaTarea]);

        if (formData.encargadoSeleccionado === currentUserId?.toString()) {
            const storedNoti = localStorage.getItem("notificaciones");
            const notificaciones = storedNoti ? JSON.parse(storedNoti) : [];
            localStorage.setItem("notificaciones", JSON.stringify([{
                id: Date.now(),
                mensaje: `Te han asignado una tarea: ${nuevaTarea.trabajo_a_realizar}`,
                fecha: new Date().toISOString(),
                leida: false
            }, ...notificaciones]));
        }

        mostrarToastExito("¡Tarea guardada!");
        handleCloseModal();
    };

    const handleOpenCompleteModal = (tarea) => {
        setTareaSeleccionada(tarea);
        setFormData(prev => ({ ...prev, estadoSeleccionado: tarea.estado }));
        setShowCompleteModal(true);
    };

    const handleCloseCompleteModal = () => {
        setShowCompleteModal(false);
        setTareaSeleccionada(null);
        setFormData(prev => ({ ...prev, estadoSeleccionado: "Pendiente" }));
    };

    const handleUpdateTaskStatus = async (e) => {
        e.preventDefault();
        if (!tareaSeleccionada) return;

        const promesa = new Promise(resolve => setTimeout(() => resolve(tareaSeleccionada), 1000));

        toast.promise(promesa, {
            loading: (
                <div className="toast-carga-personalizado">
                    <FaSpinner className="toast-carga-icon fa-spin" />
                    <div className="toast-carga-contenido">
                        <div className="toast-carga-titulo">Actualizando tarea...</div>
                        <div className="toast-carga-barra"><div className="toast-carga-progreso"></div></div>
                    </div>
                </div>
            ),
            success: () => {
                const tareasActualizadas = tareas.map(t => t.id === tareaSeleccionada.id ? { ...t, estado: formData.estadoSeleccionado } : t);
                setTareas(tareasActualizadas);

                if (formData.estadoSeleccionado === "Completado") {
                    const storedNoti = localStorage.getItem("notificaciones");
                    const notificaciones = storedNoti ? JSON.parse(storedNoti) : [];
                    localStorage.setItem("notificaciones", JSON.stringify([{
                        id: Date.now(),
                        mensaje: `La tarea "${tareaSeleccionada.trabajo_a_realizar}" ha sido completada`,
                        fecha: new Date().toISOString(),
                        leida: false
                    }, ...notificaciones]));

                    return (
                        <div className="toast-exito-personalizado toast-exito-carga">
                            <FaStar className="toast-exito-icon" />
                            <div className="toast-exito-contenido">
                                <div className="toast-exito-titulo">¡Tarea completada!</div>
                                <div className="toast-exito-detalles"><p>✨ {tareaSeleccionada.trabajo_a_realizar}</p></div>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="toast-exito-personalizado toast-exito-carga">
                        <FaSyncAlt className="toast-exito-icon" />
                        <div className="toast-exito-contenido">
                            <div className="toast-exito-titulo">Estado actualizado</div>
                            <div className="toast-exito-detalles"><p>📊 Nuevo estado: {formData.estadoSeleccionado}</p></div>
                        </div>
                    </div>
                );
            }
        }, { success: { duration: 2000 }, loading: { duration: Infinity }, position: 'top-center' });

        handleCloseCompleteModal();
    };

    return (
        <div className="tareas-prueba">
            <header className="tareas-prueba__header">
                <h1 className="tareas-prueba__title">OikosFlow</h1>
                <div className="tareas-prueba__top">
                    <div><h2>Hola, {usuarioActivo}.</h2><p>Gestión de Tareas</p></div>
                    <div className="tareas-prueba__icons">
                        <FaBell onClick={() => navigate("/notificaciones")} />
                        <FaUserCircle onClick={() => navigate("/perfil")} />
                    </div>
                </div>
            </header>

            <div className="tareas-prueba__filtros-container">
                <div className="tareas-prueba__modo-filtro">
                    <button className={modoVista === "mis" ? "active" : ""} onClick={() => handleModoVistaChange("mis")}>Mis tareas</button>
                    <button className={modoVista === "todas" ? "active" : ""} onClick={() => handleModoVistaChange("todas")}>Todas las tareas</button>
                </div>
                <div className="tareas-prueba__filtros">
                    <label htmlFor="categoria">Filtrar por: </label>
                    <select id="categoria" value={categoriaFiltro} onChange={handleCategoryChange} className="filtro-select">
                        {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <span className="resultados-count">{tareasFiltradas.length} tareas activas • Página {paginaActual} de {totalPaginas || 1}</span>
                </div>
            </div>

            <section className="tareas-prueba__table">
                <div className="table__header">
                    <span>Encargado</span><span>Tarea</span><span>Estado</span><span>Categoría</span><span>Acciones</span>
                </div>
                {tareasPaginadas.map(tarea => {
                    const nombreUsuario = getNombreUsuario(tarea.id_usuario);
                    const iniciales = getInitials(nombreUsuario);
                    const avatarColor = getAvatarColor(nombreUsuario);
                    const categoria = tarea.version || "General";
                    const CategoryIcon = getCategoryIcon(categoria);
                    const categoryColor = getCategoryColor(categoria);
                    return (
                        <div className="table__row" key={tarea.id}>
                            <div className="user-info">
                                <div className="user-avatar" style={{ backgroundColor: avatarColor }}>
                                    {iniciales}
                                    <span className="user-tooltip">{nombreUsuario}</span>
                                </div>
                            </div>
                            <span className="task-title">{tarea.trabajo_a_realizar}</span>
                            <span className={getStatusClass(tarea.estado)}>{tarea.estado}</span>
                            <div className="category-info">
                                <div className="category-icon" style={{ backgroundColor: categoryColor }}>
                                    {CategoryIcon}
                                    <span className="category-tooltip">{categoria}</span>
                                </div>
                            </div>
                            <span>
                                <button className="btn-completar" onClick={() => handleOpenCompleteModal(tarea)} title="Cambiar estado">
                                    <FaCheckCircle />
                                </button>
                            </span>
                        </div>
                    );
                })}
                {tareasFiltradas.length === 0 && <div className="table__empty">No hay tareas activas {modoVista === "mis" ? "asignadas a ti" : "en esta categoría"}</div>}
            </section>

            <button className="btn-add tareas-prueba__add-btn" onClick={() => setShowModal(true)}>+ Añadir Tarea</button>

            {totalPaginas > 1 && (
                <div className="tareas-prueba__paginacion">
                    <button onClick={() => handlePageChange(paginaActual - 1)} disabled={paginaActual === 1} className="paginacion-btn">← Anterior</button>
                    <div className="paginacion-numeros">
                        {getPaginationNumbers(paginaActual, totalPaginas).map((num, idx) => (
                            num === '...' ?
                                <span key={`dots-${idx}-${paginaActual}`} className="paginacion-puntos">...</span> :
                                <button key={`page-${num}`} onClick={() => handlePageChange(num)} className={`paginacion-numero ${paginaActual === num ? 'activo' : ''}`}>{num}</button>
                        ))}
                    </div>
                    <button onClick={() => handlePageChange(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="paginacion-btn">Siguiente →</button>
                </div>
            )}

            <nav className="tareas-prueba__bottom-nav">
                {[
                    { to: "/home", icon: <FaHome />, label: "Home", end: true },
                    { to: "/tareas", icon: <FaTasks />, label: "Tareas" },
                    { to: "/historial", icon: <FaHistory />, label: "Historial" },
                    { to: "/perfil", icon: <FaUser />, label: "Perfil" }
                ].map(link => (
                    <NavLink key={link.to} to={link.to} end={link.end} className={({ isActive }) => isActive ? "active" : ""}>
                        {link.icon} <span>{link.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Modal Añadir Tarea */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2 className="modal-title">Añadir Tarea</h2>
                        <form onSubmit={handleAddTask} className="modal-form">
                            <div className="form-group">
                                <label>Encargado</label>
                                <select name="encargadoSeleccionado" value={formData.encargadoSeleccionado} onChange={handleInputChange} required>
                                    <option value="">Seleccionar encargado</option>
                                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre_completo}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tarea</label>
                                <input type="text" name="nuevoTrabajo" value={formData.nuevoTrabajo} onChange={handleInputChange} placeholder="Descripción de la tarea (solo letras)" required />
                            </div>
                            <div className="form-group">
                                <label>Estado</label>
                                <select name="estadoSeleccionado" value={formData.estadoSeleccionado} onChange={handleInputChange}>
                                    <option>Pendiente</option><option>En Proceso</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Categoría</label>
                                <select name="categoriaFormulario" value={formData.categoriaFormulario} onChange={handleInputChange}>
                                    {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
                                <button type="submit" className="btn-add-task">Añadir</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Actualizar Estado */}
            {showCompleteModal && tareaSeleccionada && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2 className="modal-title">Actualizar Estado</h2>
                        <p className="modal-subtitle">{tareaSeleccionada.trabajo_a_realizar}</p>
                        <form onSubmit={handleUpdateTaskStatus} className="modal-form">
                            <div className="form-group">
                                <label>Estado</label>
                                <select name="estadoSeleccionado" value={formData.estadoSeleccionado} onChange={handleInputChange}>
                                    <option>Pendiente</option><option>En Proceso</option><option>Completado</option>
                                </select>
                            </div>
                            <div className="modal-buttons">
                                <button type="button" className="btn-cancel" onClick={handleCloseCompleteModal}>Cancelar</button>
                                <button type="submit" className="btn-add-task">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TareasPrueba;