const express = require('express')
const { adicionarTrecho, listarTrechos, atualizarTrecho, excluirTrecho, atualizarTempoMovimento, adicionarParada, excluirParada } = require("../controllers/trechoControllers");
const router = express.Router();

router.post('/salvar-trecho', adicionarTrecho);
router.get('/listar-trechos', listarTrechos);
router.put('/atualizar-trecho/:id', atualizarTrecho);
router.delete('/deletar-trecho/:id', excluirTrecho);
router.put('/atualizar-tempo/:id', atualizarTempoMovimento);
router.post('/salvar-parada/:id', adicionarParada);
router.delete('/excluir-parada/:paradaId', excluirParada);
module.exports = router;

