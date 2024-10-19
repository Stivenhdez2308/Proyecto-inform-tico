const express = require('express');
const router = express.Router();
const Paciente = require('../models/Paciente');
const auth = require('../middleware/auth');

// Obtener todos los pacientes
router.get('/', auth, async (req, res) => {
  try {
    const pacientes = await Paciente.find({ doctor: req.doctor.id });
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener un paciente específico
router.get('/:id', auth, getPaciente, (req, res) => {
  res.json(res.paciente);
});

// Crear un nuevo paciente
router.post('/', auth, async (req, res) => {
  const paciente = new Paciente({
    nombre: req.body.nombre,
    email: req.body.email,
    fechaNacimiento: req.body.fechaNacimiento,
    doctor: req.doctor.id
  });

  try {
    const nuevoPaciente = await paciente.save();
    res.status(201).json(nuevoPaciente);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar un paciente
router.patch('/:id', auth, getPaciente, async (req, res) => {
  if (req.body.nombre != null) {
    res.paciente.nombre = req.body.nombre;
  }
  if (req.body.email != null) {
    res.paciente.email = req.body.email;
  }
  if (req.body.fechaNacimiento != null) {
    res.paciente.fechaNacimiento = req.body.fechaNacimiento;
  }

  try {
    const pacienteActualizado = await res.paciente.save();
    res.json(pacienteActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un paciente
router.delete('/:id', auth, getPaciente, async (req, res) => {
  try {
    await res.paciente.remove();
    res.json({ message: 'Paciente eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un paciente por ID
async function getPaciente(req, res, next) {
  let paciente;
  try {
    paciente = await Paciente.findById(req.params.id);
    if (paciente == null) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.paciente = paciente;
  next();
}

module.exports = router;
