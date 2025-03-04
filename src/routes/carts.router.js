import { Router } from 'express';
import { CartManager } from '../managers/cartManager.js';

const router = Router();
const carts_path = 'src/data/carts.json';
const cartManager = new CartManager(carts_path);

router.get('/', (req, res) => {
    res.json(cartManager.getCarts());
});

router.get('/:cid', (req, res) => {
    const id = parseInt(req.params.cid);
    const cart = cartManager.getCartById(id);
    if(cart !== undefined){
        res.json(cart.products);
    }else{
        res.status(404).json({ msg: 'id no existe' });
    }
});

router.post('/', (req, res) => {
    const cart = { products: [] };
    cartManager.addCart(cart);
    res.status(201).json(cart);
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    if(cartManager.getCartById(cartId) === undefined){
        res.status(404).json({ msg: 'cart id no existe' });
        return;
    }
    cartManager.addProductToCart(cartId, productId);
    res.status(201).json({ msg: 'Producto agregado al carrito' });
});

export default router;