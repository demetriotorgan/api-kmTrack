const Trecho = require('../models/modelTrecho');
const Viagem = require('../models/modelViagem'); // opcional, se quiser validar viagem
const mongoose = require('mongoose');

module.exports.adicionarTrecho = async (req, res) => {
  try {
    const {
      viagemId,
      origem,
      destino,
      distanciaPercorrida,
      tempoEmMovimento,
      tempoDeParadas,
      odometro,
      abastecimentos,
      pedagios,
      paradas,
      imprevistos
    } = req.body;

    // 🔎 1️⃣ Verifica se o ID da viagem é válido
    if (!mongoose.Types.ObjectId.isValid(viagemId)) {
      return res.status(400).json({
        success: false,
        msg: "ID de viagem inválido."
      });
    }

    // 🧭 2️⃣ (Opcional) Verifica se a viagem existe
    const viagemExistente = await Viagem.findById(viagemId);
    if (!viagemExistente) {
      return res.status(404).json({
        success: false,
        msg: "Viagem não encontrada."
      });
    }

    // 🧱 3️⃣ Cria o novo trecho
    const novoTrecho = new Trecho({
      viagemId,
      origem,
      destino,
      distanciaPercorrida,
      tempoEmMovimento,
      tempoDeParadas,
      odometro,
      abastecimentos: abastecimentos || [],
      pedagios: pedagios || [],
      paradas: paradas || [],
      imprevistos: imprevistos || []
    });

    // 💾 4️⃣ Salva no banco
    await novoTrecho.save();

    // 🎯 5️⃣ Retorna resposta
    return res.status(201).json({
      success: true,
      msg: "Trecho cadastrado com sucesso!",
      trecho: novoTrecho
    });

  } catch (error) {
    console.error("❌ Erro ao salvar trecho:", error);
    return res.status(500).json({
      success: false,
      msg: "Erro interno ao salvar trecho.",
      error: error.message
    });
  }
};

module.exports.listarTrechos = async(req, res)=>{
try {
    const trechos = await Trecho.find()
    .sort({_id:-1})
    .exec();
    res.status(200).json(trechos)
} catch (error) {
    res.status(500).json({msg: "Erro ao lisar trechos"});
    }
};