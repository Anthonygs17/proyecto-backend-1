import fs from 'fs';

class ProductManager {
    constructor(filePath){
        this.filePath = filePath;
        this.products = this.loadProducts();
    }
    
    loadProducts(){
        if(fs.existsSync(this.filePath)){
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        }else{
            console.log(`El archivo ${this.filePath} no existe`);
            return [];
        }
    }
    
    saveProducts(){
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    }
    
    addProduct(product){
        const maxId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0;
        product.id = maxId + 1;
        this.products.push(product);
        this.saveProducts();
    }
    
    getProducts(){
        return this.products;
    }
    
    getProductById(id){
        return this.products.find(product => product.id === id);
    }

    updateProduct(id, updatedProduct){
        const index = this.products.findIndex(product => product.id === id);
        if(index !== -1){
            this.products[index] = {...this.products[index], ...updatedProduct};
            this.saveProducts();
        }
    }
    
    deleteProduct(id){
        this.products = this.products.filter(product => product.id !== id);
        this.saveProducts();
    }
}

export { ProductManager };