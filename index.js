const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Rotas
const viagemRoutes = require('./routes/viagemRoutes');
const trechoRoutes = require('./routes/trechoRoutes');
const paradasRoutes = require('./routes/paradasRoutes');
const abastecimentoRoutes = require('./routes/abastecimentosRoutes');
const pedagios = require('./routes/pedagiosRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: '*' }));

app.use((req,res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  next();
});

// 👉 GARANTE QUE O BANCO CONECTA ANTES DAS ROTAS
connectDB();

app.use('/', viagemRoutes, trechoRoutes, paradasRoutes, abastecimentoRoutes, pedagios);

app.get('/', (req, res)=>{
  res.status(200).send('🚀 API de Viagens está online e funcional!');
});

app.listen(PORT, ()=>console.log(`Rodando na porta ${PORT}`));
