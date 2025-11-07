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
          distanciaPercorrida: dadosAtualizados.distanciaPercorrida, // aqui o campo é 'distancia' no payload
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
};

module.exports.excluirTrecho = async (req, res) => {
  try {
    const { id } = req.params; // id do trecho recebido pela rota

    // Verifica se o ID foi informado
    if (!id) {
      return res.status(400).json({ message: "ID do trecho não fornecido." });
    }

    // Tenta encontrar e deletar o trecho
    const trechoRemovido = await Trecho.findByIdAndDelete(id);

    // Caso não exista um trecho com esse ID
    if (!trechoRemovido) {
      return res.status(404).json({ message: "Trecho não encontrado." });
    }

    // Sucesso
    res.status(200).json({
      message: "🗑️ Trecho excluído com sucesso!",
      trecho: trechoRemovido, // opcional: retorna o que foi removido
    });

  } catch (error) {
    console.error("Erro ao excluir trecho:", error);
    res.status(500).json({
      message: "Erro ao excluir trecho.",
      error: error.message,
    });
  }
};

// Atualiza o tempo inicial ou final de movimento de um trecho
exports.atualizarTempoMovimento = async (req, res) => {
  try {
    const { id } = req.params;
    const { tempoInicialMovimento, tempoFinalMovimento } = req.body;

    // Verifica qual campo veio no body
    let updateData = {};

    if (tempoInicialMovimento) {
      updateData.tempoInicialMovimento = new Date(tempoInicialMovimento);
    } else if (tempoFinalMovimento) {
      updateData.tempoFinalMovimento = new Date(tempoFinalMovimento);
    } else {
      return res.status(400).json({
        message: "Nenhum campo de tempo informado (esperado: tempoInicioMovimento ou tempoFinalMovimento)",
      });
    }

    // Faz a atualização parcial
    const trechoAtualizado = await Trecho.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!trechoAtualizado) {
      return res.status(404).json({ message: "Trecho não encontrado" });
    }

    res.json({
      message: "Tempo atualizado com sucesso",
      trecho: trechoAtualizado,
    });

  } catch (error) {
    console.error("Erro ao atualizar tempo de movimento:", error);
    res.status(500).json({
      message: "Erro interno ao atualizar tempo de movimento",
      error: error.message,
    });
  }
};

// controllers/trechoController.js
exports.adicionarParada = async (req, res) => {
  try {
    const { id } = req.params; // ID do trecho
    const novaParada = req.body;

    // Verificação básica de campos obrigatórios
    if (!novaParada.tempoInicialParada || !novaParada.tempoFinalParada) {
      return res.status(400).json({ message: "Horário inicial e final são obrigatórios." });
    }

    // Conversão para Date e cálculo de diferença para validação
    const inicio = new Date(novaParada.tempoInicialParada);
    const fim = new Date(novaParada.tempoFinalParada);
    const diffMin = Math.max(0, Math.floor((fim - inicio) / 60000));

    // Verificação de coerência — diferença muito discrepante
    if (Math.abs(diffMin - novaParada.tempoDeParada) > 2) {
      console.warn(`⚠️ Diferença inconsistente detectada no trecho ${id}: calculado ${diffMin}min, recebido ${novaParada.tempoDeParada}min.`);
      // Corrige o valor, mantendo segurança sem quebrar o fluxo
      novaParada.tempoDeParada = diffMin;
    }

    // Atualiza o trecho com push na lista de paradas
    const trechoAtualizado = await Trecho.findByIdAndUpdate(
      id,
      { $push: { paradas: novaParada } },
      { new: true }
    );

    if (!trechoAtualizado) {
      return res.status(404).json({ message: "Trecho não encontrado." });
    }

    res.status(200).json({
      message: "Parada adicionada com sucesso.",
      trecho: trechoAtualizado
    });

  } catch (error) {
    console.error("Erro ao adicionar parada:", error);
    res.status(500).json({
      message: "Erro interno ao registrar parada.",
      error: error.message
    });
  }
};

//Excluir registro de parada
module.exports.excluirParada = async (req, res) => {
  try {
    const { paradaId } = req.params;

    console.log("🗑️ Tentando excluir parada com ID:", paradaId);

    // 1️⃣ Encontrar o trecho que contém essa parada
    const trecho = await Trecho.findOne({ "paradas._id": paradaId });

    if (!trecho) {
      console.log("❌ Nenhum trecho contém essa paradaId:", paradaId);
      return res.status(404).json({ msg: "Parada não encontrada em nenhum trecho" });
    }

    console.log("✅ Trecho encontrado:", trecho._id);

    // 2️⃣ Remover a parada do array usando $pull
    await Trecho.updateOne(
      { _id: trecho._id },
      { $pull: { paradas: { _id: paradaId } } }
    );

    console.log("🧹 Parada removida com sucesso:", paradaId);

    // 3️⃣ Retornar o trecho atualizado (opcional)
    const trechoAtualizado = await Trecho.findById(trecho._id);

    return res.status(200).json({
      msg: "Parada excluída com sucesso",
      trechoAtualizado
    });

  } catch (error) {
    console.error("❌ Erro ao excluir parada:", error);
    res.status(500).json({ msg: "Erro ao excluir parada", error });
  }
};
