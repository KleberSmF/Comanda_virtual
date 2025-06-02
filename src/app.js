const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { NODE_ENV, PORT } = require('./config/env');
const comandaRoutes = require('./routes/comandaRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares básicos
app.use(cors({
  origin: NODE_ENV === 'production' ? 'https://concharqueComandas.com' : 'http://localhost:3000'
}));
app.use(helmet());
app.use(express.json());
app.use(morgan(NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rotas
app.use('/api/comandas', comandaRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', environment: NODE_ENV });
});

// Tratamento de erros
app.use(errorHandler);

module.exports = app;