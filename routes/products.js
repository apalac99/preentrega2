import express from 'express';
import { readProducts, writeProducts } from '../utils/fileManager.js';

const router = express.Router();

// Obtener todos los productos (con límite opcional)
router.get('/', async (req, res) => {
  const limit = req.query.limit;
  const products = await readProducts();
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const products = await readProducts();
  const product = products.find((p) => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const products = await readProducts();
  const newProduct = {
    id: generateId(), // Función para generar un ID único
    ...req.body,
    status: true,
    thumbnails: req.body.thumbnails || [],
  };
  products.push(newProduct);
  await writeProducts(products);
  res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
  const products = await readProducts();
  const index = products.findIndex((p) => p.id === req.params.pid);
  if (index !== -1) {
    products[index] = { ...products[index], ...req.body };
    await writeProducts(products);
    res.json(products[index]);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  const products = await readProducts();
  const filteredProducts = products.filter((p) => p.id !== req.params.pid);
  if (filteredProducts.length < products.length) {
    await writeProducts(filteredProducts);
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Función para generar un ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default router;