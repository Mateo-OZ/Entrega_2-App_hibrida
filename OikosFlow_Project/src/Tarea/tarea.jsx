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
    const tareasPorPagina = 10;

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

    // Estado del formulario
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
                const parsed = JSON.parse(storedUser);
                return parsed.nombre_completo || "Invitado";
            } catch {
                console.error("usuarioActivo inválido");
            }
        }
        return "Invitado";
    };

    const usuarioActivo = getCurrentUser();
    const currentUserId = usuarios.find(u => u.nombre_completo === usuarioActivo)?.id || null;

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

    // ===== OBTENER INICIALES =====
    const getInitials = (nombreCompleto) => {
        if (!nombreCompleto || nombreCompleto === "Usuario no encontrado") return "?";
        const palabras = nombreCompleto.trim().split(" ");
        if (palabras.length === 1) return palabras[0].charAt(0).toUpperCase();
        return (palabras[0].charAt(0) + palabras[palabras.length - 1].charAt(0)).toUpperCase();
    };

    // ===== OBTENER COLOR DE FONDO PARA EL AVATAR =====
    const getAvatarColor = (nombre) => {
        const colores = [
            "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
            "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"
        ];
        let hash = 0;
        for (let i = 0; i < nombre.length; i++) {
            hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colores[Math.abs(hash) % colores.length];
    };

    // ===== MAPA DE ICONOS POR CATEGORÍA =====
    const getCategoryIcon = (categoria) => {
        const iconMap = {
            "Aseo": <FaBroom />,
            "Administración": <FaFileInvoice />,
            "Suministros": <FaShoppingCart />,
            "Jardinería": <FaLeaf />,
            "Mantenimiento": <FaWrench />,
            "Organización": <FaBoxes />,
            "Lencería": <FaBed />,
            "General": <FaClipboardList />
        };
        return iconMap[categoria] || <FaQuestionCircle />;
    };

    // ===== OBTENER COLOR DE FONDO PARA LA CATEGORÍA =====
    const getCategoryColor = (categoria) => {
        const colorMap = {
            "Aseo": "#4ECDC4",
            "Administración": "#45B7D1",
            "Suministros": "#96CEB4",
            "Jardinería": "#88D4AB",
            "Mantenimiento": "#FFA07A",
            "Organización": "#DDA0DD",
            "Lencería": "#F7DC6F",
            "General": "#BB8FCE"
        };
        return colorMap[categoria] || "#95A5A6";
    };

    // Obtener categorías únicas
    const categoriasUnicas = ["Todas", ...new Set(tareas.map(t => t.version).filter(Boolean))];

    // Filtrar tareas
    const tareasActivas = tareas.filter(t => t.estado !== "Completado");

    const tareasFiltradasPorCategoria = categoriaFiltro === "Todas"
        ? tareasActivas
        : tareasActivas.filter(t => t.version === categoriaFiltro);

    const tareasFiltradas = modoVista === "mis" && currentUserId
        ? tareasFiltradasPorCategoria.filter(t => t.id_usuario === currentUserId)
        : tareasFiltradasPorCategoria;

    // Paginación
    const indexUltimaTarea = paginaActual * tareasPorPagina;
    const indexPrimeraTarea = indexUltimaTarea - tareasPorPagina;
    const tareasPaginadas = tareasFiltradas.slice(indexPrimeraTarea, indexUltimaTarea);
    const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);

    // ===== VALIDACIONES =====
    const validarSoloTexto = (texto) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(texto);

    // ===== TOAST PERSONALIZADOS =====
    const mostrarToastExito = (mensaje) => {
        toast.custom((t) => (
            <div className={`toast-exito-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
                <FaCheckCircle className="toast-exito-icon" />
                <div className="toast-exito-contenido">
                    <div className="toast-exito-titulo">{mensaje}</div>
                </div>
            </div>
        ), {
            duration: 2000,
            position: 'top-center',
        });
    };

    const mostrarToastAdvertencia = (mensaje, errores = []) => {
        toast.custom((t) => (
            <div className={`toast-advertencia-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
                <FaExclamationTriangle className="toast-advertencia-icon" />
                <div className="toast-advertencia-contenido">
                    <div className="toast-advertencia-titulo">{mensaje}</div>
                    <div className="toast-advertencia-detalles">
                        {errores.map((error, index) => (
                            <p key={index}>• {error}</p>
                        ))}
                    </div>
                    <div className="toast-advertencia-footer">
                        <FaClock className="toast-advertencia-time-icon" />
                        <span className="toast-advertencia-time">Revisa los campos</span>
                    </div>
                </div>
                <button onClick={() => toast.dismiss(t.id)} className="toast-advertencia-cerrar">
                    <FaTimes />
                </button>
            </div>
        ), {
            duration: 4000,
            position: 'top-center',
        });
    };

    const simularCarga = async (mensaje = "Guardando tarea...") => {
        const toastId = toast.custom(
            <div className="toast-carga-personalizado">
                <FaSpinner className="toast-carga-icon fa-spin" />
                <div className="toast-carga-contenido">
                    <div className="toast-carga-titulo">{mensaje}</div>
                    <div className="toast-carga-barra">
                        <div className="toast-carga-progreso"></div>
                    </div>
                </div>
            </div>,
            {
                duration: Infinity,
                position: 'top-center',
            }
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.dismiss(toastId);
    };

    // ===== MANEJADORES DE EVENTOS =====
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const resetForm = () => {
        setFormData({
            nuevoTrabajo: "",
            encargadoSeleccionado: "",
            estadoSeleccionado: "Pendiente",
            categoriaFormulario: "Todas"
        });
    };

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

        if (!formData.encargadoSeleccionado) {
            errores.push("No has seleccionado un encargado");
        }

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

        mostrarToastExito("¡Tarea guardada!");
        handleCloseModal();
    };

    // Funciones para completar tarea
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

        const promesa = new Promise((resolve) => {
            setTimeout(() => resolve(tareaSeleccionada), 1000);
        });

        toast.promise(
            promesa,
            {
                loading: (
                    <div className="toast-carga-personalizado">
                        <FaSpinner className="toast-carga-icon fa-spin" />
                        <div className="toast-carga-contenido">
                            <div className="toast-carga-titulo">Actualizando tarea...</div>
                            <div className="toast-carga-barra">
                                <div className="toast-carga-progreso"></div>
                            </div>
                        </div>
                    </div>
                ),
                success: () => {
                    const tareasActualizadas = tareas.map(t =>
                        t.id === tareaSeleccionada.id
                            ? { ...t, estado: formData.estadoSeleccionado }
                            : t
                    );
                    setTareas(tareasActualizadas);

                    if (formData.estadoSeleccionado === "Completado") {
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

                        return (
                            <div className="toast-exito-personalizado toast-exito-carga">
                                <FaStar className="toast-exito-icon" />
                                <div className="toast-exito-contenido">
                                    <div className="toast-exito-titulo">¡Tarea completada!</div>
                                    <div className="toast-exito-detalles">
                                        <p>✨ {tareaSeleccionada.trabajo_a_realizar}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className="toast-exito-personalizado toast-exito-carga">
                                <FaSyncAlt className="toast-exito-icon" />
                                <div className="toast-exito-contenido">
                                    <div className="toast-exito-titulo">Estado actualizado</div>
                                    <div className="toast-exito-detalles">
                                        <p>📊 Nuevo estado: {formData.estadoSeleccionado}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                }
            },
            {
                success: { duration: 2000 },
                loading: { duration: Infinity },
                position: 'top-center',
            }
        );
        handleCloseCompleteModal();
    };

    // ===== RENDER =====
    return (
        <div className="tareas-prueba">

            {/* Header */}
            <header className="tareas-prueba__header">
                <h1 className="tareas-prueba__title">OikosFlow</h1>
                <div className="tareas-prueba__top">
                    <div>
                        <h2>Hola, {usuarioActivo}.</h2>
                        <p>Gestión de Tareas</p>
                    </div>
                    <div className="tareas-prueba__icons">
                        <FaBell onClick={() => navigate("/notificaciones")} />
                        <FaUserCircle onClick={() => navigate("/perfil")} />
                    </div>
                </div>
            </header>

            {/* Filtros */}
            <div className="tareas-prueba__filtros-container">
                <div className="tareas-prueba__modo-filtro">
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

                <div className="tareas-prueba__filtros">
                    <label htmlFor="categoria">Filtrar por: </label>
                    <select
                        id="categoria"
                        value={categoriaFiltro}
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

            {/* Indicador de scroll */}
            <div className="scroll-hint">
                <span>← Desliza para ver más →</span>
            </div>

            {/* Tabla modificada con avatares e iconos */}
            <section className="tareas-prueba__table">
                <div className="table__header">
                    <span>Encargado</span>
                    <span>Tarea</span>
                    <span>Estado</span>
                    <span>Categoría</span>
                    <span>Acciones</span>
                </div>

                {tareasPaginadas.map((tarea) => {
                    const nombreUsuario = getNombreUsuario(tarea.id_usuario);
                    const iniciales = getInitials(nombreUsuario);
                    const avatarColor = getAvatarColor(nombreUsuario);
                    const categoria = tarea.version || "General";
                    const CategoryIcon = getCategoryIcon(categoria);
                    const categoryColor = getCategoryColor(categoria);
                    
                    return (
                        <div className="table__row" key={tarea.id}>
                            <div className="user-info">
                                <div 
                                    className="user-avatar" 
                                    style={{ backgroundColor: avatarColor }}
                                >
                                    {iniciales}
                                    <span className="user-tooltip">{nombreUsuario}</span>
                                </div>
                            </div>
                            <span className="task-title">{tarea.trabajo_a_realizar}</span>
                            <span className={getStatusClass(tarea.estado)}>
                                {tarea.estado}
                            </span>
                            <div className="category-info">
                                <div 
                                    className="category-icon" 
                                    style={{ backgroundColor: categoryColor }}
                                >
                                    {CategoryIcon}
                                    <span className="category-tooltip">{categoria}</span>
                                </div>
                            </div>
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
                    );
                })}

                {tareasFiltradas.length === 0 && (
                    <div className="table__empty">
                        No hay tareas activas {modoVista === "mis" ? "asignadas a ti" : "en esta categoría"}
                    </div>
                )}
            </section>

            {/* Botón Añadir Tarea */}
            <button className="btn-add tareas-prueba__add-btn" onClick={() => setShowModal(true)}>
                + Añadir Tarea
            </button>

            {/* Paginación */}
            {totalPaginas > 1 && (
                <div className="tareas-prueba__paginacion">
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

            {/* Barra de navegación */}
            <nav className="tareas-prueba__bottom-nav">
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

            {/* Modal Añadir Tarea */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2 className="modal-title">Añadir Tarea</h2>

                        <form onSubmit={handleAddTask} className="modal-form">
                            <div className="form-group">
                                <label>Encargado</label>
                                <select
                                    name="encargadoSeleccionado"
                                    value={formData.encargadoSeleccionado}
                                    onChange={handleInputChange}
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
                                    name="nuevoTrabajo"
                                    value={formData.nuevoTrabajo}
                                    onChange={handleInputChange}
                                    placeholder="Descripción de la tarea (solo letras)"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    name="estadoSeleccionado"
                                    value={formData.estadoSeleccionado}
                                    onChange={handleInputChange}
                                >
                                    <option>Pendiente</option>
                                    <option>En Proceso</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Categoría</label>
                                <select
                                    name="categoriaFormulario"
                                    value={formData.categoriaFormulario}
                                    onChange={handleInputChange}
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

            {/* Modal Actualizar Estado */}
            {showCompleteModal && tareaSeleccionada && (
                <div className="modal-overlay">
                    <div className="modal-card">
                        <h2 className="modal-title">Actualizar Estado</h2>
                        <p className="modal-subtitle">{tareaSeleccionada.trabajo_a_realizar}</p>

                        <form onSubmit={handleUpdateTaskStatus} className="modal-form">
                            <div className="form-group">
                                <label>Estado</label>
                                <select
                                    name="estadoSeleccionado"
                                    value={formData.estadoSeleccionado}
                                    onChange={handleInputChange}
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

export default TareasPrueba;