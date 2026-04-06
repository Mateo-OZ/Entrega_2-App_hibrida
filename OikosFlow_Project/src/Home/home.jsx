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

    // Nuevos estados para las pestañas
    const [tabActiva, setTabActiva] = useState("filtro");
    const [vistaPreviaImport, setVistaPreviaImport] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

    // Efectos
    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    useEffect(() => {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }, [usuarios]);

    // Cargar usuario actual al inicio
    useEffect(() => {
        const storedUser = localStorage.getItem("usuarioActivo");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUsuarioActual(parsed);
            } catch {
                console.error("usuarioActivo inválido");
            }
        }
    }, []);

    // Utilidades
    const getCurrentUser = () => {
        if (usuarioActual) {
            return usuarioActual.nombre_completo || "Invitado";
        }
        return "Invitado";
    };

    // Verificar si el usuario actual tiene permisos de desarrollador
    const isDeveloperMode = () => {
        return usuarioActual?.esDesarrollador === true;
    };

    const getNombreUsuario = (id_usuario) => {
        const usuario = usuarios.find(u => u.id === id_usuario);
        return usuario ? usuario.nombre_completo : "Usuario no encontrado";
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

    const getStatusClass = (status) => {
        const statusMap = {
            "Pendiente": "estado-pendiente",
            "En Proceso": "estado-proceso",
            "Completado": "estado-completado"
        };
        return statusMap[status] || "estado-pendiente";
    };

    // ===== PAGINACIÓN INTELIGENTE =====
    // ===== PAGINACIÓN INTELIGENTE CORREGIDA =====
    const getPaginationNumbers = (currentPage, totalPages) => {
        if (totalPages <= 3) {
            // Si hay 3 o menos páginas, mostrar todas
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [];

        // Siempre mostrar primera página
        pages.push(1);

        // Caso: estamos en las primeras 3 páginas
        if (currentPage <= 3) {
            // Mostrar páginas 2, 3
            for (let i = 2; i <= 3; i++) {
                if (i < totalPages) {
                    pages.push(i);
                }
            }
            // Agregar puntos y última página si es necesario
            if (totalPages > 3) {
                pages.push('...');
                pages.push(totalPages);
            }
        }
        // Caso: estamos en las últimas 2 páginas
        else if (currentPage >= totalPages - 1) {
            pages.push('...');
            // Mostrar penúltima y última
            for (let i = totalPages - 2; i <= totalPages; i++) {
                if (i > 1 && i <= totalPages) {
                    pages.push(i);
                }
            }
        }
        // Caso: estamos en páginas intermedias (4, 5, etc.)
        else {
            pages.push('...');
            // Mostrar página actual y las siguientes
            for (let i = currentPage; i <= Math.min(totalPages, currentPage + 2); i++) {
                if (i > 1 && i < totalPages) {
                    pages.push(i);
                }
            }
            if (currentPage + 2 < totalPages) {
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage + 1 < totalPages) {
                pages.push(totalPages);
            }
        }

        // Eliminar duplicados y asegurar que la última página esté al final
        const uniquePages = [...new Set(pages)];

        // Asegurar que el último elemento sea el total de páginas
        if (uniquePages[uniquePages.length - 1] !== totalPages && totalPages > 1) {
            if (uniquePages[uniquePages.length - 1] === '...') {
                uniquePages.push(totalPages);
            } else {
                uniquePages[uniquePages.length - 1] = totalPages;
            }
        }

        return uniquePages;
    };

    const categoriasUnicas = ["Todas", ...new Set(tareas.map(t => t.version).filter(Boolean))];

    const tareasFiltradas = categoriaSeleccionada === "Todas"
        ? tareas
        : tareas.filter(t => t.version === categoriaSeleccionada);

    const indexUltimaTarea = paginaActual * tareasPorPagina;
    const indexPrimeraTarea = indexUltimaTarea - tareasPorPagina;
    const tareasPaginadas = tareasFiltradas.slice(indexPrimeraTarea, indexUltimaTarea);
    const totalPaginas = Math.ceil(tareasFiltradas.length / tareasPorPagina);

    // ===== TOAST PERSONALIZADOS =====
    const mostrarToastExito = (mensaje, icono = <FaCheckCircle />) => {
        toast.custom((t) => (
            <div className={`toast-exito-personalizado ${t.visible ? 'toast-enter' : 'toast-exit'}`}>
                <div className="toast-exito-icon">{icono}</div>
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
                        <span className="toast-advertencia-time">Verifica los datos</span>
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

    const simularCarga = async (mensaje, duracion = 1000) => {
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

        await new Promise((resolve) => setTimeout(resolve, duracion));
        toast.dismiss(toastId);
    };

    // Manejadores
    const handlePageChange = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCategoryChange = (e) => {
        setCategoriaSeleccionada(e.target.value);
        setPaginaActual(1);
    };

    const handleFullReset = async () => {
        const errores = [];

        try {
            await simularCarga("Restaurando sistema...", 1500);

            localStorage.clear();
            setTareas(tareasData);
            setUsuarios(usuariosData);
            setCategoriaSeleccionada("Todas");
            setPaginaActual(1);

            mostrarToastExito("Sistema restaurado correctamente", <FaSyncAlt />);

            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            errores.push("Error al restaurar el sistema");
            mostrarToastAdvertencia("Error en la operación", errores);
        }
    };

    // ===== FUNCIONES PARA EXPORTAR JSON CON VISTA PREVIA =====
    const handleExportPreview = () => {
        const dataToExport = tareasFiltradas;

        if (dataToExport.length === 0) {
            mostrarToastAdvertencia("No hay datos para exportar", ["No hay tareas en esta categoría"]);
            return;
        }

        // Mostrar vista previa
        setVistaPreviaImport({
            datos: dataToExport,
            tipo: "export",
            total: dataToExport.length,
            categorias: [...new Set(dataToExport.map(t => t.version))],
            usuarios: [...new Set(dataToExport.map(t => getNombreUsuario(t.id_usuario)))]
        });
        setShowPreviewModal(true);
    };

    const confirmExport = () => {
        const dataToExport = tareasFiltradas;
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Tareas_export_${new Date().toISOString().split('T')[0]}_${categoriaSeleccionada}.json`;
        link.click();
        URL.revokeObjectURL(url);

        mostrarToastExito(`${dataToExport.length} tareas exportadas correctamente`, <FaDownload />);
        setShowPreviewModal(false);
        setVistaPreviaImport(null);
    };

    // ===== FUNCIONES PARA IMPORTAR JSON CON VISTA PREVIA =====
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

        setArchivoSeleccionado(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);

                if (!Array.isArray(parsedData)) {
                    mostrarToastAdvertencia("Formato inválido", ["El archivo debe contener un array de tareas"]);
                    return;
                }

                const tieneFormatoValido = parsedData.every(tarea =>
                    tarea.id && tarea.id_usuario && tarea.trabajo_a_realizar && tarea.estado
                );

                if (!tieneFormatoValido) {
                    mostrarToastAdvertencia("Estructura inválida", ["El archivo no tiene la estructura correcta de tareas"]);
                    return;
                }

                // Mostrar vista previa del import
                setVistaPreviaImport({
                    datos: parsedData,
                    tipo: "import",
                    total: parsedData.length,
                    categorias: [...new Set(parsedData.map(t => t.version).filter(Boolean))],
                    usuarios: [...new Set(parsedData.map(t => getNombreUsuario(t.id_usuario)))]
                });
                setShowPreviewModal(true);
            } catch {
                mostrarToastAdvertencia("Error al procesar", ["El archivo JSON no es válido"]);
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
        setArchivoSeleccionado(null);
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

            {/* PESTAÑAS PRINCIPALES */}
            <div className="home__main-tabs">
                <button
                    className={`main-tab ${tabActiva === 'filtro' ? 'active' : ''}`}
                    onClick={() => setTabActiva('filtro')}
                >
                    <FaFilter /> Filtrar Tareas
                </button>
                <button
                    className={`main-tab ${tabActiva === 'importar' ? 'active' : ''}`}
                    onClick={() => setTabActiva('importar')}
                >
                    <FaUpload /> Importar JSON
                </button>
                <button
                    className={`main-tab ${tabActiva === 'exportar' ? 'active' : ''}`}
                    onClick={() => setTabActiva('exportar')}
                >
                    <FaDownload /> Exportar JSON
                </button>
            </div>

            {/* CONTENIDO DE LA PESTAÑA FILTRO */}
            {tabActiva === 'filtro' && (
                <div className="home__filtros">
                    <label htmlFor="categoria">Filtrar por categoría: </label>
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
                        {tareasFiltradas.length} tareas • Página {paginaActual} de {totalPaginas || 1}
                    </span>
                </div>
            )}

            {/* CONTENIDO DE LA PESTAÑA IMPORTAR */}
            {tabActiva === 'importar' && (
                <div className="home__import-section">
                    <div className="import-card">
                        <FaUpload className="import-icon" />
                        <h3>Importar Tareas desde JSON</h3>
                        <p>Selecciona un archivo JSON con la estructura correcta de tareas</p>
                        <button
                            className="btn-add btn-with-icon"
                            onClick={() => fileInputRef.current.click()}
                        >
                            <FaUpload /> Seleccionar archivo
                        </button>
                        <input
                            type="file"
                            accept=".json"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: "none" }}
                        />
                    </div>
                </div>
            )}

            {/* CONTENIDO DE LA PESTAÑA EXPORTAR */}
            {tabActiva === 'exportar' && (
                <div className="home__export-section">
                    <div className="export-card">
                        <FaDownload className="export-icon" />
                        <h3>Exportar Tareas</h3>
                        <p>Descarga las tareas actuales en formato JSON</p>
                        <button
                            className="btn-add btn-with-icon"
                            onClick={handleExportPreview}
                            disabled={tareasFiltradas.length === 0}
                        >
                            <FaEye /> Vista previa y exportar
                        </button>
                        {tareasFiltradas.length === 0 && (
                            <p className="export-warning">No hay tareas para exportar</p>
                        )}
                    </div>
                </div>
            )}

            {/* Tabla (visible en todas las pestañas) */}
            <section className="home__table">
                <div className="table__header">
                    <span>Encargado</span>
                    <span>Tarea</span>
                    <span>Estado</span>
                    <span>Categoría</span>
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
                        </div>
                    );
                })}

                {tareasFiltradas.length === 0 && (
                    <div className="table__empty">
                        No hay tareas en esta categoría
                    </div>
                )}
            </section>

            {/* Paginación mejorada */}
            {totalPaginas > 1 && (
                <div className="home__paginacion">
                    <button
                        onClick={() => handlePageChange(paginaActual - 1)}
                        disabled={paginaActual === 1}
                        className="paginacion-btn"
                    >
                        ← Anterior
                    </button>

                    <div className="paginacion-numeros">
                        {getPaginationNumbers(paginaActual, totalPaginas).map((num, index) => (
                            num === '...' ? (
                                <span key={`dots-${index}`} className="paginacion-puntos">...</span>
                            ) : (
                                <button
                                    key={num}
                                    onClick={() => handlePageChange(num)}
                                    className={`paginacion-numero ${paginaActual === num ? 'activo' : ''}`}
                                >
                                    {num}
                                </button>
                            )
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

            {/* Botón de restaurar sistema (solo para desarrolladores) */}
            {isDeveloperMode() && (
                <div className="home__reset-container">
                    <button onClick={handleFullReset} className="btn-add btn-with-icon dev-reset-btn">
                        <FaSyncAlt /> Restaurar sistema
                    </button>
                </div>
            )}

            {/* MODAL DE VISTA PREVIA - SIN ICONO */}
            {showPreviewModal && vistaPreviaImport && (
                <div className="modal-overlay">
                    <div className="modal-card modal-card--preview">
                        <h2 className="modal-title">
                            {vistaPreviaImport.tipo === 'export' ? 'Vista previa de exportación' : 'Vista previa de importación'}
                        </h2>

                        <div className="preview-table-container">
                            <table className="preview-table">
                                <thead>
                                    <tr>
                                        <th>Encargado</th>
                                        <th>Tarea</th>
                                        <th>Estado</th>
                                        <th>Categoría</th>
                                    </tr>
                                </thead>
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
                            {vistaPreviaImport.datos.length > 5 && (
                                <p className="preview-more">... y {vistaPreviaImport.datos.length - 5} tareas más</p>
                            )}
                        </div>

                        <div className="modal-buttons">
                            <button className="btn-cancel" onClick={() => {
                                setShowPreviewModal(false);
                                setVistaPreviaImport(null);
                            }}>
                                Cancelar
                            </button>
                            <button
                                className="btn-add-task"
                                onClick={vistaPreviaImport.tipo === 'export' ? confirmExport : confirmImport}
                            >
                                {vistaPreviaImport.tipo === 'export' ? 'Confirmar Exportación' : 'Confirmar Importación'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <nav className="home__bottom-nav">
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
        </div>
    );
};

export default Home;