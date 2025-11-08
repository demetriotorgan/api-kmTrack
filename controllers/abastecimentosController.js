const Trecho = require('../models/modelTrecho');
const mongoose = require('mongoose');

module.exports.adicionarAbastecimento = async (req, res) => {
  try {
    const { trechoId } = req.params; // ID do trecho onde o abastecimento será adicionado
    const {
      odometro,
      litros,
      valorTotal,
      precoPorLitro,
      cidade,
      data,
      hora,
      tipo
    } = req.body;

    console.log("🟢 Trecho alvo:", trechoId);
    console.log("🧾 Dados do novo abastecimento:", req.body);

    // 1️⃣ Verifica se o trecho existe
    const trecho = await Trecho.findById(trechoId);
    if (!trecho) {
      console.warn("❌ Trecho não encontrado:", trechoId);
      return res.status(404).json({ msg: "Trecho não encontrado." });
    }

    // 2️⃣ Cria o novo abastecimento
    const novoAbastecimento = {
      _id: new mongoose.Types.ObjectId(),
      odometro: odometro ?? 0,
      litros: litros ?? 0,
      valorTotal: valorTotal ?? 0,
      precoPorLitro: precoPorLitro ?? 0,
      cidade: cidade || 'Estrada',
      data: data ? new Date(data) : new Date(),
      hora: hora ? new Date(hora) : null,
      tipo: tipo || 'inicial'
    };

    // 3️⃣ Adiciona ao array
    trecho.abastecimentos.push(novoAbastecimento);

    // 4️⃣ Atualiza a data de modificação do trecho
    trecho.updatedAt = new Date();

    // 5️⃣ Salva no banco
    await trecho.save();

    console.log(`✅ Abastecimento adicionado ao trecho ${trechoId}`);
    return res.status(201).json({
      msg: 'Abastecimento adicionado com sucesso!',
      abastecimento: novoAbastecimento,
      trechoAtualizado: trecho
    });
  } catch (error) {
    console.error('❌ Erro ao adicionar abastecimento:', error);
    return res.status(500).json({
      msg: 'Erro ao adicionar abastecimento.',
      erro: error.message
    });
  }
};

//Excluir um abastecimento
module.exports.excluirAbastecimento = async (req, res) => {
  try {
    const { trechoId, abastecimentoId } = req.params;

    console.log("🗑️ Trecho alvo:", trechoId);
    console.log("🧾 Abastecimento a excluir:", abastecimentoId);

    // 1️⃣ Verifica se o trecho existe
    const trecho = await Trecho.findById(trechoId);
    if (!trecho) {
      console.warn("❌ Trecho não encontrado:", trechoId);
      return res.status(404).json({ msg: "Trecho não encontrado." });
    }

    // 2️⃣ Verifica se o abastecimento existe dentro do trecho
    const index = trecho.abastecimentos.findIndex(
      (a) => a._id.toString() === abastecimentoId
    );

    if (index === -1) {
      console.warn("⚠️ Abastecimento não encontrado no trecho:", abastecimentoId);
      return res.status(404).json({ msg: "Abastecimento não encontrado neste trecho." });
    }

    // 3️⃣ Remove o abastecimento
    const abastecimentoRemovido = trecho.abastecimentos.splice(index, 1)[0];

    // 4️⃣ Atualiza o trecho
    trecho.updatedAt = new Date();
    await trecho.save();

    console.log(`✅ Abastecimento ${abastecimentoId} removido do trecho ${trechoId}`);
    return res.status(200).json({
      msg: "Abastecimento removido com sucesso!",
      abastecimentoRemovido,
      trechoAtualizado: trecho
    });
  } catch (error) {
    console.error("❌ Erro ao remover abastecimento:", error);
    return res.status(500).json({
      msg: "Erro ao remover abastecimento.",
      erro: error.message
    });
  }
};

//editar um abastecimento
module.exports.editarAbastecimento = async (req, res) => {
  try {
    const { trechoId, abastecimentoId } = req.params;
    const {
      odometro,
      litros,
      valorTotal,
      precoPorLitro,
      cidade,
      data,
      hora,
      tipo
    } = req.body;

    console.log("🛠️ Editando abastecimento:", abastecimentoId);
    console.log("📍 Trecho alvo:", trechoId);
    console.log("🧾 Dados recebidos:", req.body);

    // 1️⃣ Localiza o trecho
    const trecho = await Trecho.findById(trechoId);
    if (!trecho) {
      console.warn("❌ Trecho não encontrado:", trechoId);
      return res.status(404).json({ msg: "Trecho não encontrado." });
    }

    // 2️⃣ Localiza o abastecimento dentro do trecho
    const abastecimento = trecho.abastecimentos.find(
      (a) => a._id.toString() === abastecimentoId
    );

    if (!abastecimento) {
      console.warn("⚠️ Abastecimento não encontrado no trecho:", abastecimentoId);
      return res.status(404).json({ msg: "Abastecimento não encontrado neste trecho." });
    }

    // 3️⃣ Atualiza apenas os campos enviados
    abastecimento.odometro = odometro ?? abastecimento.odometro;
    abastecimento.litros = litros ?? abastecimento.litros;
    abastecimento.valorTotal = valorTotal ?? abastecimento.valorTotal;
    abastecimento.precoPorLitro = precoPorLitro ?? abastecimento.precoPorLitro;
    abastecimento.cidade = cidade ?? abastecimento.cidade;
    abastecimento.data = data ?? abastecimento.data;
    abastecimento.hora = hora ?? abastecimento.hora;
    abastecimento.tipo = tipo ?? abastecimento.tipo;

    // 4️⃣ Atualiza o campo updatedAt do trecho
    trecho.updatedAt = new Date();

    // 5️⃣ Salva as alterações
    await trecho.save();

    console.log(`✅ Abastecimento ${abastecimentoId} atualizado com sucesso no trecho ${trechoId}`);
    return res.status(200).json({
      msg: "Abastecimento atualizado com sucesso!",
      abastecimentoAtualizado: abastecimento,
      trechoAtualizado: trecho
    });
  } catch (error) {
    console.error("❌ Erro ao editar abastecimento:", error);
    return res.status(500).json({
      msg: "Erro ao editar abastecimento.",
      erro: error.message
    });
  }
};
