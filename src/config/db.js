const express = require("express");
const sql = require("mssql");

const app = express();
app.use(express.json());

// Configuração do SQL Server
const config = {
    user: "seu_usuario",
    password: "sua_senha",
    server: "localhost", // Ou o nome do servidor
    database: "ComandaVirtual",
    options: {
        encrypt: true, // Se necessário
        trustServerCertificate: true
    }
};

// Conectar ao banco de dados
sql.connect(dbConfig).then(() => {
    console.log('Conectado ao SQL Server');
}).catch(err => {
    console.error('Erro ao conectar ao SQL Server:', err);
});