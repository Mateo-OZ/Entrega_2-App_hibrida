import { useState } from "react";
import "./notificaciones.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaTasks, FaHistory, FaUser, FaArrowLeft } from "react-icons/fa";

const Notificaciones = () => {

  const navigate = useNavigate();

  const [notificaciones] = useState(() => {
    const stored = localStorage.getItem("notificaciones");
    return stored ? JSON.parse(stored) : [];
  });

  //Función que calcula cuánto tiempo ha pasado desde que se creó la notificación
  //Recibe una fecha y devuelve un texto como: "Hace 5 minutos"
  const tiempoRelativo = (fechaISO) => {
    const ahora = new Date();
    const fecha = new Date(fechaISO);
    const diff = Math.floor((ahora - fecha) / 1000);

    if (diff < 60) return `Hace ${diff} segundos`;
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;

    return `Hace ${Math.floor(diff / 86400)} días`;
  };

  return (
    <div className="notificaciones">

      <header className="notificaciones__header">
        {/* Botón que redirige al home */}
        <button
          className="notificaciones__back"
          onClick={() => navigate("/home")}
        >
          <FaArrowLeft />
        </button>
        <h1 className="notificaciones__title">OikosFlow</h1>
      </header>

      {/* Si no hay notificaciones, muestra un mensaje informativo */}
      <div className="notificaciones__list">
        {notificaciones.length === 0 ? (
          <p className="notificaciones__empty">
            No tienes notificaciones.
          </p>
        ) : (
          // Si existen notificaciones, las recorre con map()
          // y crea una tarjeta por cada una mostrando mensaje y tiempo
          notificaciones.map((n) => (
            <div key={n.id} className="notificaciones__card">
              <p>{n.mensaje}</p>
              <span className="notificaciones__time">
                {tiempoRelativo(n.fecha)}
              </span>
            </div>
          ))
        )}
      </div>

      <nav className="notificaciones__bottom-nav">
        <NavLink to="/home">
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

export default Notificaciones;