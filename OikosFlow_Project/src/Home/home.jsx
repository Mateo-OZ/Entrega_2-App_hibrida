import { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa"
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import membersData from "../data/home_datos.json";
import "../Home/home.scss"

const Home = () => {
    const [members] = useState(membersData);

    const [visibleCount, setVisibleCount] = useState(6);

    const currenUser = "Tiago";

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
                        <span>{member.name}</span>
                        <span>{member.role}</span>
                        <span className={getStatusClass(member.status)}>
                            {member.status}
                        </span>
                    </div>
                ))}
            </section>

            {/* Ver más */}
            <div className="home__more">
                {members.length > 10 && (
                    <button onClick={handleToggleView}>
                        {visibleCount >= members.length ? "Ver Menos..." : "Ver Mas..."}
                    </button>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="home__bottom-nav">
                <NavLink to="/" end>
                    Home
                </NavLink>

                <NavLink to="/tareas">
                    Tareas
                </NavLink>

                <NavLink to="/historial">
                    Historial
                </NavLink>

                <NavLink to="/perfil">
                    Perfil
                </NavLink>
            </nav>
        </div>
    );
};

export default Home;