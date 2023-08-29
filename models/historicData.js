// Mongoose
const mongoose = require("mongoose");

// Token Schema
const HistoricDataSchema = new mongoose.Schema({
  schoolCodigo: {
    type: Number,
    required: true,
  },
  indicador: {
    type: Number,
  },
  avaliacao: {
    type: String,
  },
  atualizadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  atualizadoEm: {
    type: Date,
    default: Date.now,
  },
});

const HistoricData = mongoose.model("HistoricData", HistoricDataSchema);

module.exports = HistoricData;
