import { useState, useEffect } from "react";
import tareasData from "../data/tareas_datos.json";
import "../Tarea/tarea.scss";
import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";

const Tareas = () => {
    const usuarioActivo =
        localStorage.getItem("usuarioActivo") || "Tiago";

    const [tareas, setTareas] = useState(() => {
        const saved = localStorage.removeItem("tareas");
        return saved ? JSON.parse(saved) : tareasData;
    });

    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }, [tareas]);

    const tareasDelUsuario = tareas.filter(
        (tarea) => tarea.nombre_encargado === usuarioActivo
    );

    return (
        <div className="tareas">
            <h1 className="tareas__title">OikosFlow</h1>

            <h2 className="tareas__subtitle">
                Tareas de {usuarioActivo}
            </h2>

            <div className="tareas__table">
                <div className="table__header">
                    <span>#</span>
                    <span>Nombre Encargado</span>
                    <span>Trabajo a Realizar</span>
                    <span>Estado</span>
                </div>

                {tareasDelUsuario.map((tarea) => (
                    <div className="table__row" key={tarea.id}>
                        <span>{tarea.id}</span>
                        <span>{tarea.nombre_encargado}</span>
                        <span>{tarea.trabajo_a_realizar}</span>
                        <span className={`estado ${tarea.estado.toLowerCase()}`}>
                            {tarea.estado}
                        </span>
                    </div>
                ))}
            </div>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
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

export default Tareas;