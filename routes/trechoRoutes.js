const express = require('express')
const { adicionarTrecho, listarTrechos } = require("../controllers/trechoControllers");
const router = express.Router();

router.post('/salvar-trecho', adicionarTrecho);
router.get('/listar-trechos', listarTrechos);

module.exports = router;

