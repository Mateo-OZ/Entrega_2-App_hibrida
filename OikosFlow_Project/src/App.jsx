import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./Home/home.jsx";
import Tarea from "./Tarea/tarea.jsx";
import Historial from "./Historial/historial.jsx";
import './App.css'

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        gutter={12}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#ffffff",
            color: "#2c2c2c",
            padding: "16px 24px",
            borderRadius: "16px",
            fontSize: "15px",
            fontWeight: "500",
            minWidth: "320px",
            textAlign: "center",
            boxShadow: "0 8px 20px rgba(0,0,0,0.12)"
          },
          success: {
            iconTheme: {
              primary: "#22c55e",   // Verde moderno
              secondary: "#ffffff"
            }
          },
          error: {
            iconTheme: {
              primary: "#ef4444",   // Rojo moderno
              secondary: "#ffffff"
            }
          }
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/tareas" element={<Tarea />} />
        <Route path="/historial" element={<Historial />} />
      </Routes>
    </>
  );
}

export default App;
