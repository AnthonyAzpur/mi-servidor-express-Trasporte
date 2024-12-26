const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // Permitir solicitudes desde Angular
}));

app.use(bodyParser.json());

// Datos en memoria
let usuarios = [
  { id: 1, username: 'admin', password: '123', appid: 7 }
];

let motos = [];

// Endpoint para login
app.post('/auth/login', (req, res) => {
  const { username, password, appid } = req.body;

  if (!username || !password || !appid) {
    return res.status(400).json({ error: 1, mensaje: 'Todos los campos son obligatorios.' });
  }

  const usuario = usuarios.find(u => u.username === username && u.password === password && u.appid === appid);

  if (usuario) {
    res.status(200).json({
      error: 0,
      mensaje: 'Acceso Permitido',
      numid: usuario.id
    });
  } else {
    res.status(200).json({
      error: 1,
      mensaje: 'Credenciales inválidas',
      numid: null
    });
  }
});

// Endpoint para agregar múltiples motos
app.post('/motos', (req, res) => {
  const nuevasMotos = req.body;

  if (!Array.isArray(nuevasMotos)) {
    return res.status(400).json({ mensaje: 'Se esperaba un array de registros.' });
  }

  const camposRequeridos = ['empresa', 'representante', 'zona', 'placa', 'propietario', 'conductor', 'estado', 'afiliado'];
  const errores = [];

  nuevasMotos.forEach((moto, index) => {
    const faltantes = camposRequeridos.filter(campo => !moto[campo]);
    if (faltantes.length > 0) {
      errores.push(`Registro ${index + 1}: Faltan los campos ${faltantes.join(', ')}`);
    } else {
      motos.push(moto); // Agregar moto al array en memoria
    }
  });

  if (errores.length > 0) {
    return res.status(400).json({ mensaje: 'Errores en los datos:', errores });
  }

  res.status(201).json({
    mensaje: 'Registros de motos agregados exitosamente.',
    data: nuevasMotos
  });
});

// Endpoint para listar las motos
app.get('/motos', (req, res) => {
  res.status(200).json(motos);
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
