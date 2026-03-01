import { useState, useEffect } from "react";
import historialData from "../Data/historial_datos.json";
import "./historial.scss";
import { NavLink } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser } from "react-icons/fa";

const Historial = () => {

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem("historial");
    return saved ? JSON.parse(saved) : historialData;
  });

  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    localStorage.setItem("historial", JSON.stringify(members));
  }, [members]);

  const getStatusClass = (status) => {
    switch (status) {
      case "Activo":
        return "Estado Activo";
      case "Inactivo":
        return "Estado Inactivo";
      case "Deshabilitado":
        return "Estado Deshabilitado";
      default:
        return "";
    }
  };

  const handleToggleView = () => {
    if (visibleCount >= members.length) {
      setVisibleCount(6);
    } else {
      setVisibleCount(members.length);
    }
  };

  return (
    <div className="historial">

      <h1 className="historial__title">OikosFlow</h1>

      <section className="historial__table">
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

      <div className="historial__controls">

        <div className="historial__more">
          {members.length > 6 && (
            <button onClick={handleToggleView}>
              {visibleCount >= members.length
                ? "Ver Menos..."
                : "Ver Más..."}
            </button>
          )}
        </div>

        {/* BOTÓN EXISTE PERO NO HACE NADA */}
        <button className="btn btn-add">
          Buscar
        </button>

      </div>

      <nav className="historial__bottom-nav">
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

export default Historial;