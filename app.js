async function cargarProductos() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('No se pudo cargar products.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error cargando productos:', error);
        return [];
    }
}

let carrito = [];
let productos = [];

function normalizarTexto(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

function mostrarProductos(datosProductos, terminoBusqueda = '', categoriasSeleccionadas = ['all']) {
    const contenedorProductos = document.querySelector('.todos-productos .grid-productos');
    if (!contenedorProductos || !datosProductos.length) return;

    contenedorProductos.innerHTML = '';

    const palabrasBusqueda = terminoBusqueda.trim().split(/\s+/).filter(palabra => palabra.length > 0);

    const productosFiltrados = datosProductos.filter(producto => {
        const tituloNormalizado = normalizarTexto(producto.title);
        const descripcionNormalizada = normalizarTexto(producto.description);
        const coincideCategoria = categoriasSeleccionadas.includes('all') || categoriasSeleccionadas.includes(producto.category);

        const coincideBusqueda = palabrasBusqueda.length === 0 || palabrasBusqueda.some(palabra => {
            const palabraNormalizada = normalizarTexto(palabra);
            const pluralNormalizado = palabraNormalizada.endsWith('s') ? palabraNormalizada.slice(0, -1) : palabraNormalizada + 's';
            return (tituloNormalizado.includes(palabraNormalizada) || tituloNormalizado.includes(pluralNormalizado)) ||
                (descripcionNormalizada.includes(palabraNormalizada) || descripcionNormalizada.includes(pluralNormalizado));
        });

        return coincideBusqueda && coincideCategoria;
    });

    // Mostrar mensaje si no hay coincidencias, pero mostrar igual todos los productos
    const mensajeBusqueda = document.getElementById('searchMessage');
    let productosAMostrar = productosFiltrados;

    if (mensajeBusqueda) {
        if (productosFiltrados.length === 0 && terminoBusqueda) {
            mensajeBusqueda.textContent = 'Producto no encontrado';
            mensajeBusqueda.style.visibility = 'visible';
            productosAMostrar = datosProductos;
        } else {
            mensajeBusqueda.textContent = '';
            mensajeBusqueda.style.visibility = 'hidden';
        }
    }

    productosAMostrar.forEach(producto => {
        const elementoProducto = document.createElement('div');
        elementoProducto.className = `producto ${producto.category.toLowerCase()}`;
        elementoProducto.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>${producto.description.substring(0, 100)}...</p>
            <p class="precio">$${producto.price.toFixed(2)}</p>
            <button class="btn agregar-carrito" data-id="${producto.id}" data-title="${producto.title}" 
                    data-price="${producto.price}" data-image="${producto.image}">Añadir al Carrito</button>
        `;
        contenedorProductos.appendChild(elementoProducto);
    });
}

function mostrarPaginaCarrito() {
    const contenedorItemsCarrito = document.querySelector('.items-carrito');
    const totalCarrito = document.querySelector('.total-carrito');
    if (!contenedorItemsCarrito || !totalCarrito) return;

    contenedorItemsCarrito.innerHTML = carrito.length === 0 ? '<p>El carrito está vacío.</p>' : `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${carrito.map(item => `
                    <tr>
                        <td><img src="${item.image}" alt="${item.title}" class="item-carrito-image"></td>
                        <td>${item.title}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td><input type="number" min="1" value="${item.quantity}" class="input-cantidad" data-id="${item.id}"></td>
                        <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        <td><button class="btn remove-item" data-id="${item.id}">Eliminar</button></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    const total = carrito.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalCarrito.textContent = `Total: $${total.toFixed(2)}`;
}

function actualizarContadorCarrito() {
    const totalItems = carrito.reduce((sum, item) => sum + item.quantity, 0);
    const contadorCarrito = document.querySelector('.cart-count');
    if (contadorCarrito) contadorCarrito.textContent = totalItems || 0;
}

function mostrarNotificacion() {
    const notificacionExistente = document.querySelector('.cart-notification');
    if (notificacionExistente) notificacionExistente.remove();

    const notificacion = document.createElement('div');
    notificacion.className = 'cart-notification';
    notificacion.textContent = 'Producto agregado correctamente';
    document.body.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}

function agregarAlCarrito(producto) {
    const itemExistente = carrito.find(item => item.id === producto.id);
    if (itemExistente) {
        itemExistente.quantity += 1;
    } else {
        carrito.push({ ...producto, quantity: 1 });
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    actualizarContadorCarrito();
    mostrarNotificacion();
    mostrarPaginaCarrito();
}

function validarFormulario() {
    const formulario = document.querySelector('.formulario');
    if (!formulario) return;

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = formulario.querySelector('input[name="name"]').value;
        const correo = formulario.querySelector('input[name="email"]').value;
        const mensaje = formulario.querySelector('textarea[name="message"]').value;

        if (!nombre || !correo || !mensaje) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }

        fetch(formulario.action, {
            method: 'POST',
            body: new FormData(formulario),
            headers: {
                'Accept': 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    alert('Mensaje enviado con éxito!');
                    formulario.reset();
                } else {
                    alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error al enviar el mensaje. Por favor, intenta de nuevo.');
            });
    });
}

function manejarPago() {
    const botonPago = document.querySelector('.checkout-btn');
    if (botonPago) {
        botonPago.addEventListener('click', () => {
            if (carrito.length === 0) {
                alert('El carrito está vacío. Añade productos antes de proceder al pago.');
                return;
            }
            alert('¡Compra confirmada! Gracias por tu pedido.');
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContadorCarrito();
            mostrarPaginaCarrito();
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const contadorCarrito = document.createElement('span');
    contadorCarrito.className = 'contador-carrito';
    contadorCarrito.innerHTML = '<img src="media/img/iconSN/carts.png" alt="Carrito de Compras" class="cart-icon"> <span class="cart-count">0</span>';
    const enlacesNavegacion = document.querySelector('.nav-links');
    if (enlacesNavegacion) enlacesNavegacion.appendChild(contadorCarrito);

    const iconoCarrito = document.querySelector('.contador-carrito');
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', () => {
            window.location.href = 'carrito.html';
        });
    }

    productos = await cargarProductos();
    if (productos.length === 0) return;

    mostrarProductos(productos);
    mostrarPaginaCarrito();
    actualizarContadorCarrito();
    validarFormulario();
    manejarPago();

    const entradaBusqueda = document.getElementById('searchInput');
    const botonBusqueda = document.getElementById('searchButton');
    const categoriaSelect = document.querySelector('.filtro-select');

    if (entradaBusqueda && botonBusqueda) {
        botonBusqueda.addEventListener('click', () => {
            const terminoBusqueda = entradaBusqueda.value;
            if (categoriaSelect) categoriaSelect.value = 'all';
            mostrarProductos(productos, terminoBusqueda, ['all']);
        });

        entradaBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const terminoBusqueda = entradaBusqueda.value;
                if (categoriaSelect) categoriaSelect.value = 'all';
                mostrarProductos(productos, terminoBusqueda, ['all']);
            }
        });

        // 👉 NUEVO: borrar el mensaje mientras escribe
        entradaBusqueda.addEventListener('input', () => {
            const mensajeBusqueda = document.getElementById('searchMessage');
            if (mensajeBusqueda) {
                mensajeBusqueda.textContent = '';
                mensajeBusqueda.style.visibility = 'hidden';
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-carrito')) {
            const producto = {
                id: e.target.dataset.id,
                title: e.target.dataset.title,
                price: parseFloat(e.target.dataset.price),
                image: e.target.dataset.image
            };
            agregarAlCarrito(producto);
        }
        if (e.target.classList.contains('continue-shopping')) {
            window.location.href = 'productos.html';
        }
        if (e.target.classList.contains('clear-cart')) {
            carrito = [];
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContadorCarrito();
            mostrarPaginaCarrito();
        }
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            carrito = carrito.filter(item => item.id !== id);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            actualizarContadorCarrito();
            mostrarPaginaCarrito();
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('input-cantidad')) {
            const id = e.target.dataset.id;
            const nuevaCantidad = parseInt(e.target.value);
            const item = carrito.find(item => item.id === id);
            if (item && nuevaCantidad > 0) {
                item.quantity = nuevaCantidad;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                mostrarPaginaCarrito();
                actualizarContadorCarrito();
            }
        }

        if (e.target.classList.contains('filtro-select')) {
            const categoriaSeleccionada = e.target.value;
            mostrarProductos(productos, '', [categoriaSeleccionada]);
        }
    });
});