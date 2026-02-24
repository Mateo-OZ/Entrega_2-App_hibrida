import { useState } from "react";
import { useEffect } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa"
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";
import { data, NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import membersData from "../data/home_datos.json";
import { useRef } from "react";
import "../Home/home.scss"

const Home = () => {
    const [members, setMembers] = useState(() => {
        const saved = localStorage.getItem("members");
        return saved ? JSON.parse(saved) : membersData;
    });


    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        localStorage.setItem("members", JSON.stringify(members));
    }, [members]);

    const currenUser = "Tiago";

    const fileInputRef = useRef(null);

    const getStatusClass = (status) => {
        switch (status) {
            case "Activo":
                return "Estado Activo";
            case "Inactivo":
                return "Estado Inactivo";
            case "Deshabilitado":
                return "Estado Deshabilitado";
        };
    };

    const handleToggleView = () => {
        if (visibleCount >= members.length) {
            setVisibleCount(6);
        } else {
            setVisibleCount(members.length);
        }
    };

    const handleDownloadJSON = () => {
        const dataToDownload = localStorage.getItem("members");

        if (!dataToDownload) {
            alert("No hay datos para descargar.");
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

                setMembers(parsedData); // Esto automáticamente guardará en localStorage
                alert("Datos cargados correctamente.");
            } catch (error) {
                alert("El archivo JSON tiene un error de formato.");
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
                        <FaBell />
                        <FaUserCircle />
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
                </div>

                {members.slice(0, visibleCount).map((member) => (
                    <div className="table__row" key={member.id}>
                        <span>{member.id}</span>
                        <span>{member.nombre_encargado}</span>
                        <span>{member.trabajo_a_realizar}</span>
                        <span className={getStatusClass(member.estado)}>
                            {member.estado}
                        </span>
                    </div>
                ))}
            </section>

            <div className="home__controls">
                {/* Ver más */}
                <div className="home__more">
                    {members.length > 10 && (
                        <button onClick={handleToggleView}>
                            {visibleCount >= members.length ? "Ver Menos..." : "Ver Mas..."}
                        </button>
                    )}
                </div>
                {/* Exportar */}
                <div className="home__export-import">
                    <button onClick={handleDownloadJSON} className="btn-secondary">
                        Descargar JSON
                    </button>
                    {/* Importar */}
                    <button onClick={handleOpenFilePicker} className="btn-primary">
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
            </div>

            {/* Bottom Navigation */}
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
        </div >
    );
};

export default Home;