import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Inicializa o localStorage se estiver vazio
if (!localStorage.getItem('comandasAtivas')) {
  localStorage.setItem('comandasAtivas', JSON.stringify([]));
}

if (!localStorage.getItem('historicoComandas')) {
  localStorage.setItem('historicoComandas', JSON.stringify([]));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);