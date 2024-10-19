const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Doctor = require('../models/Doctor');

// Código de verificación predeterminado
const CODIGO_VERIFICACION = 'Clinica123$';

// Obtener todos los doctores
router.get('/', async (req, res) => {
  try {
    const doctores = await Doctor.find();
    res.json(doctores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear un nuevo doctor
router.post('/', async (req, res) => {
  const doctor = new Doctor({
    nombre: req.body.nombre,
    email: req.body.email,
    password: req.body.password
  });

  try {
    const nuevoDoctorr = await doctor.save();
    res.status(201).json(nuevoDoctorr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Registrar un nuevo doctor
router.post('/registro', async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        let doctor = await Doctor.findOne({ email });
        if (doctor) {
            return res.status(400).json({ msg: 'El doctor ya existe' });
        }

        doctor = new Doctor({
            nombre,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        doctor.password = await bcrypt.hash(password, salt);

        await doctor.save();

        res.json({ msg: 'Doctor registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Iniciar sesión de doctor
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciales inválidas' });
    }

    const payload = {
      doctor: {
        id: doctor.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

// Más rutas para actualizar y eliminar doctores...

// Verificar código de autorización
router.post('/verificar-codigo', (req, res) => {
    console.log('Solicitud recibida para verificar código');
    console.log('Cuerpo de la solicitud:', req.body);
    
    const { codigo } = req.body;
    const CODIGO_VERIFICACION = 'Clinica123$';
    
    console.log('Código recibido:', codigo);
    console.log('Código esperado:', CODIGO_VERIFICACION);
    
    if (codigo === CODIGO_VERIFICACION) {
        console.log('Código válido');
        res.json({ success: true, msg: 'Código válido' });
    } else {
        console.log('Código inválido');
        res.status(400).json({ success: false, msg: 'Código inválido' });
    }
});

module.exports = router;
