import { Router } from "express";
import productManager from "../managers/productManager.js";
import cartManager from "../managers/cartManager.js";

const router = Router();

router.get("/", async (req, res) => {
    const products = await productManager.getAllProducts();
    res.render("index", { products });
});

router.get("/products", async (req, res) => {
    try{
        const { limit, page, query, sort } = req.query;
        const products = await productManager.getProducts(limit, page, query, sort);

        res.render("products", {
            products: products.docs,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            totalPages: products.totalPages,
            limit: limit || 10,
            query: query || "",
            sort: sort || ""
        });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid;
    try{
        const cart = await cartManager.getCartById(cartId);
        if(cart === null){
            res.status(404).json({ msg: 'Carrito no encontrado' });
            return;
        }
        const cartItems = cart.products;
        const cartTotal = cartItems.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
        res.render("cart-items", { cartItems, cartTotal });
    }catch(err){
        console.error(err);
        res.status(500).json({ error: "Error al obtener el carrito" });
    }
});

export default router;