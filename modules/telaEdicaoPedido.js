// Rota para editar pedidos
app.put('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    const { cliente, itens, status } = req.body;

    try {
        const query = `
            UPDATE pedidos 
            SET cliente = @cliente, itens = @itens, status = @status 
            WHERE id = @id
        `;

        const request = new sql.Request();
        request.input('id', sql.Int, id);
        request.input('cliente', sql.VarChar, cliente);
        request.input('itens', sql.VarChar, itens);
        request.input('status', sql.VarChar, status);

        await request.query(query);
        res.send('Pedido atualizado com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar pedido:', error);
        res.status(500).send('Erro ao editar pedido');
    }
});
