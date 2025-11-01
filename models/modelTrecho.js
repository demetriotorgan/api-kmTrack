const mongoose = require('mongoose');

const AbastecimentoSchema = new mongoose.Schema({
  odometro: { type: Number, default: 0 },
  litros: { type: Number, default: 0 },
  valorTotal: { type: Number, default: 0 },
  precoPorLitro: { type: Number, default: 0 },
  cidade: { type: String, default: 'Estrada' },
  data: { type: Date, default: Date.now },
  hora: { type: String, default: '' },
  tipo: { type: String, enum: ['inicial', 'reposicao', 'final'], default: 'inicial' }
}, { _id: false });

const PedagioSchema = new mongoose.Schema({
  valor: { type: Number, default: 0 },
  local: { type: String, default: 'Estrada' },
  data: { type: Date, default: Date.now }
}, { _id: false });

const ParadaSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['descanso', 'alimentacao', 'abastecimento', 'pernoite', 'atrativo'], default: 'alimentacao' },
  tempo: { type: Number, default: 0 },
  local: { type: String, default: 'Estrada' },
  observacao: { type: String, default: '' }
}, { _id: false });

const ImprevistoSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['pane', 'acidente', 'desvio', 'transito', 'custo'], default: 'transito' },
  descricao: { type: String, default: '' },
  tempoGasto: { type: Number, default: 0 } // minutos
}, { _id: false });

const TrechoSchema = new mongoose.Schema({
  viagemId: { type: mongoose.Schema.Types.ObjectId, ref: "Viagem", required: true },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  distanciaPercorrida: { type: Number, default: 0 },
  tempoEmMovimento: { type: Number, default: 0 },
  tempoDeParadas: { type: Number, default: 0 },
  odometro: { type: Number, default: 0 },

  abastecimentos: { type: [AbastecimentoSchema], default: [] },
  pedagios: { type: [PedagioSchema], default: [] },
  paradas: { type: [ParadaSchema], default: [] },
  imprevistos: { type: [ImprevistoSchema], default: [] },
}, {
  timestamps: true
});

module.exports = mongoose.model("Trecho", TrechoSchema);
