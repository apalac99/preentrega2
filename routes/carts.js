import express from 'express';
import { readCarts, writeCarts } from '../utils/fileManager.js';

const router = express.Router();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const carts = await readCarts();
  const newCart = {
    id: generateId(), // Función para generar un ID único
    products: [],
  };
  carts.push(newCart);
  await writeCarts(carts);
  res.status(201).json(newCart);
});

// Obtener productos de un carrito
router.get('/:cid', async (req, res) => {
  const carts = await readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);
  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const carts = await readCarts();
  const cart = carts.find((c) => c.id === req.params.cid);
  if (cart) {
    const productIndex = cart.products.findIndex((p) => p.product === req.params.pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }
    await writeCarts(carts);
    res.status(201).json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Función para generar un ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export default router;