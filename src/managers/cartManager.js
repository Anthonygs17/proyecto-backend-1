import fs from 'fs';

class CartManager {
    constructor(filePath){
        this.filePath = filePath;
        this.carts = this.loadCarts();
    }
    
    loadCarts(){
        if(fs.existsSync(this.filePath)){
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        }else{
            console.log(`El archivo ${this.filePath} no existe`);
            return [];
        }
    }
    
    saveCarts(){
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
    }
    
    addCart(cart){
        const maxId = this.carts.length > 0 ? Math.max(...this.carts.map(p => p.id)) : 0;
        cart.id = maxId + 1;
        this.carts.push(cart);
        this.saveCarts();
    }
    
    addProductToCart(cartId, productId){
        const cart = this.getCartById(cartId);
        const product = cart.products.find(p => p.id === productId);
        if(product !== undefined){
            product.quantity += 1;
        }else{
            cart.products.push({ id: productId, quantity: 1 });
        }
        this.saveCarts();
    }
    
    getCarts(){
        return this.carts;
    }
    
    getCartById(id){
        return this.carts.find(cart => cart.id === id);
    }
}

export { CartManager };