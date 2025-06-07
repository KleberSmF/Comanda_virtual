import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NovaComanda from "./pages/NovaComanda";
import EditarComanda from "./pages/EditarComanda";
import Historico from "./pages/Historico";

function App() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nova-comanda/:id" element={<NovaComanda />} />
        <Route path="/editar/:id" element={<EditarComanda />} />
        <Route path="/historico" element={<Historico />} />
      </Routes>
    </div>
  );
}

export default App;