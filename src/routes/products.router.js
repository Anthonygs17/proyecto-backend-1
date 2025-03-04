import { Router } from 'express';
import { ProductManager } from '../managers/productManager.js';

const router = Router();
const products_path = 'src/data/products.json';
const productManager = new ProductManager(products_path);

router.get('/', (req, res) => {
    res.json(productManager.getProducts());
});

router.get('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    const product = productManager.getProductById(id);
    if(product !== undefined){
        res.json(product);
    }else{
        res.status(404).json({ msg: 'id no existe' });
    }
});

router.post('/', (req, res) => {
    const { title, description, code, price, stock } = req.body;
    if(!title || !description || !code || !price || !stock){
        res.status(400).json({ msg: 'Faltan datos. Se debe pasar title, description, code, price y stock' });
        return;
    }
    const product = { title, description, code, price, stock };
    productManager.addProduct(product);
    res.status(201).json(product);
});

router.put('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    if(productManager.getProductById(id) === undefined){
        res.status(404).json({ msg: 'id no existe' });
        return;
    }
    const updatedProduct = req.body;
    productManager.updateProduct(id, updatedProduct);
    res.json(updatedProduct);
});

router.delete('/:pid', (req, res) => {
    const id = parseInt(req.params.pid);
    if(productManager.getProductById(id) === undefined){
        res.status(404).json({ msg: 'id no existe, intente otra vez' });
        return;
    }
    productManager.deleteProduct(id);
    res.status(200).json({ msg: 'Producto eliminado' });
});

export default router;
export { productManager };