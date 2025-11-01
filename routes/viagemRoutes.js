const express = require('express');
const { adicionarViagem, listarViagens } = require('../controllers/viagemControllers');
const router = express.Router();

router.post('/salvar-viagem', adicionarViagem);
router.get('/listar-viagens', listarViagens);

module.exports = router;