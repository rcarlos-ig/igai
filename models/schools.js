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
    capacidade: Number,
  },
  cisterna: {
    possui: Boolean,
    capacidade: Number,
  },
  ocupacao: String,
  atualizadoEm: {
    type: Date,
    default: Date.now,
  },
  atualizadoPor: String,
  indicador: Number,
  indicador2: Number,
  avaliacao: String,
  avaliacao2: String,
});

const School = mongoose.model("School", SchoolSchema);

module.exports = School;
