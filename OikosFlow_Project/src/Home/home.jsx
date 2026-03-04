import { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle, FaHome, FaTasks, FaHistory, FaUser, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaTimes, FaClock, FaDownload, FaUpload, FaSyncAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import tareasData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import "../Home/home.scss";

const Home = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
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

    // Efectos
    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    useEffect(() => {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }, [usuarios]);

    // Utilidades
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

    const handleDownloadJSON = async () => {
        const dataToDownload = localStorage.getItem("tareas");

        if (!dataToDownload) {
            mostrarToastAdvertencia("Error al descargar", ["No hay datos para descargar"]);
            return;
        }

        try {
            await simularCarga("Preparando descarga...", 800);

            const blob = new Blob([dataToDownload], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Tareas_backup_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            mostrarToastExito("JSON descargado correctamente", <FaDownload />);
        } catch (error) {
            mostrarToastAdvertencia("Error al descargar", ["No se pudo completar la descarga"]);
        }
    };

    const handleUploadJSON = async (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const errores = [];

        // Validar tipo de archivo
        if (file.type !== "application/json") {
            errores.push("El archivo debe ser de tipo JSON");
            mostrarToastAdvertencia("Archivo inválido", errores);
            return;
        }

        // Validar tamaño (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            errores.push("El archivo no puede ser mayor a 5MB");
            mostrarToastAdvertencia("Archivo demasiado grande", errores);
            return;
        }

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                await simularCarga("Cargando datos...", 1200);

                const parsedData = JSON.parse(e.target.result);

                if (!Array.isArray(parsedData)) {
                    errores.push("El archivo debe contener un array de tareas");
                    mostrarToastAdvertencia("Formato inválido", errores);
                    return;
                }

                // Validar estructura básica
                const tieneFormatoValido = parsedData.every(tarea =>
                    tarea.id && tarea.id_usuario && tarea.trabajo_a_realizar && tarea.estado
                );

                if (!tieneFormatoValido) {
                    errores.push("El archivo no tiene la estructura correcta de tareas");
                    mostrarToastAdvertencia("Estructura inválida", errores);
                    return;
                }

                setTareas(parsedData);
                setCategoriaSeleccionada("Todas");
                setPaginaActual(1);

                mostrarToastExito(
                    `${parsedData.length} tareas cargadas correctamente`,
                    <FaUpload />
                );
            } catch {
                errores.push("El archivo JSON no es válido");
                mostrarToastAdvertencia("Error al procesar", errores);
            }
        };

        reader.readAsText(file);
        event.target.value = ''; // Resetear input
    };

    return (
        <div className="home">
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName="toaster-container"
                toastOptions={{ duration: 3000 }}
            />

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

            {/* Filtros */}
            <div className="home__filtros">
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
                    {tareasFiltradas.length} tareas • Página {paginaActual} de {totalPaginas || 1}
                </span>
            </div>

            {/* Scroll hint */}
            <div className="scroll-hint">
                <span>← Desliza para ver más →</span>
            </div>

            {/* Tabla */}
            <section className="home__table">
                <div className="table__header">
                    <span>#</span>
                    <span>Encargado</span>
                    <span>Tarea</span>
                    <span>Estado</span>
                    <span>Categoría</span>
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
                    </div>
                ))}

                {tareasFiltradas.length === 0 && (
                    <div className="table__empty">
                        No hay tareas en esta categoría
                    </div>
                )}
            </section>

            {/* Paginación */}
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

            {/* Botones de control */}
            <div className="home__controls">
                <div className="home__export-import">
                    <button onClick={handleDownloadJSON} className="btn-add btn-with-icon">
                        <FaDownload /> Descargar JSON
                    </button>
                    <button onClick={() => fileInputRef.current.click()} className="btn-add btn-with-icon">
                        <FaUpload /> Subir JSON
                    </button>
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleUploadJSON}
                        style={{ display: "none" }}
                    />
                </div>
                <button onClick={handleFullReset} className="btn-add btn-with-icon">
                    <FaSyncAlt /> Restaurar sistema
                </button>
            </div>

            {/* Barra de navegación */}
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