import { useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import "./toast-prueba-tareas.scss";

const ToastPruebaTareas = () => {
    const [loadingToastId, setLoadingToastId] = useState(null);

    // Toast básicos
    const mostrarExito = () => {
        toast.success("¡Tarea completada con éxito! 🎉");
    };

    const mostrarError = () => {
        toast.error("No se pudo completar la tarea");
    };

    const mostrarInfo = () => {
        toast("Información importante", {
            icon: 'ℹ️',
        });
    };

    const mostrarAdvertencia = () => {
        toast("Revisa los datos ingresados", {
            icon: '⚠️',
        });
    };

    // Toast con promesa
    const promesaTarea = () => {
        const promesa = new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: "Tarea guardada en base de datos" });
            }, 2000);
        });

        toast.promise(
            promesa,
            {
                loading: 'Guardando tarea...',
                success: '¡Tarea guardada correctamente!',
                error: 'Error al guardar',
            },
            {
                style: {},
                success: {
                    duration: 3000,
                    icon: '✅',
                },
            }
        );
    };

    // Toast con carga personalizada
    const cargarPersonalizada = () => {
        const id = toast.loading('Cargando tareas...');

        setTimeout(() => {
            toast.success('Tareas cargadas exitosamente', { id });
        }, 2000);
    };

    // Toast con diferentes duraciones
    const duracionLarga = () => {
        toast.success('Este mensaje dura 5 segundos', {
            duration: 5000,
            icon: '⏱️',
        });
    };

    const duracionCorta = () => {
        toast.success('Mensaje rápido (1.5s)', {
            duration: 1500,
            icon: '⚡',
        });
    };

    // Toast personalizado con acciones
    const toastConAccion = () => {
        toast((t) => (
            <div className="toast-personalizado">
                <span>¿Deseas continuar con esta acción?</span>
                <div className="toast-acciones">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn-toast-confirmar"
                    >
                        Sí
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="btn-toast-cancelar"
                    >
                        No
                    </button>
                </div>
            </div>
        ), {
            duration: 8000,
            position: 'top-center',
        });
    };

    // Toast con posición personalizada
    const posicionPersonalizada = (posicion) => {
        toast.success(`Toast en ${posicion}`, {
            position: posicion,
            icon: '📍',
        });
    };

    // Toast con tema oscuro/claro
    const toastConTema = () => {
        toast.success('Toast con estilo mejorado', {
            style: {
                border: '2px solid #2C5F8A',
                padding: '16px',
                color: '#1A2B3C',
                backgroundColor: '#F5F8FA',
                borderRadius: '20px',
            },
            iconTheme: {
                primary: '#2C5F8A',
                secondary: '#FFFFFF',
            },
        });
    };

    // Toast de múltiples líneas
    const toastMultilinea = () => {
        toast(
            <div className="toast-multilinea">
                <strong>Detalles de la tarea:</strong>
                <p>- Revisar documentación</p>
                <p>- Actualizar estado</p>
                <p>- Notificar al equipo</p>
            </div>,
            {
                duration: 6000,
                icon: '📋',
                style: {
                    maxWidth: '350px',
                }
            }
        );
    };

    // Toast en cadena
    const toastEnCadena = () => {
        toast.success('Primera notificación');

        setTimeout(() => {
            toast.success('Segunda notificación', {
                icon: '2️⃣',
            });
        }, 1000);

        setTimeout(() => {
            toast.success('Tercera notificación', {
                icon: '3️⃣',
            });
        }, 2000);
    };

    // Toast interactivo
    const toastInteractivo = () => {
        const toastId = toast.loading('Procesando tarea...');

        setTimeout(() => {
            toast.success('Tarea procesada', {
                id: toastId,
                icon: '✨',
            });

            setTimeout(() => {
                toast('Recordatorio: Revisar pendientes', {
                    icon: '🔔',
                    duration: 4000,
                });
            }, 1500);
        }, 2000);
    };

    // Toast con emojis personalizados
    const toastEmojis = () => {
        toast.success('¡Excelente trabajo!', { icon: '🌟' });
        toast.success('Meta alcanzada', { icon: '🎯' });
        toast.success('Nuevo logro', { icon: '🏆' });
    };

    return (
        <div className="toast-prueba-container">
            <h1 className="toast-prueba-title">🧪 Laboratorio de Toasts</h1>
            <p className="toast-prueba-subtitle">Pruebas para el componente Tareas</p>

            <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                    className: '',
                    duration: 3000,
                    style: {
                        background: '#FFFFFF',
                        color: '#1A2B3C',
                    },
                }}
            />

            <div className="toast-grid">
                {/* Sección Básicos */}
                <div className="toast-section">
                    <h2>Básicos</h2>
                    <div className="toast-buttons">
                        <button onClick={mostrarExito} className="btn-exito">
                            Éxito
                        </button>
                        <button onClick={mostrarError} className="btn-error">
                            Error
                        </button>
                        <button onClick={mostrarInfo} className="btn-info">
                            Info
                        </button>
                        <button onClick={mostrarAdvertencia} className="btn-warning">
                            Advertencia
                        </button>
                    </div>
                </div>

                {/* Sección Promesas y Carga */}
                <div className="toast-section">
                    <h2>Promesas y Carga</h2>
                    <div className="toast-buttons">
                        <button onClick={promesaTarea} className="btn-promesa">
                            Promesa
                        </button>
                        <button onClick={cargarPersonalizada} className="btn-carga">
                            Carga
                        </button>
                        <button onClick={toastInteractivo} className="btn-interactivo">
                            Interactivo
                        </button>
                    </div>
                </div>

                {/* Sección Duración */}
                <div className="toast-section">
                    <h2>Duración</h2>
                    <div className="toast-buttons">
                        <button onClick={duracionCorta} className="btn-corta">
                            Corta (1.5s)
                        </button>
                        <button onClick={duracionLarga} className="btn-larga">
                            Larga (5s)
                        </button>
                    </div>
                </div>

                {/* Sección Posiciones */}
                <div className="toast-section">
                    <h2>Posiciones</h2>
                    <div className="toast-buttons">
                        <button onClick={() => posicionPersonalizada('top-left')} className="btn-posicion">
                            Top Left
                        </button>
                        <button onClick={() => posicionPersonalizada('top-center')} className="btn-posicion">
                            Top Center
                        </button>
                        <button onClick={() => posicionPersonalizada('top-right')} className="btn-posicion">
                            Top Right
                        </button>
                        <button onClick={() => posicionPersonalizada('bottom-left')} className="btn-posicion">
                            Bottom Left
                        </button>
                        <button onClick={() => posicionPersonalizada('bottom-center')} className="btn-posicion">
                            Bottom Center
                        </button>
                        <button onClick={() => posicionPersonalizada('bottom-right')} className="btn-posicion">
                            Bottom Right
                        </button>
                    </div>
                </div>

                {/* Sección Personalizados */}
                <div className="toast-section">
                    <h2>Personalizados</h2>
                    <div className="toast-buttons">
                        <button onClick={toastConTema} className="btn-tema">
                            Con Tema
                        </button>
                        <button onClick={toastMultilinea} className="btn-multilinea">
                            Multilínea
                        </button>
                        <button onClick={toastConAccion} className="btn-accion">
                            Con Acción
                        </button>
                        <button onClick={toastEmojis} className="btn-emojis">
                            Emojis
                        </button>
                    </div>
                </div>

                {/* Sección Efectos */}
                <div className="toast-section">
                    <h2>Efectos</h2>
                    <div className="toast-buttons">
                        <button onClick={toastEnCadena} className="btn-cadena">
                            En Cadena
                        </button>
                    </div>
                </div>
            </div>

            {/* Información adicional */}
            <div className="toast-info-box">
                <h3>📝 Notas para implementar en Tareas:</h3>
                <ul>
                    <li>Usar <code>toast.success()</code> para tareas completadas</li>
                    <li>Usar <code>toast.error()</code> para errores</li>
                    <li>Usar <code>toast()</code> con iconos para notificaciones generales</li>
                    <li>Considerar duraciones: 3000ms para éxito, 4000ms para advertencias</li>
                    <li>Mantener posición top-right para consistencia</li>
                </ul>
            </div>
        </div>
    );
};

export default ToastPruebaTareas;