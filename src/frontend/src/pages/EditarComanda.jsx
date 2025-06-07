import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from '../assets/logo.jpg';

const API_URL = "http://localhost:3001/api/comandas";

const itensPreDefinidos = [
  { nome: "Cerveja", preco: 10 },
  { nome: "Refrigerante", preco: 6 },
  { nome: "Petisco", preco: 20 },
  { nome: "Água", preco: 4 },
];

export default function EditarComanda() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("mesa");
  const [observacao, setObservacao] = useState("");
  const [desconto, setDesconto] = useState(0);
  const [itens, setItens] = useState([]);
  const [descontoLiberado, setDescontoLiberado] = useState(false);

  useEffect(() => {
    const comandasAtivas = JSON.parse(localStorage.getItem('comandasAtivas')) || [];
    const comanda = comandasAtivas.find(c => c.id === parseInt(id));
    
    if (comanda) {
      setNome(comanda.nome);
      setTipo(comanda.tipo);
      setObservacao(comanda.observacao);
      setItens(comanda.itens);
      setDesconto(comanda.desconto || 0);
      setDescontoLiberado(comanda.desconto > 0);
    } else {
      alert("Comanda não encontrada!");
      navigate("/");
    }
  }, [id, navigate]);

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

  const gerarRecibo = () => {
    return `
      ==============================
      CONCHARQUE COMEDORIA
      ==============================
      Comanda: ${nome}
      Tipo: ${tipo === 'mesa' ? 'Mesa' : 'Viagem'}
      Data: ${new Date().toLocaleString('pt-BR')}
      ==============================
      ITENS:
      ${itens.map(item => `- ${item.nome.padEnd(15)} R$ ${item.preco.toFixed(2)}`).join('\n      ')}
      ==============================
      Subtotal: R$ ${itens.reduce((sum, item) => sum + item.preco, 0).toFixed(2)}
      Desconto: R$ ${(desconto || 0).toFixed(2)}
      TOTAL: R$ ${calcularTotal().toFixed(2)}
      ==============================
      Obrigado pela preferência!
    `;
  };

const imprimirComanda = (comanda) => {
  const recibo = gerarRecibo(comanda);
  const janela = window.open('', '_blank');
  
  janela.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Recibo Comanda ${comanda.id}</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          font-size: 14px;
          padding: 20px;
          max-width: 400px;
          margin: 0 auto;
        }
        .logo-container {
          text-align: center;
          margin-bottom: 15px;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        pre {
          white-space: pre-wrap;
          line-height: 1.4;
        }
        .divider {
          border-top: 1px dashed #000;
          margin: 10px 0;
        }
        .total {
          font-weight: bold;
          font-size: 16px;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="logo-container">
        <img src="${logo}" alt="Logo Concharque" class="logo" />
      </div>
      <pre>${recibo}</pre>
      <div class="divider"></div>
      <p class="no-print" style="text-align: center; color: #888; font-size: 12px;">
        Sistema de Comandas Concharque
      </p>
      <script>
        setTimeout(() => {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        }, 300);
      </script>
    </body>
    </html>
  `);
  janela.document.close();
};

  const salvarEdicao = () => {
    const comandaAtualizada = {
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

    const comandasAtivas = JSON.parse(localStorage.getItem('comandasAtivas')) || [];
    const index = comandasAtivas.findIndex(c => c.id === comandaAtualizada.id);
    
    if (index >= 0) {
      comandasAtivas[index] = comandaAtualizada;
      localStorage.setItem('comandasAtivas', JSON.stringify(comandasAtivas));
      navigate("/");
    } else {
      alert("Erro ao salvar comanda!");
    }
  };

  const finalizarComanda = () => {
    if (!confirm("Tem certeza que deseja finalizar esta comanda?")) return;

    const comandaFinalizada = {
      id: parseInt(id),
      nome,
      tipo,
      observacao,
      desconto: parseFloat(desconto) || 0,
      itens,
      total: calcularTotal(),
      finalizada: true,
      data: new Date().toLocaleString('pt-BR')
    };

    // Adicionar ao histórico
    const historico = JSON.parse(localStorage.getItem('historicoComandas')) || [];
    historico.push(comandaFinalizada);
    localStorage.setItem('historicoComandas', JSON.stringify(historico));
    
    // Remover das ativas
    const comandasAtivas = JSON.parse(localStorage.getItem('comandasAtivas')) || [];
    const novasComandas = comandasAtivas.filter(c => c.id !== parseInt(id));
    localStorage.setItem('comandasAtivas', JSON.stringify(novasComandas));

    // Imprimir recibo
    imprimirComanda();

    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6 text-center">Editar Comanda #{id}</h2>

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
              placeholder="Alergias, preferências, etc."
            />
          </div>

          {!descontoLiberado ? (
            <button
              onClick={liberarDesconto}
              className="w-full bg-yellow-400 text-black py-2 rounded font-bold hover:bg-yellow-500"
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
                placeholder="Valor do desconto"
              />
            </div>
          )}

          <div className="pt-4">
            <h3 className="text-xl font-bold text-yellow-400 mb-2">Itens Disponíveis</h3>
            <div className="grid grid-cols-2 gap-2">
              {itensPreDefinidos.map((item, i) => (
                <button
                  key={i}
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded flex flex-col items-center"
                  onClick={() => adicionarItem(item)}
                >
                  <span className="font-medium">{item.nome}</span>
                  <span className="text-white -400 text-sm">R$ {item.preco.toFixed(2)}</span>
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
                  <li key={i} className="flex justify-between items-center bg-gray-800 p-3 rounded">
                    <div>
                      <span className="font-medium">{item.nome}</span>
                      <span className="text-yellow-400 ml-2">R$ {item.preco.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => removerItem(i)}
                      className="text-red-400 hover:text-red-300 font-bold text-lg"
                    >
                      ×
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

          <div className="grid grid-cols-3 gap-4 mt-6">
            <button
              onClick={salvarEdicao}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-bold transition"
            >
              Salvar
            </button>
            <button
              onClick={imprimirComanda}
              className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-bold transition"
            >
              Imprimir
            </button>
            <button
              onClick={finalizarComanda}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold transition"
            >
              Finalizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}