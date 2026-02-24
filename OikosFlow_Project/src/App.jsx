import { Routes, Route } from "react-router-dom";
import Home from "./Home/home.jsx";
import Tarea from "./Tarea/tarea.jsx";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/tareas" element={<Tarea />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

export default App;
