const Trecho = require('../models/modelTrecho');
const Viagem = require('../models/modelViagem'); // opcional, se quiser validar viagem
const mongoose = require('mongoose');

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

//edidtar parada
module.exports.editarParada = async(req,res)=>{
  try {
    const paradaId = req.params.paradaId; // ID da parada a ser atualizada
    const {
      tipo,
      tempoInicialEditado,
      tempoFinalEditado,
      tempoDeParada,
      local,
      observacao
    } = req.body;

    console.log("🟢 ID recebido:", paradaId);
    console.log("🔧 Payload recebido:", req.body);

    // 1️⃣ Localiza o trecho que contém a parada específica
    const trecho = await Trecho.findOne({ "paradas._id": paradaId });

    if (!trecho) {
      console.warn("❌ Nenhum trecho encontrado com essa paradaId:", paradaId);
      return res.status(404).json({ msg: "Trecho não encontrado para a parada informada." });
    }

    // 2️⃣ Localiza o índice da parada dentro do array
    const index = trecho.paradas.findIndex(p => p._id.toString() === paradaId);

    if (index === -1) {
      console.warn("❌ Parada não encontrada no array do trecho:", paradaId);
      return res.status(404).json({ msg: "Parada não encontrada dentro do trecho." });
    }

    // 3️⃣ Atualiza os campos desejados
    trecho.paradas[index].tipo = tipo ?? trecho.paradas[index].tipo;
    trecho.paradas[index].tempoInicialParada = tempoInicialEditado ?? trecho.paradas[index].tempoInicialParada;
    trecho.paradas[index].tempoFinalParada = tempoFinalEditado ?? trecho.paradas[index].tempoFinalParada;
    trecho.paradas[index].tempoDeParada = tempoDeParada ?? trecho.paradas[index].tempoDeParada;
    trecho.paradas[index].local = local ?? trecho.paradas[index].local;
    trecho.paradas[index].observacao = observacao ?? trecho.paradas[index].observacao;

    // 4️⃣ Atualiza a data de modificação do trecho
    trecho.updatedAt = new Date();

    // 5️⃣ Salva as alterações
    await trecho.save();

    console.log(`✅ Parada ${paradaId} atualizada com sucesso no trecho ${trecho._id}`);

    return res.status(200).json({
      msg: "Parada atualizada com sucesso!",
      trechoAtualizado: trecho
    });

  } catch (error) {
    console.error("❌ Erro ao editar parada:", error);
    return res.status(500).json({
      msg: "Erro ao editar a parada.",
      erro: error.message
    });
  }
}
