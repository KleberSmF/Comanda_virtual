const express = require('express');
const cors = require('cors');
const { PORT, FRONTEND_URL } = require('./config');
const routes = require('./routes');

const app = express();

// Middlewares
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Rotas
app.use('/api', routes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});