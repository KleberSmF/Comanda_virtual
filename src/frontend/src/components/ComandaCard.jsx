import React from "react";
import { Link } from "react-router-dom";

export default function ComandaCard({ comanda, editar = true }) {
  return (
    <div className="bg-white text-black p-4 rounded shadow">
      <p><strong>Nome:</strong> {comanda.nome}</p>
      <p><strong>Itens:</strong> {comanda.itens.join(", ")}</p>
      <p><strong>{comanda.tipo === "Viagem" ? "Para" : "Mesa"}:</strong> {comanda.tipo}</p>
      <p><strong>Total:</strong> R$ {comanda.total.toFixed(2)}</p>
      {editar && (
        <div className="mt-2 flex gap-2">
          <Link to={`/editar/${comanda.id}`} className="text-gold underline">Editar</Link>
          <Link to="/historico" className="text-red-500 underline">Finalizar</Link>
        </div>
      )}
    </div>
  );
}
