const express = require('express');
const { adicionarAbastecimento, excluirAbastecimento, editarAbastecimento } = require('../controllers/abastecimentosController');

const router = express.Router();
router.post('/adicionar-abastecimento/:trechoId', adicionarAbastecimento);
router.delete('/excluir-abastecimento/:trechoId/:abastecimentoId', excluirAbastecimento);
router.put('/editar-abastecimento/:trechoId/:abastecimentoId', editarAbastecimento);
module.exports = router;