const express = require('express');
const { adicionarPedagio, excluirPedagio, editarPedagio } = require('../controllers/pedagiosController');
const router = express.Router();

router.post('/salvar-pedagio/:trechoId', adicionarPedagio);
router.delete('/excluir-pedagio/:trechoId/:pedagioId', excluirPedagio);
router.put('/atualizar-pedagio/:trechoId/:pedagioId', editarPedagio);

module.exports = router;