import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../../src/assets/logo.jpg' // Ajuste o caminho conforme sua estrutura de arquivos

const API_URL = "http://localhost:3001/api/comandas";

export default function Home() {
  const navigate = useNavigate();
  const [comandasAtivas, setComandasAtivas] = useState([]);

  useEffect(() => {
    const carregarComandas = () => {
      const comandas = JSON.parse(localStorage.getItem('comandasAtivas')) || [];
      setComandasAtivas(comandas);
    };
    carregarComandas();
  }, []);

  const criarComanda = () => {
    const novaComandaId = Math.floor(Math.random() * 10000);
    navigate(`/nova-comanda/${novaComandaId}`);
  };

  const imprimirComanda = (comanda) => {
    const recibo = gerarRecibo(comanda);
    abrirJanelaImpressao(recibo);
  };

  const finalizarComanda = (id) => {
    const comanda = comandasAtivas.find(c => c.id === id);
    if (comanda) {
      // Adiciona ao histórico
      const historico = JSON.parse(localStorage.getItem('historicoComandas')) || [];
      const comandaFinalizada = {
        ...comanda,
        finalizada: true,
        data: new Date().toLocaleString('pt-BR')
      };
      historico.push(comandaFinalizada);
      localStorage.setItem('historicoComandas', JSON.stringify(historico));
      
      // Remove das ativas
      const novasComandas = comandasAtivas.filter(c => c.id !== id);
      setComandasAtivas(novasComandas);
      localStorage.setItem('comandasAtivas', JSON.stringify(novasComandas));

      // Imprime o recibo
      const recibo = gerarRecibo(comandaFinalizada);
      abrirJanelaImpressao(recibo);
    }
  };

  const gerarRecibo = (comanda) => {
    return `
      ==============================
      CONCHARQUE COMEDORIA
      ==============================
      Comanda: ${comanda.nome}
      Tipo: ${comanda.tipo === 'mesa' ? 'Mesa' : 'Viagem'}
      Data: ${comanda.data || new Date().toLocaleString('pt-BR')}
      ==============================
      ITENS:
      ${comanda.itens.map(item => `- ${item.nome.padEnd(15)} R$ ${item.preco.toFixed(2)}`).join('\n      ')}
      ==============================
      Subtotal: R$ ${comanda.itens.reduce((sum, item) => sum + item.preco, 0).toFixed(2)}
      Desconto: R$ ${(comanda.desconto || 0).toFixed(2)}
      TOTAL: R$ ${comanda.total.toFixed(2)}
      ==============================
      Obrigado pela preferência!
    `;
  };

const abrirJanelaImpressao = (conteudo) => {
  const janela = window.open('', '_blank');
  
  janela.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Recibo Comanda</title>
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
      <pre>${conteudo}</pre>
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
  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Container da logo e título */}
      <div className="flex flex-col items-center mb-8">
        <img 
          src={logo} 
          alt="Logo Concharque" 
          className="w-60 h-60 object-contain mb-4" // Ajuste o tamanho conforme necessário
        />
        <h1 className="text-4xl font-bold text-yellow-400">Concharque Comandas</h1>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md mx-auto mb-8">
        <button
          onClick={criarComanda}
          className="bg-yellow-400 text-black px-6 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-500 transition"
        >
          Criar Nova Comanda
        </button>

        <button
          onClick={() => navigate("/historico")}
          className="border-2 border-yellow-400 text-yellow-400 px-6 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-black transition"
        >
          Ver Histórico
        </button>
      </div>

      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Comandas Ativas</h2>
        
        {comandasAtivas.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhuma comanda ativa</p>
        ) : (
          <div className="space-y-4">
            {comandasAtivas.map((comanda) => (
              <div key={comanda.id} className="bg-gray-800 p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-yellow-400">{comanda.nome}</h3>
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm">
                    {comanda.tipo === 'mesa' ? 'Mesa' : 'Viagem'}
                  </span>
                </div>
                
                <ul className="mb-3">
                  {comanda.itens.map((item, i) => (
                    <li key={i} className="flex justify-between py-1 text-sm border-b border-gray-700">
                      <span>{item.nome}</span>
                      <span>R$ {item.preco.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="font-bold text-lg">Total: R$ {comanda.total.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/editar/${comanda.id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => imprimirComanda(comanda)}
                      className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Imprimir
                    </button>
                    <button
                      onClick={() => finalizarComanda(comanda.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Finalizar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}