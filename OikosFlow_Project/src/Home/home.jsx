import { useState } from "react";
import { useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa"
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import tareasData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import { useRef } from "react";
import "../Home/home.scss"

const Home = () => {

    const navigate = useNavigate();

    const handleFullReset = () => {
        localStorage.clear();
        setTareas(tareasData);
        setUsuarios(usuariosData);
        setCategoriaSeleccionada("Todas");
        setPaginaActual(1);
        window.location.reload();
    };

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
    const tareasPorPagina = 10;

    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    useEffect(() => {
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }, [usuarios]);

    let currenUser = "Invitado";
    const storedUser = localStorage.getItem("usuarioActivo");

    if (storedUser) {
        try {
            const parsed = JSON.parse(storedUser);
            currenUser = parsed.nombre_completo || "Invitado";
        } catch (error) {
            console.error("usuarioActivo inválido");
        }
    }

    const fileInputRef = useRef(null);

    const getNombreUsuario = (id_usuario) => {
        const usuario = usuarios.find(u => u.id === id_usuario);
        return usuario ? usuario.nombre_completo : "Usuario no encontrado";
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Pendiente":
                return "Estado Pendiente";
            case "En Proceso":
                return "Estado EnProceso";
            default:
                return "Estado Pendiente";
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

    // Cambiar de página
    const handlePageChange = (nuevaPagina) => {
        setPaginaActual(nuevaPagina);
        // Scroll suave hacia arriba para mejor experiencia
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDownloadJSON = () => {
        const dataToDownload = localStorage.getItem("tareas");

        if (!dataToDownload) {
            toast.error("No hay datos para descargar");
            return;
        }

        const blob = new Blob([dataToDownload], {
            type: "application/json",
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "Tareas_backup.json";
        link.click();

        URL.revokeObjectURL(url);

        toast.success("JSON descargado correctamente");
    };

    const handleOpenFilePicker = () => {
        fileInputRef.current.click();
    };

    const handleUploadJSON = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const parsedData = JSON.parse(e.target.result);
                if (!Array.isArray(parsedData)) {
                    alert("El archivo debe contener un array válido.");
                    return;
                }
                setTareas(parsedData); // Cambiado de setMembers
                setCategoriaSeleccionada("Todas"); // Resetear filtro al cargar nuevos datos
                toast.success("Datos cargados correctamente");
                setPaginaActual(1);
            } catch (error) {
                toast.error("Archivo JSON inválido");
                console.error(error);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="home">
            {/*Header*/}
            <header className="home__header">
                <h1 className="home__title">OikosFlow</h1>

                <div className="home__top">
                    <div>
                        <h2>Hola, {currenUser}.</h2>
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
                    onChange={(e) => {
                        setCategoriaSeleccionada(e.target.value);
                        setPaginaActual(1); // Reset a primera página al cambiar filtro
                    }}
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


            {/*Table*/}
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

            <div className="home__controls">

                <div className="home__export-import">
                    <button onClick={handleDownloadJSON} className="btn-add">
                        Descargar JSON
                    </button>

                    <button onClick={handleOpenFilePicker} className="btn-add">
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

                <button onClick={handleFullReset}>
                    Restaurar sistema
                </button>
            </div>

            <nav className="home__bottom-nav">
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
        </div>
    );
};

export default Home;