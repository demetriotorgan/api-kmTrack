const mongoose = require('mongoose');

const ViagemSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  origem: { type: String, required: true },
  destino: { type: String, required: true },
  distanciaObjetivo: { type: Number, required: true }, // km totais planejados
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date },
  status: { 
    type: String, 
    enum: ['planejada', 'em_andamento', 'finalizada'], 
    default: 'planejada' 
  },
  notasGerais: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

ViagemSchema.virtual('trechos', {
  ref: 'Trecho',
  localField: '_id',
  foreignField: 'viagemId'
});

ViagemSchema.set('toObject', { virtuals: true });
ViagemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model("Viagem", ViagemSchema);
