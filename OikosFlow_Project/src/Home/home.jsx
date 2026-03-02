import { useState, useEffect, useRef } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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
            default:
                return "estado-pendiente";
        }
    };

    // Obtener categorías únicas
    const categoriasUnicas = ["Todas", ...new Set(tareas.map(t => t.version).filter(Boolean))];

    // Filtrar tareas por categoría
    const tareasFiltradas = categoriaSeleccionada === "Todas"
        ? tareas
        : tareas.filter(t => t.version === categoriaSeleccionada);

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

    const handleFullReset = () => {
        localStorage.clear();
        setTareas(tareasData);
        setUsuarios(usuariosData);
        setCategoriaSeleccionada("Todas");
        setPaginaActual(1);
        window.location.reload();
    };

    const handleDownloadJSON = () => {
        const dataToDownload = localStorage.getItem("tareas");
        if (!dataToDownload) {
            toast.error("No hay datos para descargar");
            return;
        }

        const blob = new Blob([dataToDownload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "Tareas_backup.json";
        link.click();
        URL.revokeObjectURL(url);
        toast.success("JSON descargado correctamente");
    };

    const handleUploadJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                if (!Array.isArray(parsedData)) {
                    toast.error("El archivo debe contener un array válido");
                    return;
                }
                setTareas(parsedData);
                setCategoriaSeleccionada("Todas");
                setPaginaActual(1);
                toast.success("Datos cargados correctamente");
            } catch {
                toast.error("Archivo JSON inválido");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="home">
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

            {/* Filtro por categoría */}
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

            {/* Indicador de scroll horizontal para móviles */}
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
                    <button onClick={handleDownloadJSON} className="btn-add">
                        Descargar JSON
                    </button>
                    <button onClick={() => fileInputRef.current.click()} className="btn-add">
                        Subir JSON
                    </button>
                    <input
                        type="file"
                        accept=".json"
                        ref={fileInputRef}
                        onChange={handleUploadJSON}
                        style={{ display: "none" }}
                    />
                </div>
                <button onClick={handleFullReset} className="btn-add">
                    Restaurar sistema
                </button>
            </div>

            {/* Barra de navegación inferior */}
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