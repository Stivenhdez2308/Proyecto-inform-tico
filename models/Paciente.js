const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fechaNacimiento: {
    type: Date,
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor'
  },
  ecografias: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ecografia'
  }]
});

module.exports = mongoose.model('Paciente', PacienteSchema);
