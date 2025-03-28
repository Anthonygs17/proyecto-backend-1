import Product from "../models/product.model.js";

class ProductManager {
    
    async addProduct(product){
        try{
            const newProduct = new Product(product);
            await newProduct.save();
            return newProduct;
        }catch(err){
            console.error(err);
            throw new Error('Error al guardar el producto');
        }
    }
    
    async getAllProducts(){
        try{
            const products = await Product.find();
            return products;
        }catch(err){
            console.error(err);
            throw new Error('Error al obtener todos los productos');
        }
    }
    
    async getProducts(limit, page, query, sort){
        try{
            const filter = query ? { category: query } : {};
            const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
            const options = {
                limit: parseInt(limit) || 10,
                page: parseInt(page) || 1,
                sort: sortOption
            };
            
            const result = await Product.paginate(filter, options);
            return result;
        }catch(err){
            console.error(err);
            throw new Error('Error al obtener los productos');
        }
    }
    
    async getProductById(id){
        try{
            const product = await Product.findById(id);
            return product;
        }catch(err){
            console.error(err);
            throw new Error('Error al obtener el producto');
        }
    }
    
    async updateProduct(id, updatedProduct){
        try{
            const product = await Product.findByIdAndUpdate(id, updatedProduct, { new: true });
            return product;
        }catch(err){
            console.error(err);
            throw new Error('Error al actualizar el producto');
        }
    }
    
    async deleteProduct(id){
        try{
            const product = await Product.findByIdAndDelete(id);
            return product;
        }catch(err){
            console.error(err);
            throw new Error('Error al eliminar el producto');
        }
    }
}

export { ProductManager };