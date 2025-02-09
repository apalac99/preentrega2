import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import viewsRouter from './routes/views.js';
import { readProducts, writeProducts } from './utils/fileManager.js';

// Configuración de rutas y directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicialización de Express
const app = express();
const PORT = 8080;

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Crear servidor HTTP y WebSocket
const httpServer = createServer(app);
const io = new Server(httpServer);

// Configuración de WebSocket
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  // Escuchar evento para agregar producto
  socket.on('addProduct', async (product) => {
    const products = await readProducts();
    const newProduct = {
      id: generateId(), // Generar un ID único
      ...product,
      status: true,
      thumbnails: [],
    };
    products.push(newProduct);
    await writeProducts(products);
    io.emit('newProduct', newProduct); // Emitir nuevo producto a todos los clientes
  });

  // Escuchar evento para eliminar producto
  socket.on('deleteProduct', async (productId) => {
    const products = await readProducts();
    const filteredProducts = products.filter((p) => p.id !== productId);
    await writeProducts(filteredProducts);
    io.emit('deleteProduct', productId); // Emitir ID del producto eliminado a todos los clientes
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Función para generar un ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Iniciar servidor
httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Exportar io para usarlo en otros módulos
export { io };