const express = require("express");
const app = express();
app.use(express.json());

app.post("/validate-token", (req, res) => {
    let token = req.body.token;

    if (!token || token.length < 10) { // Exemplo de validação simples
        return res.status(400).json({ erro: "Token inválido!" });
    }

    console.log("Validando token:", token);
    res.json({ mensagem: "Token válido!" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
