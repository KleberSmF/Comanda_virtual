const db = require('../config/database');

class Comanda {
  static async create({ nome, tipo, observacao, desconto, itens, usuarioId }) {
    const total = itens.reduce((sum, item) => sum + item.preco, 0) - (desconto || 0);
    const itensJSON = JSON.stringify(itens);
    
    const [result] = await db.execute(
      `INSERT INTO comandas 
       (nome, tipo, observacao, desconto, itens, total, usuario_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, 'aberta')`,
      [nome, tipo, observacao, desconto, itensJSON, total, usuarioId]
    );
    
    return this.findById(result.insertId);
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM comandas WHERE id = ?', 
      [id]
    );
    if (rows.length === 0) return null;
    
    const comanda = rows[0];
    comanda.itens = JSON.parse(comanda.itens);
    return comanda;
  }

  static async update(id, { nome, tipo, observacao, desconto, itens }) {
    const total = itens.reduce((sum, item) => sum + item.preco, 0) - (desconto || 0);
    const itensJSON = JSON.stringify(itens);
    
    await db.execute(
      `UPDATE comandas SET 
       nome = ?, tipo = ?, observacao = ?, desconto = ?, itens = ?, total = ?
       WHERE id = ?`,
      [nome, tipo, observacao, desconto, itensJSON, total, id]
    );
    
    return this.findById(id);
  }

  static async close(id) {
    await db.execute(
      `UPDATE comandas SET 
       status = 'fechada', data_fechamento = NOW()
       WHERE id = ?`,
      [id]
    );
    
    return this.findById(id);
  }

  static async findAllActive() {
    const [rows] = await db.execute(
      "SELECT * FROM comandas WHERE status = 'aberta' ORDER BY data_abertura DESC"
    );
    
    return rows.map(row => ({
      ...row,
      itens: JSON.parse(row.itens)
    }));
  }

  static async findByPeriod(startDate, endDate) {
    const [rows] = await db.execute(
      `SELECT * FROM comandas 
       WHERE data_abertura BETWEEN ? AND ?
       ORDER BY data_abertura DESC`,
      [startDate, endDate]
    );
    
    return rows.map(row => ({
      ...row,
      itens: JSON.parse(row.itens)
    }));
  }
}

module.exports = Comanda;