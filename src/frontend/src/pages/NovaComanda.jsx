import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const itensPreDefinidos = [
  { nome: "Cerveja", preco: 10 },
  { nome: "Refrigerante", preco: 6 },
  { nome: "Petisco", preco: 20 },
  { nome: "Água", preco: 4 },
];

const API_URL = "http://localhost:3001/api/comandas";

export default function NovaComanda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("mesa");
  const [observacao, setObservacao] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [itens, setItens] = useState([]);
  const [descontoLiberado, setDescontoLiberado] = useState(false);

  const adicionarItem = (item) => {
    setItens([...itens, item]);
  };

  const removerItem = (index) => {
    const senha = prompt("Digite a senha do administrador:");
    if (senha === "admin123") {
      const novosItens = [...itens];
      novosItens.splice(index, 1);
      setItens(novosItens);
    } else {
      alert("Senha incorreta!");
    }
  };

  const liberarDesconto = () => {
    const senha = prompt("Digite a senha do administrador para aplicar desconto:");
    if (senha === "admin123") {
      setDescontoLiberado(true);
    } else {
      alert("Senha incorreta!");
    }
  };

  const calcularTotal = () => {
    const subtotal = itens.reduce((sum, item) => sum + item.preco, 0);
    return subtotal - (desconto || 0);
  };

  const salvarComanda = () => {
    if (!nome) {
      alert("Por favor, informe um nome para a comanda!");
      return;
    }

    const novaComanda = {
      id: parseInt(id),
      nome,
      tipo,
      observacao,
      desconto: parseFloat(desconto) || 0,
      itens,
      total: calcularTotal(),
      finalizada: false,
      data: new Date().toLocaleString('pt-BR')
    };

    // Salvar ou atualizar comanda
    const comandasAtivas = JSON.parse(localStorage.getItem('comandasAtivas')) || [];
    const index = comandasAtivas.findIndex(c => c.id === novaComanda.id);
    
    if (index >= 0) {
      comandasAtivas[index] = novaComanda;
    } else {
      comandasAtivas.push(novaComanda);
    }
    
    localStorage.setItem('comandasAtivas', JSON.stringify(comandasAtivas));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Nova Comanda #{id}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-yellow-400 mb-1">Nome</label>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Mesa 1, Cliente João"
            />
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">Tipo</label>
            <select
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="mesa">Mesa</option>
              <option value="viagem">Viagem</option>
            </select>
          </div>

          <div>
            <label className="block text-yellow-400 mb-1">Observações</label>
            <textarea
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows="3"
            />
          </div>

          {!descontoLiberado ? (
            <button
              onClick={liberarDesconto}
              className="w-full bg-yellow-400 text-black py-2 rounded font-bold"
            >
              Liberar Desconto (Admin)
            </button>
          ) : (
            <div>
              <label className="block text-yellow-400 mb-1">Desconto (R$)</label>
              <input
                type="number"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                value={desconto}
                onChange={(e) => setDesconto(Math.max(0, parseFloat(e.target.value) || 0))}
                min="0"
                step="0.01"
              />
            </div>
          )}

          <div className="pt-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Itens Disponíveis</h3>
            <div className="grid grid-cols-2 gap-2">
              {itensPreDefinidos.map((item, i) => (
                <button
                  key={i}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded"
                  onClick={() => adicionarItem(item)}
                >
                  <div className="font-medium">{item.nome}</div>
                  <div className="text-sm">R$ {item.preco.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Itens Adicionados</h3>
            {itens.length === 0 ? (
              <p className="text-gray-400">Nenhum item adicionado</p>
            ) : (
              <ul className="space-y-2">
                {itens.map((item, i) => (
                  <li key={i} className="flex justify-between items-center bg-gray-800 p-2 rounded">
                    <div>
                      <span className="font-medium">{item.nome}</span>
                      <span className="text-yellow-400 ml-2">R$ {item.preco.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => removerItem(i)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remover
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <span className="text-lg font-bold">Total:</span>
            <span className="text-2xl font-bold text-yellow-400">
              R$ {calcularTotal().toFixed(2)}
            </span>
          </div>

          <button
            onClick={salvarComanda}
            className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-500 mt-4"
          >
            Salvar Comanda
          </button>
        </div>
      </div>
    </div>
  );
}