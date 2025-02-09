import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsPath = path.join(__dirname, '../data/products.json');
const cartsPath = path.join(__dirname, '../data/carts.json');

// Leer productos
export const readProducts = async () => {
  const data = await fs.readFile(productsPath, 'utf-8');
  return JSON.parse(data);
};

// Escribir productos
export const writeProducts = async (products) => {
  await fs.writeFile(productsPath, JSON.stringify(products, null, 2));
};

// Leer carritos
export const readCarts = async () => {
  const data = await fs.readFile(cartsPath, 'utf-8');
  return JSON.parse(data);
};

// Escribir carritos
export const writeCarts = async (carts) => {
  await fs.writeFile(cartsPath, JSON.stringify(carts, null, 2));
};