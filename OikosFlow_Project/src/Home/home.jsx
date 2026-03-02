import { useState } from "react";
import { useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa"
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import { data, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import tareasData from "../data/datos_tareas_unificados.json";
import usuariosData from "../data/usuarios.json";
import { useRef } from "react";
import "../Home/home.scss"

const Home = () => {

    const navigate = useNavigate();

    const handleFullReset = () => {
        localStorage.clear();
        setTareas(tareasData); // Reset a datos originales
        setUsuarios(usuariosData); // Reset a datos originales
        window.location.reload();
    };

    const [members, setMembers] = useState(() => {
        const saved = localStorage.getItem("members");
        return saved ? JSON.parse(saved) : membersData;
    });

    const [visibleCount, setVisibleCount] = useState(6);

    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.getItem("tareas");
        return saved ? JSON.parse(saved) : tareasData;
    });

    const getNombreUsuario = (id_usuario) => {
        const usuario = usuarios.find(u => u.id === id_usuario);
        return usuario ? usuario.nombre_completo : "Usuario no encontrado";
    };

    const [usuarios, setUsuarios] = useState(() => {
        const saved = localStorage.getItem("usuarios");
        return saved ? JSON.parse(saved) : usuariosData;
    });

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

    const handleToggleView = () => {
        if (visibleCount >= members.length) {
            setVisibleCount(6);
        } else {
            setVisibleCount(members.length);
        }
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
        link.download = "home_backup.json";
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
                toast.success("Datos cargados correctamente");
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

            {/*Table*/}
            <section className="home__table">
                <div className="table__header">
                    <span>#</span>
                    <span>Nombre Encargado</span>
                    <span>Trabajo a Realizar</span>
                    <span>Estado</span>
                    <span>Categoría</span>
                </div>

                {tareas.slice(0, visibleCount).map((tarea) => (
                    <div className="table__row" key={tarea.id}>
                        <span>{tarea.id}</span>
                        <span>{getNombreUsuario(tarea.id_usuario)}</span>
                        <span>{tarea.trabajo_a_realizar}</span>
                        <span className={getStatusClass(tarea.estado)}>
                            {tarea.estado}
                        </span>
                        <span>{tarea.version || "General"}</span> {/* Mostrar la categoría */}
                    </div>
                ))}
            </section>

            <div className="home__controls">
                <div className="home__more">
                    {members.length > 10 && (
                        <button onClick={handleToggleView}>
                            {visibleCount >= members.length ? "Ver Menos..." : "Ver Mas..."}
                        </button>
                    )}
                </div>

                <div className="home__export-import">
                    <button onClick={handleDownloadJSON} className="btn btn-add">
                        Descargar JSON
                    </button>

                    <button onClick={handleOpenFilePicker} className="btn btn-add">
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