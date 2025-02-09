import express from 'express';
import { readProducts } from '../utils/fileManager.js';
import { io } from '../app.js';

const router = express.Router();

// Vista home
router.get('/', async (req, res) => {
  const products = await readProducts();
  res.render('home', { products });
});

// Vista realTimeProducts
router.get('/realtimeproducts', async (req, res) => {
  const products = await readProducts();
  res.render('realTimeProducts', { products });
});

export default router;