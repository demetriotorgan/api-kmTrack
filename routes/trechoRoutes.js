const express = require('express')
const { adicionarTrecho, listarTrechos, atualizarTrecho } = require("../controllers/trechoControllers");
const router = express.Router();

router.post('/salvar-trecho', adicionarTrecho);
router.get('/listar-trechos', listarTrechos);
router.put('/atualizar-trecho/:id', atualizarTrecho);

module.exports = router;

