# 🏍️ RRH Motoparts - Proyecto Final Integrador de Talento Tech 🚴‍♂️


**RRH Motoparts** es el **Proyecto Final Integrador** del curso de **Front-End** de **Talento Tech**, ¡y está diseñado para los fanáticos de las motos que viven por la adrenalina! 🛵💨 Esta tienda en línea ofrece repuestos, accesorios e indumentaria para motocicletas con un diseño **moderno**, **funcional** y **lleno de estilo**. Con colores vibrantes, un diseño responsivo y funcionalidades dinámicas, este proyecto es una explosión de pasión por las dos ruedas y las mejores prácticas de desarrollo web. 🛞🔥

## 🌟 **Características Principales**

| **Característica**                     | **Descripción**                                                                 |
|----------------------------------------|---------------------------------------------------------------------------------|
| 🎨 **Diseño Responsivo**               | Se ve increíble en celulares, tablets y escritorios con CSS Grid, Flexbox y media queries. |
| 🛒 **Carrito de Compras Dinámico**      | Añadí, eliminá y actualizá productos con guardado en localStorage. ¡Tu carrito va a toda velocidad! |
| 🔍 **Búsqueda y Filtro**               | Buscá repuestos, accesorios o indumentaria por palabra clave o categoría. 🏍️ |
| ⭐ **Reseñas de Clientes**              | Opiniones reales de motociclistas en una cuadrícula en `opiniones.html`.         |
| ✉️ **Formulario de Contacto**          | Enviá consultas con Formspree, con validación y opción preseleccionada. ¡Rápido como una CBR! |
| 📖 **Sobre Nosotros**                  | Conocé nuestra historia, valores y equipo en `sobre-nosotros.html`.              |
| 🌐 **Navegación Intuitiva**            | Menú desplegable en móviles para que no te pierdas ni en la ruta ni en la web.  |
| ♿ **Accesibilidad**                   | HTML semántico, atributos `alt` y navegación por teclado para todos los riders.  |
| 🔔 **Notificaciones**                  | Alertas instantáneas al agregar productos al carrito. ¡Pura emoción!            |
| 🛠️ **Personalización de Motos**        | Explora productos como cascos personalizados, cubiertas off-road y faros LED para tunear tu máquina. |

## 🎨 **Colores que Rugem como Moto**

- **Rojo Fuego (#dc2626)**: Para la pasión y la velocidad. 🔥
- **Azul Eléctrico (#2563eb)**: Moderno y vibrante, como un rayo en la ruta. ⚡️
- **Gris Asfalto (#1f2937)**: Elegante y resistente, como el pavimento que recorres. 🛣️
- **Blanco Neón (#ffffff)**: Brillo puro para destacar en la noche. 🌟
- **Negro Mate (#111827)**: Clásico y rebelde, como una moto custom. 🖤

## 🖼️ **Capturas de Pantalla**

- **Página de Inicio**  
  ![Página de Inicio](media/screenshots/index.png)

- **Página de Productos**  
  ![Página de Productos](media/screenshots/productos.png)

- **Página de Contacto**  
  ![Página de Contacto](media/screenshots/contacto.png)

## 🛠️ **Requisitos**

- **Navegador Moderno**: Chrome, Firefox, Edge o Safari (¡actualizado como tu moto!).
- **Conexión a Internet**: Para cargar Google Fonts y enviar formularios vía Formspree.
- **Servidor Local**: Usá Python o Live Server para probar como en un taller de motos.

## 📂 **Estructura del Proyecto**

```
rrh-motoparts/
├── css/
│   └── styles.css               # Estilos que rugen con variables CSS
├── app.js                       # JavaScript que acelera las funcionalidades
├── media/
│   ├── img/
│   │   ├── iconSN/              # Iconos para header y footer
│   │   │   ├── carts.png        # Icono del carrito de compras
│   │   │   ├── logo.png         # Logo de RRH Motoparts
│   │   │   ├── facebook.png     # Icono de Facebook
│   │   │   ├── instagram.png    # Icono de Instagram
│   │   │   ├── x_twitter.png    # Icono de Twitter
│   │   │   └── tik-tok.png      # Icono de TikTok
│   │   ├── productos/           # Fotos de cascos, cubiertas y más
│   │   └── fondo.jpg            # Fondo que grita motos
│   └── screenshots/
│       ├── index.png            # Captura de pantalla del inicio
│       ├── productos.png        # Captura de pantalla del catálogo
│       └── contacto.png         # Captura de pantalla del formulario
├── products.json                # Productos en JSON, listos para rodar
├── index.html                   # Página principal
├── productos.html               # Catálogo de repuestos y accesorios
├── carrito.html                 # Carrito de compras
├── opiniones.html               # Reseñas de motociclistas
├── contacto.html                # Formulario para rugir tus consultas
├── sobre-nosotros.html          # Nuestra pasión por las motos
└── README.md                    # La guía para este viaje
```

## 🏁 **Uso**

1. **Arrancá el Proyecto**:
   - Hacé click [acá](https://raquerh.github.io/Proyecto-Final-FrontEnd-Talento-Tech/) para visitar el sitio.

2. **Explorá la Ruta**:
   - **Inicio**: Descubrí RRH Motoparts y acelerá al catálogo.
   - **Productos**: Buscá cascos, guantes, amortiguadores y más. ¡Filtrá y encontrá tu estilo!
   - **Carrito**: Gestioná tus compras y simulá un pago más rápido que una Hayabusa.
   - **Opiniones**: Leé lo que otros motociclistas dicen de nosotros.
   - **Contacto**: Enviá consultas desde el formulario.
   - **Sobre Nosotros**: Conocé nuestra historia y nuestro equipo de riders.

3. **Probá el Formulario**:
   - En `contacto.html`, llená nombre, correo y mensaje.
   - "Correo Electrónico" está preseleccionado por defecto.
   - Hacé clic en **Enviar** y chequeá tu correo con Formspree.

## 🛠️ **Problemas y Soluciones**

- **Formulario no Arranca**:
  - **Causa**: ID de Formspree rota o falta de HTTPS.
  - **Solución**: Revisá la acción en `contacto.html` y usá un servidor local o Netlify.

- **Imágenes no Cargan**:
  - **Causa**: Rutas equivocadas o archivos perdidos en la ruta.
  - **Solución**: Chequeá que las imágenes estén en `media/img/productos/` y revisá `products.json`.

- **Diseño Desajustado en Móviles**:
  - **Causa**: Caché rebelde o modo de compatibilidad.
  - **Solución**: Limpia la caché o prueba en otro dispositivo.

- **Productos no Aparecen**:
  - **Causa**: Error en la carga de `products.json`.
  - **Solución**: Usá un servidor local para la solicitud `fetch` y asegurate de que el archivo esté en su lugar.

- **Algunas Imágenes no Cargan**:
  - **Causa**: La extensión del archivo de imagen esta en mayúsculas (JPG) y en el archivo json en minúsculas (jpg).
  - **Solución**: Unificar criterios: pasar todas las extensiones de los archivos a minúsculas.

## 📬 **Contacto**

Para consultas, sugerencias o para compartir tu pasión por las motos:
- **Correo Electrónico**: raquerh@gmail.com
- **GitHub Issues**: Abrí un issue en el repositorio y unite al viaje.

**¡Gracias por rodar con RRH Motoparts!** Este proyecto es puro octanaje, reflejando el aprendizaje y la pasión por el desarrollo Front-End del curso **Talento Tech**. 🏍️💨
