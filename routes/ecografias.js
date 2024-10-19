const express = require('express');
const router = express.Router();
const Ecografia = require('../models/Ecografia');
const Paciente = require('../models/Paciente');
const auth = require('../middleware/auth');

// Obtener todas las ecografías
router.get('/', auth, async (req, res) => {
  try {
    const ecografias = await Ecografia.find({ doctor: req.doctor.id }).populate('paciente', 'nombre');
    res.json(ecografias);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener una ecografía específica
router.get('/:id', auth, getEcografia, (req, res) => {
  res.json(res.ecografia);
});

// Crear una nueva ecografía
router.post('/', auth, async (req, res) => {
  const ecografia = new Ecografia({
    paciente: req.body.pacienteId,
    fecha: req.body.fecha,
    semanasGestacion: req.body.semanasGestacion,
    archivos: req.body.archivos,
    notas: req.body.notas,
    doctor: req.doctor.id
  });

  try {
    const nuevaEcografia = await ecografia.save();
    await Paciente.findByIdAndUpdate(req.body.pacienteId, { $push: { ecografias: nuevaEcografia._id } });
    res.status(201).json(nuevaEcografia);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar una ecografía
router.patch('/:id', auth, getEcografia, async (req, res) => {
  if (req.body.fecha != null) {
    res.ecografia.fecha = req.body.fecha;
  }
  if (req.body.semanasGestacion != null) {
    res.ecografia.semanasGestacion = req.body.semanasGestacion;
  }
  if (req.body.archivos != null) {
    res.ecografia.archivos = req.body.archivos;
  }
  if (req.body.notas != null) {
    res.ecografia.notas = req.body.notas;
  }

  try {
    const ecografiaActualizada = await res.ecografia.save();
    res.json(ecografiaActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una ecografía
router.delete('/:id', auth, getEcografia, async (req, res) => {
  try {
    await Paciente.findByIdAndUpdate(res.ecografia.paciente, { $pull: { ecografias: res.ecografia._id } });
    await res.ecografia.remove();
    res.json({ message: 'Ecografía eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener una ecografía por ID
async function getEcografia(req, res, next) {
  let ecografia;
  try {
    ecografia = await Ecografia.findById(req.params.id).populate('paciente', 'nombre');
    if (ecografia == null) {
      return res.status(404).json({ message: 'Ecografía no encontrada' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.ecografia = ecografia;
  next();
}

module.exports = router;
