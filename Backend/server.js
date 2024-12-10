const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Rutas
// GET: Listar todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Productos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET: Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Productos WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST: Crear un nuevo producto
app.post('/api/productos', async (req, res) => {
  const { nombre, precio, cantidad, estado } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO Productos (nombre, precio, cantidad, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, precio, cantidad, estado]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});


// Ruta para actualizar la cantidad de un producto
app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { cantidad } = req.body;

  // Verifica si la cantidad está presente y es un número
  if (typeof cantidad !== 'number' || cantidad < 0) {
    return res.status(400).json({ message: 'Cantidad inválida o negativa' });
  }

  // Determinar el estado basado en la cantidad
  const estado = cantidad > 0; // Si cantidad > 0, estado será true (Habilitado), sino será false (Deshabilitado)

  try {
    // Actualiza la cantidad y el estado del producto en la base de datos
    const result = await pool.query(
      'UPDATE productos SET cantidad = $1, estado = $2 WHERE id = $3 RETURNING *',
      [cantidad, estado, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar la cantidad' });
  }
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
