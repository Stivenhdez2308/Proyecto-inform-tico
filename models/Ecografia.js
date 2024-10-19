const mongoose = require('mongoose');

const EcografiaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: true
  },
  fecha: {
    type: Date,
    required: true
  },
  semanasGestacion: {
    type: Number,
    required: true
  },
  archivos: [{
    type: String,  // URL o ruta del archivo
    required: true
  }],
  notas: {
    type: String
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  }
});

module.exports = mongoose.model('Ecografia', EcografiaSchema);
