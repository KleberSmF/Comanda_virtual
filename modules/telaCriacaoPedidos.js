// Middleware para processar JSON
app.use(express.json());

// Rota para criar um novo pedido
app.post('/pedidos', async (req, res) => {
    const { cliente, itens, PedidoStatus } = req.body;

    try {
        const query = `
            INSERT INTO pedidos (cliente, itens, status) 
            VALUES (@cliente, @itens, @status)
        `;

        const request = new sql.Request();
        request.input('cliente', sql.VarChar, cliente);
        request.input('itens', sql.VarChar, itens);
        request.input('PedidoStatus', sql.VarChar, PedidoStatus);

        await request.query(query);
        res.send('Pedido criado com sucesso!');
    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).send('Erro ao criar pedido');
    }
});
