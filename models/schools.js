// Mongoose
const mongoose = require("mongoose");

// School Schema
const SchoolSchema = new mongoose.Schema({
  codigo: Number,
  nome: String,
  bairro: String,
  ativa: Boolean,
  instalacoes: {
    eletricas: Number,
    hidraulicas: Number,
    sanitarias: Number,
  },
  cobertura: {
    telhas: Number,
    madeiramento: Number,
    impermeabilizacao: Number,
  },
  revestimento: {
    paredes: Number,
    tetos: Number,
    pisos: Number,
    pintura: Number,
  },
  esquadrias: {
    portas: Number,
    janelas: Number,
  },
  estrutura: {
    predio: Number,
    reservatorio: Number,
  },
  quadra: {
    cercaTela: Number,
    piso: Number,
    cobertura: Number,
    pintura: Number,
    equipamentos: Number,
    iluminacao: Number,
  },
  acessibilidade: {
    rampa: Number,
    elevador: Number,
    instalacoes: Number,
  },
  externas: {
    calcada: Number,
    muro: Number,
  },
  reservatorio: {
    tipo: String,
    capacidade: {
      type: Number,
      default: 0,
    },
  },
  cisterna: {
    possui: Boolean,
    capacidade: {
      type: Number,
      default: 0,
    },
  },
  bomba: String,
  ocupacao: String,
  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
  indicador: Number,
  avaliacao: String,
});

const School = mongoose.model("School", SchoolSchema);

module.exports = School;
