const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');


//Rotas
const viagemRoutes = require('./routes/viagemRoutes');
const trechoRoutes = require('./routes/trechoRoutes');
const paradasRoutes = require('./routes/paradasRoutes');
const abastecimentoRoutes = require('./routes/abastecimentosRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors({
    origin:'*',
}));
app.use((req,res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    next();    
  });


mongoose
    .connect(process.env.DATABASE_URL)
    .then(()=>console.log('Conectado ao banco ao MongoDB'))
    .catch((err)=>console.log(err));

app.use('/', viagemRoutes, trechoRoutes, paradasRoutes, abastecimentoRoutes);
app.get('/', (req, res)=>{
    res.status(200).send('🚀 API de Viagens está online e funcional!');
});

app.listen(PORT, ()=>console.log(`Rodando na porta ${PORT}`));