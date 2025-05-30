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
