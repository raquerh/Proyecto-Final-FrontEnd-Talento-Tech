// Carga los productos desde el archivo products.json de forma asíncrona
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        if (!response.ok) throw new Error('No se pudo cargar products.json');
        const data = await response.json();
        console.log('Productos cargados:', data); // Depuración
        return data;
    } catch (error) {
        console.error('Error cargando productos:', error);
        return [];
    }
}

// Inicializa el carrito desde localStorage o crea uno vacío
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = []; // Variable global para almacenar productos cargados

// Selecciona los elementos del DOM para productos destacados, todos los productos y el contador del carrito
const productContainer = document.querySelector('.todos-productos .grid-productos');
const featuredContainer = document.querySelector('.productos-destacados .grid-productos');
const cartCounter = document.createElement('span');
cartCounter.className = 'contador-carrito';
cartCounter.innerHTML = '<img src="media/img/iconSN/carts.png" alt="Carrito de Compras" class="cart-icon"> <span class="cart-count">0</span>';
document.querySelector('.nav-links').appendChild(cartCounter);

// Selecciona productos al azar para la sección de destacados
function getRandomProducts(products, count) {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Función para normalizar texto (eliminar acentos y convertir a minúsculas)
function normalizeText(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Elimina acentos
}

// Muestra los productos en la página, incluyendo productos destacados y todos los productos
function displayProducts(productsData, searchTerm = '', selectedCategories = ['all']) {
    if (!productContainer || !featuredContainer || !productsData.length) {
        console.warn('No se pueden mostrar productos: contenedores o datos no disponibles');
        return;
    }
    productContainer.innerHTML = '';
    featuredContainer.innerHTML = '';

    const searchWords = searchTerm.trim().split(/\s+/).filter(word => word.length > 0); // Divide en palabras
    const filteredProducts = productsData.filter(product => {
        const normalizedTitle = normalizeText(product.title);
        const normalizedDescription = normalizeText(product.description);
        const matchesCategory = selectedCategories.includes('all') || selectedCategories.includes(product.category);

        // Busca si al menos una palabra (singular o plural) coincide con title o description
        const matchesSearch = searchWords.length === 0 || searchWords.some(word => {
            const normalizedWord = normalizeText(word);
            const normalizedPlural = normalizedWord.endsWith('s') ? normalizedWord.slice(0, -1) : normalizedWord + 's';
            return (normalizedTitle.includes(normalizedWord) || normalizedTitle.includes(normalizedPlural)) ||
                   (normalizedDescription.includes(normalizedWord) || normalizedDescription.includes(normalizedPlural));
        });

        return matchesSearch && matchesCategory;
    });

    // Manejo del aviso de búsqueda
    const searchMessage = document.getElementById('searchMessage');
    if (searchMessage) {
        searchMessage.textContent = filteredProducts.length === 0 && searchTerm ? 'No se encontraron resultados' : '';
        searchMessage.style.display = filteredProducts.length === 0 && searchTerm ? 'block' : 'none';
    }

    // Si no hay resultados, mostrar todos los productos como fallback
    if (filteredProducts.length === 0 && searchTerm) {
        displayProducts(productsData, '', ['all']);
        return;
    }

    const featuredProducts = getRandomProducts(filteredProducts, 4);
    featuredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'producto';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description.substring(0, 100)}...</p>
            <p class="precio">$${product.price.toFixed(2)}</p>
            <button class="btn agregar-carrito" data-id="${product.id}" data-title="${product.title}" 
                    data-price="${product.price}" data-image="${product.image}">Añadir al Carrito</button>
        `;
        featuredContainer.appendChild(productElement);
    });

    filteredProducts.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = `producto ${product.category.toLowerCase()}`;
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description.substring(0, 100)}...</p>
            <p class="precio">$${product.price.toFixed(2)}</p>
            <button class="btn agregar-carrito" data-id="${product.id}" data-title="${product.title}" 
                    data-price="${product.price}" data-image="${product.image}">Añadir al Carrito</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Muestra el carrito en un modal emergente
function displayCart() {
    const existingModal = document.querySelector('.modal-carrito');
    if (existingModal) existingModal.remove();
    
    const cartModal = document.createElement('div');
    cartModal.className = 'modal-carrito';
    cartModal.innerHTML = `
        <div class="contenido-carrito">
            <button class="btn vaciar-carrito" title="Vaciar carrito">Vaciar Carrito</button>
            <h2>Carrito de Compras</h2>
            <div class="items-carrito">
                ${cart.length === 0 ? '<p>El carrito está vacío.</p>' : `
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
                            ${cart.map(item => `
                                <tr>
                                    <td><img src="${item.image}" alt="${item.title}" class="item-carrito-image"></td>
                                    <td>${item.title}</td>
                                    <td>$${item.price.toFixed(2)}</td>
                                    <td><input type="number" min="1" value="${item.quantity}" class="input-cantidad" data-id="${item.id}"></td>
                                    <td>$${item.price * item.quantity.toFixed(2)}</td>
                                    <td><button class="btn remove-item" data-id="${item.id}">Eliminar</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `}
            </div>
            <p class="total-carrito">Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</p>
            <div class="cart-buttons">
                <button class="btn continuar-comprando">Seguir Comprando</button>
                <button class="btn ir-pago">Ir al Pago</button>
            </div>
        </div>
    `;
    document.body.appendChild(cartModal);
}

// Muestra el contenido del carrito en la página carrito.html
function displayCartPage() {
    const cartItemsContainer = document.querySelector('.items-carrito');
    const cartTotal = document.querySelector('.total-carrito');
    if (!cartItemsContainer || !cartTotal) return;

    cartItemsContainer.innerHTML = cart.length === 0 ? '<p>El carrito está vacío.</p>' : cart.map(item => `
        <div class="item-carrito">
            <img src="${item.image}" alt="${item.title}">
            <div>
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="btn remove-item" data-id="${item.id}">Eliminar</button>
                <input type="number" min="1" value="${item.quantity}" class="input-cantidad" data-id="${item.id}">
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Actualiza el contador de ítems en el carrito
function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) cartCount.textContent = totalItems;
}

// Añade un producto al carrito
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    displayCart();
}

// Valida el formulario de contacto
function validateForm() {
    const form = document.querySelector('.formulario');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const message = form.querySelector('textarea[name="message"]').value;
        
        if (!name || !email || !message) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }
        
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Por favor, ingrese un correo electrónico válido.');
            return;
        }
        
        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Mensaje enviado con éxito!');
                form.reset();
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

// Simula el proceso de pago
function handleCheckout() {
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('El carrito está vacío. Añade productos antes de proceder al pago.');
                return;
            }
            alert('¡Compra confirmada! Gracias por tu pedido.');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            displayCartPage();
        });
    }
}

// Filtra los productos por categoría
function filterProducts(category) {
    const products = document.querySelectorAll('.todos-productos .producto');
    products.forEach(product => {
        product.style.display = category === 'all' || product.classList.contains(category.toLowerCase()) ? 'block' : 'none';
    });
}

// Configura los eventos al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    products = await loadProducts(); // Almacena los productos globalmente
    if (products.length === 0) {
        console.error('No se cargaron productos. Verifica products.json.');
        return;
    }
    displayProducts(products);
    displayCartPage();
    updateCartCounter();
    validateForm();
    handleCheckout();
    
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput && searchButton) {
        // Evento para el botón de búsqueda
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value;
            const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                .map(checkbox => checkbox.value);
            displayProducts(products, searchTerm, selectedCategories);
        });

        // Evento para búsqueda con Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.keyCode === 13) {
                const searchTerm = searchInput.value;
                const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
                    .map(checkbox => checkbox.value);
                displayProducts(products, searchTerm, selectedCategories);
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('agregar-carrito')) {
            const product = {
                id: e.target.dataset.id,
                title: e.target.dataset.title,
                price: parseFloat(e.target.dataset.price),
                image: e.target.dataset.image
            };
            addToCart(product);
        }
        if (e.target.classList.contains('continuar-comprando')) {
            document.querySelector('.modal-carrito').remove();
        }
        if (e.target.classList.contains('vaciar-carrito')) {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            displayCart();
            displayCartPage();
        }
        if (e.target.classList.contains('remove-item')) {
            const id = e.target.dataset.id;
            cart = cart.filter(item => item.id !== id);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCounter();
            displayCart();
            displayCartPage();
        }
        if (e.target.classList.contains('ir-pago')) {
            window.location.href = 'carrito.html';
        }
    });
    
    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('input-cantidad')) {
            const id = e.target.dataset.id;
            const quantity = parseInt(e.target.value);
            if (quantity < 1) return;
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCounter();
                displayCart();
                displayCartPage();
            }
        }
        if (e.target.classList.contains('filtro-select')) {
            filterProducts(e.target.value);
        }
    });
});