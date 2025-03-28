import { Router } from "express";
import { productManager } from "./products.router.js";

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


export default router;