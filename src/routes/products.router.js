import { Router } from 'express';
import productManager from '../managers/productManager.js';

const router = Router();

router.get('/', async (req, res) => {
    try{
        let { limit, page, query, sort } = req.query;
        limit = limit ? parseInt(limit) : 10;
        page = page ? parseInt(page) : 1;

        const result = await productManager.getProducts(limit, page, query, sort);
        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.hasPrevPage ? result.prevPage : null,
            nextPage: result.hasNextPage ? result.nextPage : null,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}${sort ? `&sort=${sort}`: ''}${query ? `&query=${query}` : ''}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}` : null
        });
    }catch(err){
        res.status(500).json({ status: 'error', msg: 'Error al obtener los productos' });
    }
});

router.get('/:pid', async (req, res) => {
    const id = req.params.pid;
    try{
        const product = await productManager.getProductById(id);
        if(product === null){
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        res.json(product);
    }catch(err){
        res.status(500).json({ msg: 'Error al obtener el producto' });
    }
});

router.post('/', async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    if(!title || !description || !code || !price || !status || !stock || !category){
        res.status(400).json({ msg: 'Faltan datos. Se debe pasar title, description, code, price, status, stock y category' });
        return;
    }
    const product = { title, description, code, price, status, stock, category };
    try{
        const newProduct = await productManager.addProduct(product);
        res.status(201).json(newProduct);
    }catch(err){
        res.status(500).json({ msg: 'Error al guardar el producto' });
    }
});

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;
    try{
        const product = await productManager.getProductById(id);
        if(product === null){
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        const updated = await productManager.updateProduct(id, updatedProduct);
        res.json(updated);
    }catch(err){
        res.status(500).json({ msg: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const id = req.params.pid;
    try{
        const product = await productManager.getProductById(id);
        if(product === null){
            res.status(404).json({ msg: 'Producto no encontrado' });
            return;
        }
        await productManager.deleteProduct(id);
        res.status(200).json({ msg: 'Producto eliminado' });
    }catch(err){
        res.status(500).json({ msg: 'Error al eliminar el producto' });
    }
});

export default router;