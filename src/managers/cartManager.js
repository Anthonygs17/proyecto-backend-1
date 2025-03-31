import Cart from "../models/cart.model.js";

class CartManager {
    
    async addCart(cart){
        try{
            const newCart = new Cart(cart);
            await newCart.save();
            return newCart;
        }catch(err){
            console.error(err);
            throw new Error('Error al guardar el carrito');
        }
    }
    
    async addProductToCart(cartId, productId){
        try{
            const cart = await Cart.findById(cartId);
            if(cart === null){
                throw new Error('Carrito no encontrado');
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if(existingProduct){
                existingProduct.quantity++;
            }else{
                cart.products.push({ product: productId });
            }
            await cart.save();
            return cart;
        }catch(err){
            console.error(err);
            throw new Error('Error al agregar producto al carrito');
        }
    }
    
    async getCarts(){
        try{
            const carts = await Cart.find();
            return carts;
        }catch(err){
            console.error(err);
            throw new Error('Error al obtener los carritos');
        }
    }
    
    async getCartById(id){
        try{
            const cart = await Cart.findById(id).populate('products.product');
            return cart;
        }catch(err){
            console.error(err);
            throw new Error('Error al obtener el carrito');
        }
    }

    async updateCartProducts(cartId, products){
        try{
            const cart = await Cart.findById(cartId);
            if(cart === null){
                throw new Error('Carrito no encontrado');
            }
            cart.products = products;
            await cart.save();
            return cart;
        }catch(err){
            console.error(err);
            throw new Error('Error al actualizar los productos del carrito');
        }
    }

    async updateProductQuantity(cartId, productId, quantity){
        try{
            const cart = await Cart.findById(cartId);
            if(cart === null){
                throw new Error('Carrito no encontrado');
            }

            const existingProduct = cart.products.find(p => p.product.toString() === productId);
            if(!existingProduct){
                throw new Error('Producto no encontrado en el carrito');
            }
            existingProduct.quantity = quantity;
            await cart.save();
            return cart;
        }catch(err){
            console.error(err);
            throw new Error('Error al actualizar la cantidad del producto en el carrito');
        }
    }

    async clearCart(cartId){
        try{
            const cart = await Cart.findById(cartId);
            if(cart === null){
                throw new Error('Carrito no encontrado');
            }
            cart.products = [];
            await cart.save();
        }catch(err){
            console.error(err);
            throw new Error('Error al limpiar el carrito');
        }
    }
    
    async removeProductFromCart(cartId, productId){
        try{
            const cart = await Cart.findById(cartId);
            if(cart === null){
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(p => p.product.toString() !== productId);
            await cart.save();
            return cart;
        }catch(err){
            console.error(err);
            throw new Error('Error al eliminar el producto del carrito');
        }
    }
}

const cartManager = new CartManager();
export default cartManager;