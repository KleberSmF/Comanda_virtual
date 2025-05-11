const express = require('express');
const sql = require('mssql');

const app = express();
const port = 3000;

// Configuração do banco de dados SQL Server
const dbConfig = {
    user: 'seu_usuario',
    password: 'sua_senha',
    server: 'seu_servidor',
    database: 'seu_banco_de_dados',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Conectar ao banco de dados
sql.connect(dbConfig).then(() => {
    console.log('Conectado ao SQL Server');
}).catch(err => {
    console.error('Erro ao conectar ao SQL Server:', err);
});

// Rota para obter pedidos
app.get('/pedidos', async (req, res) => {
    try {
        const result = await sql.query('SELECT id, cliente, itens, status FROM pedidos ORDER BY id DESC');
        res.json(result.recordset);
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        res.status(500).send('Erro ao obter pedidos');
    }
});

// Iniciar o servidor, inserir porta!!!!
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
