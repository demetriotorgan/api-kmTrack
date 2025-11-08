const express = require('express')
const { adicionarTrecho, listarTrechos, atualizarTrecho, excluirTrecho, atualizarTempoMovimento } = require("../controllers/trechoControllers");
const router = express.Router();

router.post('/salvar-trecho', adicionarTrecho);
router.get('/listar-trechos', listarTrechos);
router.put('/atualizar-trecho/:id', atualizarTrecho);
router.delete('/deletar-trecho/:id', excluirTrecho);
router.put('/atualizar-tempo/:id', atualizarTempoMovimento);
module.exports = router;

