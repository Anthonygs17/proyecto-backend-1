import express from 'express';
import exphbs from 'express-handlebars';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import productsRouter, { productManager } from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const app = express();
const port = 8080;
const connection = mongoose.connect('mongodb+srv://coder:9fQO2x7u5AcOhdJb@cluster0.yodi9xu.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0');

const hbs = exphbs.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.engine('handlebars', hbs.engine);
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
    const products = await productManager.getAllProducts();
    socket.emit('productos', products);
    socket.on('newProduct', async (data) => {
        await productManager.addProduct(data);
        io.sockets.emit('productos', await productManager.getAllProducts());
    });
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        io.sockets.emit('productos', await productManager.getAllProducts());
    });
});
