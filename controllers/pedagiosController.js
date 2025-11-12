const mongoose = require('mongoose');
const Trecho = require('../models/modelTrecho'); // ajuste o caminho conforme sua estrutura

module.exports.adicionarPedagio = async (req, res) => {
  try {
    const { trechoId } = req.params; // ID do trecho onde o pedágio será adicionado
    const { valor, local, data } = req.body;

    console.log("🟢 Trecho alvo:", trechoId);
    console.log("🧾 Dados do novo pedágio:", req.body);

    // 1️⃣ Verifica se o trecho existe
    const trecho = await Trecho.findById(trechoId);
    if (!trecho) {
      console.warn("❌ Trecho não encontrado:", trechoId);
      return res.status(404).json({ msg: "Trecho não encontrado." });
    }

    // 2️⃣ Cria o novo pedágio
    const novoPedagio = {
      _id: new mongoose.Types.ObjectId(),
      valor: valor ?? 0,
      local: local || 'Estrada',
      data: data ? new Date(data) : new Date(),
    };

    // 3️⃣ Adiciona ao array de pedágios
    trecho.pedagios.push(novoPedagio);

    // 4️⃣ Atualiza a data de modificação do trecho
    trecho.updatedAt = new Date();

    // 5️⃣ Salva no banco
    await trecho.save();

    console.log(`✅ Pedágio adicionado ao trecho ${trechoId}`);
    return res.status(201).json({
      msg: 'Pedágio adicionado com sucesso!',
      pedagio: novoPedagio,
      trechoAtualizado: trecho
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar pedágio:', error);
    return res.status(500).json({
      msg: 'Erro ao adicionar pedágio.',
      erro: error.message
    });
  }
};

module.exports.excluirPedagio = async (req, res) => {
  try {
    const { trechoId, pedagioId } = req.params;

    console.log("🗑️ Trecho alvo:", trechoId);
    console.log("🧾 Pedágio a excluir:", pedagioId);

    // 1️⃣ Verifica se o trecho existe
    const trecho = await Trecho.findById(trechoId);
    if (!trecho) {
      console.warn("❌ Trecho não encontrado:", trechoId);
      return res.status(404).json({ msg: "Trecho não encontrado." });
    }

    // 2️⃣ Verifica se o pedágio existe dentro do trecho
    const index = trecho.pedagios.findIndex(
      (p) => p._id.toString() === pedagioId
    );

    if (index === -1) {
      console.warn("⚠️ Pedágio não encontrado no trecho:", pedagioId);
      return res.status(404).json({ msg: "Pedágio não encontrado neste trecho." });
    }

    // 3️⃣ Remove o pedágio do array
    const pedagioRemovido = trecho.pedagios.splice(index, 1)[0];

    // 4️⃣ Atualiza o trecho e salva
    trecho.updatedAt = new Date();
    await trecho.save();

    console.log(`✅ Pedágio ${pedagioId} removido do trecho ${trechoId}`);
    return res.status(200).json({
      msg: "Pedágio removido com sucesso!",
      pedagioRemovido,
      trechoAtualizado: trecho
    });
  } catch (error) {
    console.error("❌ Erro ao remover pedágio:", error);
    return res.status(500).json({
      msg: "Erro ao remover pedágio.",
      erro: error.message
    });
  }
};


module.exports.editarPedagio = async (req, res) => {
  try {
    const { trechoId, pedagioId } = req.params;
    const { valor, local, data } = req.body;

    console.log("🛠️ Editando pedágio:", pedagioId);
    console.log("📍 Trecho alvo:", trechoId);
    console.log("🧾 Dados recebidos:", req.body);

    // 1️⃣ Localiza o trecho
    const trecho = await Trecho.findById(trechoId);
    if (!trecho) {
      console.warn("❌ Trecho não encontrado:", trechoId);
      return res.status(404).json({ msg: "Trecho não encontrado." });
    }

    // 2️⃣ Localiza o pedágio dentro do trecho
    const pedagio = trecho.pedagios.find(
      (p) => p._id.toString() === pedagioId
    );

    if (!pedagio) {
      console.warn("⚠️ Pedágio não encontrado no trecho:", pedagioId);
      return res.status(404).json({ msg: "Pedágio não encontrado neste trecho." });
    }

    // 3️⃣ Atualiza apenas os campos enviados
    pedagio.valor = valor ?? pedagio.valor;
    pedagio.local = local ?? pedagio.local;
    pedagio.data = data ? new Date(data) : pedagio.data;

    // 4️⃣ Atualiza o campo updatedAt do trecho
    trecho.updatedAt = new Date();

    // 5️⃣ Salva as alterações
    await trecho.save();

    console.log(`✅ Pedágio ${pedagioId} atualizado com sucesso no trecho ${trechoId}`);
    return res.status(200).json({
      msg: "Pedágio atualizado com sucesso!",
      pedagioAtualizado: pedagio,
      trechoAtualizado: trecho
    });
  } catch (error) {
    console.error("❌ Erro ao editar pedágio:", error);
    return res.status(500).json({
      msg: "Erro ao editar pedágio.",
      erro: error.message
    });
  }
};
