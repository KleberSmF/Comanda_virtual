const express = require('express');
const app = express();
const pedidosRouter = require('./routes/pedidos');

app.use(express.json());
app.use('/pedidos', pedidosRouter);

// Rota para validar o token (falta verificar se esta funcionando)
app.post("/validate-token", async (req, res) => {
    let token = req.body.token;

    if (!token || token.length < 10) {
        return res.status(400).json({ erro: "Token inválido!" });
    }

    try {
        let pool = await sql.connect(config);
        let result = await pool.request()
            .input("token", sql.VarChar, token)
            .query("SELECT * FROM Tokens WHERE valor = @token");

        if (result.recordset.length === 0) {
            return res.status(401).json({ erro: "Token não encontrado!" });
        }

        res.json({ mensagem: "Token válido!" });
    } catch (err) {
        console.error("Erro ao conectar ao banco:", err);
        res.status(500).json({ erro: "Erro interno do servidor" });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});