const express = require('express');
const { adicionarViagem, listarViagens, editarViagem, excluirViagem, listarViagensComTrechos } = require('../controllers/viagemControllers');
const router = express.Router();

router.post('/salvar-viagem', adicionarViagem);
router.get('/listar-viagens', listarViagens);
router.put('/editar-viagem/:id', editarViagem);
router.delete('/excluir-viagem/:id', excluirViagem);
router.get('/viagens-com-trechos', listarViagensComTrechos);

module.exports = router;