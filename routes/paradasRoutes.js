const express = require('express')
const { adicionarParada, excluirParada, editarParada } = require('../controllers/paradasController');
const router = express.Router();

router.post('/salvar-parada/:id', adicionarParada);
router.delete('/excluir-parada/:paradaId', excluirParada);
router.put('/editar-parada/:paradaId', editarParada);
module.exports = router;