import express from 'express';
import { ProductManager } from './productManager.js';
import { CartManager } from './cartManager.js';

const app = express();
const port = 8080;

const products_path = './src/data/products.json';
const carts_path = './src/data/carts.json';

const productManager = new ProductManager(products_path);
const cartManager = new CartManager(carts_path);

app.use(express.json());

app.get('/api/products/', (req, res) => {
    res.json(productManager.getProducts());
});

app.get('/api/products/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const product = productManager.getProductById(id);
    if(product !== undefined){
        res.json(product);
    }else{
        res.status(404).json({ msg: 'id no existe' });
    }
});

app.post('/api/products/', (req, res) => {
    const product = req.body;
    productManager.addProduct(product);
    res.status(201).json(product);
});

app.put('/api/products/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    if(productManager.getProductById(id) === undefined){
        res.status(404).json({ msg: 'id no existe' });
        return;
    }
    const updatedProduct = req.body;
    productManager.updateProduct(id, updatedProduct);
    res.json(updatedProduct);
});

app.delete('/api/products/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    if(productManager.getProductById(id) === undefined){
        res.status(404).json({ msg: 'id no existe, intente otra vez' });
        return;
    }
    productManager.deleteProduct(id);
    res.status(200).json({ msg: 'Producto eliminado' });
});



app.get('/api/carts/', (req, res) => {
    res.json(cartManager.getCarts());
});

app.get('/api/carts/:cid', (req, res) => {
    const id = parseInt(req.params.cid);
    const cart = cartManager.getCartById(id);
    if(cart !== undefined){
        res.json(cart.products);
    }else{
        res.status(404).json({ msg: 'id no existe' });
    }
});

app.post('/api/carts/', (req, res) => {
    const cart = req.body;
    cartManager.addCart(cart);
    res.status(201).json(cart);
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    if(cartManager.getCartById(cartId) === undefined){
        res.status(404).json({ msg: 'cart id no existe' });
        return;
    }
    if(productManager.getProductById(productId) === undefined){
        res.status(404).json({ msg: 'product id no existe' });
        return;
    }
    cartManager.addProductToCart(cartId, productId);
    res.status(200).json({ msg: 'Producto agregado al carrito' });
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
