const express = require('express');
const { adicionarViagem, listarViagens, editarViagem } = require('../controllers/viagemControllers');
const router = express.Router();

router.post('/salvar-viagem', adicionarViagem);
router.get('/listar-viagens', listarViagens);
router.put('/editar-viagem/:id', editarViagem);

module.exports = router;