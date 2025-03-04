import express from 'express';
import exphbs from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter, { productManager } from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const port = 8080;

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./src/public'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const httpServer = app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log('Cliente conectado');
    const products = await productManager.getProducts();
    socket.emit('productos', products);
    socket.on('newProduct', async (data) => {
        await productManager.addProduct(data);
        io.sockets.emit('productos', await productManager.getProducts());
    });
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(parseInt(id));
        io.sockets.emit('productos', await productManager.getProducts());
    });
});
