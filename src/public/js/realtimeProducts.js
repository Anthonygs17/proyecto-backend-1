const socket = io();
socket.on('productos', (data) => {
    const productos = data;
    const html = productos.map((producto) => {
        return (`
            <tr>
                <td>${producto.title}</td>
                <td>${producto.description}</td>
                <td>${producto.code}</td>
                <td>$${producto.price}</td>
                <td>${producto.stock}</td>
                <td>${producto.category}</td>
            </tr>
        `);
    }).join('');
    document.getElementById('productos').innerHTML = html;
});

document.getElementById('newProductForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const code = document.getElementById('code').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    const status = true;
    socket.emit('newProduct', { title, description, code, price, status, stock, category });
    document.getElementById('newProductForm').reset();
});

document.getElementById('deleteProductForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const id = document.getElementById('id').value;
    socket.emit('deleteProduct', id);
    document.getElementById('deleteProductForm').reset();
});
