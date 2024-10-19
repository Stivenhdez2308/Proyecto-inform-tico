const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/ecografia4d')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir el esquema del Doctor
const DoctorSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    password: String
});

const Doctor = mongoose.model('Doctor', DoctorSchema, 'doctores');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el registro de doctores
app.post('/registrar-doctor', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // Verificar si el doctor ya existe
        const doctorExistente = await Doctor.findOne({ email });
        if (doctorExistente) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptado = await bcrypt.hash(password, salt);

        // Crear nuevo doctor
        const nuevoDoctor = new Doctor({
            nombre,
            email,
            password: passwordEncriptado
        });

        // Guardar en la base de datos
        await nuevoDoctor.save();

        res.json({ mensaje: 'Doctor registrado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Servir el archivo HTML para cualquier otra ruta
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro-doctor.html'));
});

const PORT = process.env.PORT || 3000;

// Modificar la parte de escucha del servidor
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Manejar errores de inicio del servidor
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }

    switch (error.code) {
        case 'EACCES':
            console.error(`El puerto ${PORT} requiere privilegios elevados`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`El puerto ${PORT} ya está en uso`);
            console.log('Intentando con el siguiente puerto disponible...');
            server.listen(0); // Esto intentará el siguiente puerto disponible
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    const addr = server.address();
    console.log(`Servidor escuchando en el puerto ${addr.port}`);
});
