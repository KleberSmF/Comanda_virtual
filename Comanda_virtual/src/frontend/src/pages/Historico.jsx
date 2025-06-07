import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../src/assets/logo.jpg';

const API_URL = "http://localhost:3001/api/historico";

export default function Historico() {
  const navigate = useNavigate();
  const [comandas, setComandas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = () => {
    try {
      const historicoSalvo = localStorage.getItem('historicoComandas');
      if (historicoSalvo) {
        const historico = JSON.parse(historicoSalvo);
        
        if (Array.isArray(historico)) {
          const historicoValido = historico.filter(item => 
            item && 
            typeof item === 'object' && 
            item.itens && 
            Array.isArray(item.itens)
          );
          
          setComandas(historicoValido.reverse()); // Mostra as mais recentes primeiro
        } else {
          console.error("Formato inválido do histórico");
          setComandas([]);
        }
      } else {
        setComandas([]);
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      setComandas([]);
    } finally {
      setCarregando(false);
    }
  };

  const limparHistorico = () => {
    if (window.confirm("Tem certeza que deseja limpar TODO o histórico de comandas?\nEsta ação não pode ser desfeita.")) {
      localStorage.setItem('historicoComandas', JSON.stringify([]));
      setComandas([]);
      alert("Histórico limpo com sucesso!");
    }
  };

  const comandasFiltradas = comandas.filter(comanda => {
    if (!comanda || !comanda.nome) return false;
    
    const termo = filtro.toLowerCase();
    return (
      comanda.nome.toLowerCase().includes(termo) ||
      (comanda.data && comanda.data.toLowerCase().includes(termo)) ||
      (comanda.itens && comanda.itens.some(item => 
        item.nome && item.nome.toLowerCase().includes(termo)
      ))
    );
  });

  const imprimirComanda = (comanda) => {
    if (!comanda) return;
    
    const recibo = `
      ==============================
      CONCHARQUE COMEDORIA
      ==============================
      Comanda: ${comanda.nome || 'N/A'}
      Tipo: ${comanda.tipo === 'mesa' ? 'Mesa' : comanda.tipo || 'Viagem'}
      Data: ${comanda.data || new Date().toLocaleString('pt-BR')}
      ==============================
      ITENS:
      ${comanda.itens ? comanda.itens.map(item => 
        `- ${(item.nome || 'Item sem nome').padEnd(20)} R$ ${(item.preco || 0).toFixed(2)}`
      ).join('\n') : 'Nenhum item registrado'}
      ==============================
      Subtotal: R$ ${comanda.itens ? comanda.itens.reduce((sum, item) => sum + (item.preco || 0), 0).toFixed(2) : '0.00'}
      Desconto: R$ ${(comanda.desconto || 0).toFixed(2)}
      TOTAL: R$ ${(comanda.total || (comanda.itens ? 
        comanda.itens.reduce((sum, item) => sum + (item.preco || 0), 0) - (comanda.desconto || 0) : 0)).toFixed(2)}
      ==============================
      Obrigado pela preferência!
    `;

    const janela = window.open('', '_blank');
    janela.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Recibo Comanda ${comanda.id || ''}</title>
        <style>
          body { font-family: monospace; font-size: 14px; padding: 20px; }
          pre { white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <pre>${recibo}</pre>
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 200);
          }
        </script>
      </body>
      </html>
    `);
    janela.document.close();
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-400 text-xl">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-yellow-400">Histórico de Comandas</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate("/")}
              className="border border-yellow-400 text-yellow-400 px-4 py-2 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              Voltar para Home
            </button>
            {comandas.length > 0 && (
              <button
                onClick={limparHistorico}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
              >
                Limpar Histórico
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Filtrar por nome, data ou item..."
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        {comandasFiltradas.length === 0 ? (
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <p className="text-gray-400">
              {filtro ? "Nenhuma comanda encontrada com este filtro" : "Nenhuma comanda no histórico"}
            </p>
            {comandas.length > 0 && filtro && (
              <button
                onClick={() => setFiltro("")}
                className="text-yellow-400 hover:underline mt-2"
              >
                Limpar filtro
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {comandasFiltradas.map((comanda, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-lg text-yellow-400">
                      {comanda.nome || "Comanda sem nome"}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {comanda.data || "Data não disponível"}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    comanda.tipo === 'mesa' ? 'bg-blue-500' : 'bg-green-500'
                  }`}>
                    {comanda.tipo === 'mesa' ? 'Mesa' : 'Viagem'}
                  </span>
                </div>
                
                <ul className="mb-3 divide-y divide-gray-700">
                  {comanda.itens && comanda.itens.map((item, i) => (
                    <li key={i} className="flex justify-between py-2">
                      <span>{item.nome || "Item sem nome"}</span>
                      <span>R$ {(item.preco || 0).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <div>
                    {comanda.desconto > 0 && (
                      <p className="text-sm">
                        <span className="text-gray-400">Desconto: </span>
                        <span className="text-red-400">- R$ {(comanda.desconto || 0).toFixed(2)}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      Subtotal: R$ {comanda.itens ? 
                        comanda.itens.reduce((sum, item) => sum + (item.preco || 0), 0).toFixed(2) : 
                        "0.00"}
                    </p>
                    <p className="text-lg font-bold text-yellow-400">
                      Total: R$ {(comanda.total || 
                        (comanda.itens ? 
                          comanda.itens.reduce((sum, item) => sum + (item.preco || 0), 0) - (comanda.desconto || 0) : 
                          0)).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => imprimirComanda(comanda)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Imprimir Recibo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}