import { Router } from "express";
import { productManager } from "./products.router.js";

const router = Router();

router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("index", { products });
});

router.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("products", { products });
});

router.get("/realtimeproducts", async (req, res) => {
    res.render("realtimeproducts");
});


export default router;