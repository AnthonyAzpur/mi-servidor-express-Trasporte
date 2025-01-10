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
// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
