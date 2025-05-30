require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3001,
  DB_URI: process.env.DB_URI || 'mongodb://localhost:27017/myapp',
  JWT_SECRET: process.env.JWT_SECRET || 'secret-key',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000'
};