// components/ThemeSelector.jsx (mejorado)
import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaPalette, FaPaintBrush } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";

const ThemeSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, setTheme } = useTheme();

    const [mode, color] = theme.split("-");

    // Cerrar al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.theme-selector')) {
                setIsOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleModeChange = (newMode) => {
        const nextTheme = `${newMode}-${color}`;
        setTheme(nextTheme);
    };

    const handleColorChange = (newColor) => {
        const nextTheme = `${mode}-${newColor}`;
        setTheme(nextTheme);
    };

    const colors = [
        { id: "blue", name: "Azul", class: "theme-color-blue" },
        { id: "green", name: "Verde", class: "theme-color-green" },
        { id: "orange", name: "Naranja", class: "theme-color-orange" },
    ];

    return (
        <div className={`theme-selector ${isOpen ? "theme-selector--open" : ""}`}>
            <button
                className="theme-selector__toggle"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                aria-label="Selector de tema"
            >
                <FaPaintBrush />
                <span className="theme-selector__toggle-text">Personalizar</span>
            </button>

            {isOpen && (
                <div className="theme-selector__dropdown" onClick={(e) => e.stopPropagation()}>
                    <div className="theme-selector__header">
                        <FaPalette className="theme-selector__header-icon" />
                        <h3>Personalizar tema</h3>
                    </div>

                    <div className="theme-selector__section">
                        <h4 className="theme-selector__title">Modo</h4>
                        <div className="theme-selector__mode-buttons">
                            <button
                                className={`theme-selector__mode-btn ${mode === "light" ? "active" : ""}`}
                                onClick={() => handleModeChange("light")}
                            >
                                <FaSun /> Claro
                            </button>
                            <button
                                className={`theme-selector__mode-btn ${mode === "dark" ? "active" : ""}`}
                                onClick={() => handleModeChange("dark")}
                            >
                                <FaMoon /> Oscuro
                            </button>
                        </div>
                    </div>

                    <div className="theme-selector__section">
                        <h4 className="theme-selector__title">Color principal</h4>
                        <div className="theme-selector__color-buttons">
                            {colors.map((c) => (
                                <button
                                    key={c.id}
                                    className={`theme-selector__color-btn ${c.class} ${color === c.id ? "active" : ""}`}
                                    onClick={() => handleColorChange(c.id)}
                                >
                                    <span className="theme-selector__color-dot" />
                                    <span className="theme-selector__color-name">{c.name}</span>
                                    {color === c.id && <span className="theme-selector__color-check">✓</span>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ThemeSelector;