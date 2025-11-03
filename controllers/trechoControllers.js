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

//controller para ataualizar trecho
module.exports.atualizarTrecho = async(req,res)=>{
    try {
    const { id } = req.params; // id do trecho
    const dadosAtualizados = req.body; // payload vindo do front-end

    // Atualiza o trecho com base no ID
    const trechoAtualizado = await Trecho.findByIdAndUpdate(
      id,
      {
        $set: {
          origem: dadosAtualizados.origem,
          destino: dadosAtualizados.destino,
          distanciaPercorrida: dadosAtualizados.distancia, // aqui o campo é 'distancia' no payload
          odometro: dadosAtualizados.odometro,
          // caso queira permitir atualizar mais campos, adicione aqui
        },
      },
      { new: true } // retorna o documento atualizado
    );

    // Caso o ID não exista
    if (!trechoAtualizado) {
      console.log('Id Inválido')
      return res.status(404).json({ message: 'Trecho não encontrado.' });
    }

    // Sucesso
    res.status(200).json({
      message: 'Trecho atualizado com sucesso!',
      trecho: trechoAtualizado,
    });

  } catch (error) {
    console.error('Erro ao atualizar trecho:', error);
    res.status(500).json({
      message: 'Erro ao atualizar trecho.',
      error: error.message,
    });
  }
}