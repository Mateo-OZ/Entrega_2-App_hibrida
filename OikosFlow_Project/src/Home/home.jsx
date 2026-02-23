import { useState } from "react";
import { FaBell, FaUserCircle } from "react-icons/fa"
import { NavLink } from "react-router-dom";
import toast from "react-hot-toast";
import "../Home/home.scss"

const Home = () => {
    const [members] = useState([
        { id: 1, name: "Darlene", role: "Dog Trainer", status: "Activo" },
        { id: 2, name: "Ronald", role: "Marketing", status: "Inactivo" },
        { id: 3, name: "Jerome", role: "President", status: "Activo" },
        { id: 4, name: "Robert", role: "Medical", status: "Activo" },
        { id: 5, name: "Bessie", role: "Dog Trainer", status: "Deshabilitado" },
        { id: 6, name: "Mark", role: "Developer", status: "Activo" },
        { id: 7, name: "Angela", role: "Designer", status: "Inactivo" },
        { id: 8, name: "John", role: "Teacher", status: "Activo" },
        { id: 9, name: "Laura", role: "Engineer", status: "Activo" },
        { id: 10, name: "Pedro", role: "Chef", status: "Inactivo" },
        { id: 11, name: "Sofia", role: "Lawyer", status: "Activo" },
        { id: 12, name: "Daniel", role: "Nurse", status: "Activo" },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [taskName, setTaskName] = useState("");

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

                {members.map((member) => (
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
                <button>Ver más...</button>
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