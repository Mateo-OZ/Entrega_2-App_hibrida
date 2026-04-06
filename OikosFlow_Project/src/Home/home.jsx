import { useState, useEffect, useRef } from "react";
import {
    FaBell, FaUserCircle, FaHome, FaTasks, FaHistory, FaUser,
    FaCheckCircle, FaExclamationTriangle, FaSpinner, FaTimes,
    FaClock, FaDownload, FaUpload, FaSyncAlt, FaFilter, FaEye,
    FaBroom, FaFileInvoice, FaShoppingCart, FaLeaf,
    FaWrench, FaBoxes, FaBed, FaQuestionCircle, FaClipboardList
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import tareasData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import "../Home/home.scss";

const Home = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const tareasPorPagina = 6;

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
    const [usuarioActual, setUsuarioActual] = useState(null);
    const [tabActiva, setTabActiva] = useState("filtro");
    const [vistaPreviaImport, setVistaPreviaImport] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    // Efectos
    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    useEffect(() => {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }, [usuarios]);

    useEffect(() => {
        const storedUser = localStorage.getItem("usuarioActivo");
        if (storedUser) {
            try {
                setUsuarioActual(JSON.parse(storedUser));
            } catch {
                console.error("usuarioActivo inválido");
            }
        }
    }, []);

    // Utilidades
    const getCurrentUser = () => usuarioActual?.nombre_completo || "Invitado";
    const isDeveloperMode = () => usuarioActual?.esDesarrollador === true;
    const getNombreUsuario = (id) => usuarios.find(u => u.id === id)?.nombre_completo || "Usuario no encontrado";

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

    const getStatusClass = (status) => {
        const map = { "Pendiente": "estado-pendiente", "En Proceso": "estado-proceso", "Completado": "estado-completado" };
        return map[status] || "estado-pendiente";
    };

    // ===== PAGINACIÓN INTELIGENTE =====
    const getPaginationNumbers = (currentPage, totalPages) => {
        if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);

        if (currentPage <= 3) return [1, 2, 3, '...', totalPages];
        if (currentPage >= totalPages - 1) return [1, '...', totalPages - 2, totalPages - 1, totalPages];
        return [1, '...', currentPage, currentPage + 1, currentPage + 2, '...', totalPages];
    };

    // ===== FILTROS Y PAGINACIÓN =====
    const categoriasUnicas = ["Todas", ...new Set(tareas.map(t => t.version).filter(Boolean))];
    const tareasFiltradas = categoriaSeleccionada === "Todas" ? tareas : tareas.filter(t => t.version === categoriaSeleccionada);
    const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);
    const tareasPaginadas = tareasFiltradas.slice((paginaActual - 1) * tareasPorPagina, paginaActual * tareasPorPagina);

    const handlePageChange = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (e) => {
        setCategoriaSeleccionada(e.target.value);
        setPaginaActual(1);
    };

    // ===== TOASTS =====
    const mostrarToastExito = (mensaje, icono = <FaCheckCircle />) => {
        toast.custom((t) => (
            <div className={`toast-exito-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
                <div className="toast-exito-icon">{icono}</div>
                <div className="toast-exito-contenido">
                    <div className="toast-exito-titulo">{mensaje}</div>
                </div>
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
                        <span className="toast-advertencia-time">Verifica los datos</span>
                    </div>
                </div>
                <button onClick={() => toast.dismiss(t.id)} className="toast-advertencia-cerrar"><FaTimes /></button>
            </div>
        ), { duration: 4000, position: 'top-center' });
    };

    const simularCarga = async (mensaje, duracion = 1000) => {
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
        await new Promise(resolve => setTimeout(resolve, duracion));
        toast.dismiss(toastId);
    };

    // ===== EXPORTAR =====
    const handleExportPreview = () => {
        if (tareasFiltradas.length === 0) {
            mostrarToastAdvertencia("No hay datos para exportar", ["No hay tareas en esta categoría"]);
            return;
        }
        setVistaPreviaImport({
            datos: tareasFiltradas,
            tipo: "export",
            total: tareasFiltradas.length,
            categorias: [...new Set(tareasFiltradas.map(t => t.version))],
            usuarios: [...new Set(tareasFiltradas.map(t => getNombreUsuario(t.id_usuario)))]
        });
        setShowPreviewModal(true);
    };

    const confirmExport = () => {
        const blob = new Blob([JSON.stringify(tareasFiltradas, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Tareas_export_${new Date().toISOString().split('T')[0]}_${categoriaSeleccionada}.json`;
        link.click();
        URL.revokeObjectURL(url);
        mostrarToastExito(`${tareasFiltradas.length} tareas exportadas correctamente`, <FaDownload />);
        setShowPreviewModal(false);
        setVistaPreviaImport(null);
    };

    // ===== IMPORTAR =====
    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (file.type !== "application/json") {
            mostrarToastAdvertencia("Archivo inválido", ["El archivo debe ser de tipo JSON"]);
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            mostrarToastAdvertencia("Archivo demasiado grande", ["El archivo no puede ser mayor a 5MB"]);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                if (!Array.isArray(parsedData)) throw new Error();

                const isValid = parsedData.every(t => t.id && t.id_usuario && t.trabajo_a_realizar && t.estado);
                if (!isValid) throw new Error();

                setVistaPreviaImport({
                    datos: parsedData,
                    tipo: "import",
                    total: parsedData.length,
                    categorias: [...new Set(parsedData.map(t => t.version).filter(Boolean))],
                    usuarios: [...new Set(parsedData.map(t => getNombreUsuario(t.id_usuario)))]
                });
                setShowPreviewModal(true);
            } catch {
                mostrarToastAdvertencia("Error al procesar", ["El archivo JSON no es válido o tiene estructura incorrecta"]);
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    const confirmImport = async () => {
        if (!vistaPreviaImport) return;
        await simularCarga("Importando datos...", 1200);
        setTareas(vistaPreviaImport.datos);
        setCategoriaSeleccionada("Todas");
        setPaginaActual(1);
        mostrarToastExito(`${vistaPreviaImport.total} tareas importadas correctamente`, <FaUpload />);
        setShowPreviewModal(false);
        setVistaPreviaImport(null);
    };

    // ===== RESET =====
    const handleFullReset = async () => {
        try {
            await simularCarga("Restaurando sistema...", 1500);
            localStorage.clear();
            setTareas(tareasData);
            setUsuarios(usuariosData);
            setCategoriaSeleccionada("Todas");
            setPaginaActual(1);
            mostrarToastExito("Sistema restaurado correctamente", <FaSyncAlt />);
            setTimeout(() => window.location.reload(), 500);
        } catch {
            mostrarToastAdvertencia("Error en la operación", ["Error al restaurar el sistema"]);
        }
    };

    return (
        <div className="home">
            {isDeveloperMode() && (
                <div className="dev-mode-banner">
                    <FaSyncAlt /> Modo Desarrollador Activado - Herramientas adicionales visibles
                </div>
            )}

            <header className="home__header">
                <h1 className="home__title">OikosFlow</h1>
                <div className="home__top">
                    <div>
                        <h2>Hola, {getCurrentUser()}.</h2>
                        <p>Grupo Casa</p>
                    </div>
                    <div className="home__icons">
                        <FaBell onClick={() => navigate("/notificaciones")} />
                        <FaUserCircle onClick={() => navigate("/perfil")} />
                    </div>
                </div>
            </header>

            {/* PESTAÑAS */}
            <div className="home__main-tabs">
                {[
                    { id: "filtro", icon: <FaFilter />, label: "Filtrar Tareas" },
                    { id: "importar", icon: <FaUpload />, label: "Importar JSON" },
                    { id: "exportar", icon: <FaDownload />, label: "Exportar JSON" }
                ].map(tab => (
                    <button key={tab.id} className={`main-tab ${tabActiva === tab.id ? 'active' : ''}`} onClick={() => setTabActiva(tab.id)}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTENIDO PESTAÑAS */}
            {tabActiva === 'filtro' && (
                <div className="home__filtros">
                    <label htmlFor="categoria">Filtrar por categoría: </label>
                    <select id="categoria" value={categoriaSeleccionada} onChange={handleCategoryChange} className="filtro-select">
                        {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <span className="resultados-count">{tareasFiltradas.length} tareas • Página {paginaActual} de {totalPaginas || 1}</span>
                </div>
            )}

            {tabActiva === 'importar' && (
                <div className="home__import-section">
                    <div className="import-card">
                        <FaUpload className="import-icon" />
                        <h3>Importar Tareas desde JSON</h3>
                        <p>Selecciona un archivo JSON con la estructura correcta de tareas</p>
                        <button className="btn-add btn-with-icon" onClick={() => fileInputRef.current.click()}>
                            <FaUpload /> Seleccionar archivo
                        </button>
                        <input type="file" accept=".json" ref={fileInputRef} onChange={handleFileSelect} style={{ display: "none" }} />
                    </div>
                </div>
            )}

            {tabActiva === 'exportar' && (
                <div className="home__export-section">
                    <div className="export-card">
                        <FaDownload className="export-icon" />
                        <h3>Exportar Tareas</h3>
                        <p>Descarga las tareas actuales en formato JSON</p>
                        <button className="btn-add btn-with-icon" onClick={handleExportPreview} disabled={tareasFiltradas.length === 0}>
                            <FaEye /> Vista previa y exportar
                        </button>
                        {tareasFiltradas.length === 0 && <p className="export-warning">No hay tareas para exportar</p>}
                    </div>
                </div>
            )}

            {/* TABLA */}
            <section className="home__table">
                <div className="table__header">
                    <span>Encargado</span><span>Tarea</span><span>Estado</span><span>Categoría</span>
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
                        </div>
                    );
                })}
                {tareasFiltradas.length === 0 && <div className="table__empty">No hay tareas en esta categoría</div>}
            </section>

            {/* PAGINACIÓN */}
            {totalPaginas > 1 && (
                <div className="home__paginacion">
                    <button onClick={() => handlePageChange(paginaActual - 1)} disabled={paginaActual === 1} className="paginacion-btn">← Anterior</button>
                    <div className="paginacion-numeros">
                        {getPaginationNumbers(paginaActual, totalPaginas).map((num, idx) => (
                            num === '...' ? <span key={`dots-${idx}`} className="paginacion-puntos">...</span> :
                                <button key={num} onClick={() => handlePageChange(num)} className={`paginacion-numero ${paginaActual === num ? 'activo' : ''}`}>{num}</button>
                        ))}
                    </div>
                    <button onClick={() => handlePageChange(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="paginacion-btn">Siguiente →</button>
                </div>
            )}

            {/* RESET (solo desarrollador) */}
            {isDeveloperMode() && (
                <div className="home__reset-container">
                    <button onClick={handleFullReset} className="btn-add btn-with-icon dev-reset-btn"><FaSyncAlt /> Restaurar sistema</button>
                </div>
            )}

            {/* MODAL VISTA PREVIA */}
            {showPreviewModal && vistaPreviaImport && (
                <div className="modal-overlay">
                    <div className="modal-card modal-card--preview">
                        <h2 className="modal-title">{vistaPreviaImport.tipo === 'export' ? 'Vista previa de exportación' : 'Vista previa de importación'}</h2>
                        <div className="preview-table-container">
                            <table className="preview-table">
                                <thead><tr><th>Encargado</th><th>Tarea</th><th>Estado</th><th>Categoría</th></tr></thead>
                                <tbody>
                                    {vistaPreviaImport.datos.slice(0, 5).map((tarea, idx) => (
                                        <tr key={idx}>
                                            <td>{getNombreUsuario(tarea.id_usuario)}</td>
                                            <td>{tarea.trabajo_a_realizar.length > 40 ? tarea.trabajo_a_realizar.substring(0, 40) + '...' : tarea.trabajo_a_realizar}</td>
                                            <td>{tarea.estado}</td>
                                            <td>{tarea.version || "General"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {vistaPreviaImport.datos.length > 5 && <p className="preview-more">... y {vistaPreviaImport.datos.length - 5} tareas más</p>}
                        </div>
                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={() => { setShowPreviewModal(false); setVistaPreviaImport(null); }}>Cancelar</button>
                            <button className="btn-add-task" onClick={vistaPreviaImport.tipo === 'export' ? confirmExport : confirmImport}>
                                {vistaPreviaImport.tipo === 'export' ? 'Confirmar Exportación' : 'Confirmar Importación'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* NAVEGACIÓN INFERIOR */}
            <nav className="home__bottom-nav">
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
        </div>
    );
};

export default Home;