import { Router } from 'express';
import cartManager from '../managers/cartManager.js';
import productManager from '../managers/productManager.js';

const router = Router();

router.get('/', async (req, res) => {
    try{
        const carts = await cartManager.getCarts();
        res.json(carts);
    }catch(err){
        res.status(500).json({ msg: 'Error al obtener los carritos' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        res.json(cart.products);
    }catch(err){
        res.status(500).json({ msg: 'Error al obtener el carrito' });
    }
});

router.post('/', async (req, res) => {
    const newCart = { products: [] };
    try{
        const cart = await cartManager.addCart(newCart);
        res.status(201).json(cart);
    }catch(err){
        res.status(500).json({ msg: 'Error al guardar el carrito' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        const product = await productManager.getProductById(productId);
        if(product === null){
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        await cartManager.addProductToCart(cartId, productId);
        res.status(201).json( { msg: 'Producto agregado al carrito' });
    }catch(err){
        res.status(500).json({ msg: 'Error al agregar producto al carrito' });
    }
});

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const products = req.body.products;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        const updatedCart = await cartManager.updateCartProducts(cartId, products);
        res.json(updatedCart);
    }catch(err){
        res.status(500).json({ msg: 'Error al actualizar el carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        const product = await productManager.getProductById(productId);
        if(product === null){
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, quantity);
        res.json(updatedCart);
    }catch(err){
        res.status(500).json({ msg: 'Error al actualizar la cantidad del producto en el carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        await cartManager.clearCart(cartId);
        res.status(200).json({ msg: 'Todos los productos han sido eliminados del carrito' });
    }catch(err){
        res.status(500).json({ msg: 'Error al eliminar el carrito' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        const product = await productManager.getProductById(productId);
        if(product === null){
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        const updatedCart = await cartManager.removeProductFromCart(cartId, productId);
        res.json(updatedCart);
    }catch(err){
        res.status(500).json({ msg: 'Error al eliminar el producto del carrito' });
    }
});

export default router;