# StockMaster — Sistema de Gestión de Productos y Categorías

Frontend moderno desarrollado con **Vue 3 (Composition API)**, **TypeScript**, **Pinia**, **Axios** y **Tailwind CSS**, conectado a una API REST para la gestión integral de productos e inventarios con integridad referencial sobre categorías.

---

## 1. Requisitos Previos

Antes de ejecutar la aplicación, asegúrate de contar con las siguientes herramientas instaladas en tu sistema:

* **Node.js**: Versión `v20.x` o superior (Recomendado: `v22.18.0` o `v24.x`).
* **npm**: Gestor de paquetes versión `10.x` o superior.
* **Backend API REST**: Servicio backend activo y accesible en `http://localhost:8000/` con soporte para CORS (permite peticiones desde el puerto del frontend).

---

## 2. Comandos para Levantar el Entorno

Sigue estos pasos en tu terminal para clonar, configurar e iniciar el proyecto:

```bash
# 1. Ingresar al directorio del proyecto
cd prueba_full_stack

# 2. Configurar variables de entorno (opcional si usas los valores por defecto)
cp .env.example .env

# 3. Instalar dependencias del proyecto
npm install

# 4. Iniciar el servidor de desarrollo en caliente (HMR)
npm run dev

# 5. Compilar y verificar tipos para producción
npm run build

# 6. Previsualizar la compilación de producción localmente
npm run preview

# 7. Ejecutar únicamente el chequeo estático de tipos TypeScript
npm run type-check
```

---

## 3. URLs Base y Configuración de Red

| Servicio | URL Base / Puerto | Descripción |
| :--- | :--- | :--- |
| **Frontend Web** | `http://localhost:5173/` | Aplicación Vue 3 interactiva |
| **Backend API REST** | `http://localhost:8000/` | Servidor backend proveedor de los endpoints `/api/*` |

### Variables de Entorno (`.env`)

El proyecto cuenta con un archivo `.env` para parametrizar la ruta base del backend:

```env
VITE_API_BASE_URL=http://localhost:8000/
```

Si el backend se despliega en otro host o puerto, basta con ajustar el valor de `VITE_API_BASE_URL`.

---

## 4. Estructura del Proyecto

El código está estructurado bajo principios de arquitectura limpia y modular:

```text
prueba_full_stack/
├── public/                 # Archivos estáticos públicos
├── src/
│   ├── assets/             # Estilos globales y configuración de Tailwind CSS
│   │   ├── base.css        # Resets base
│   │   └── main.css        # Directivas de Tailwind CSS (@import "tailwindcss")
│   ├── components/         # Componentes reutilizables
│   │   ├── categories/
│   │   │   └── CategoryModal.vue     # Modal para creación y edición de categorías
│   │   └── common/
│   │       ├── AppNavbar.vue         # Barra de navegación principal y estado de API
│   │       ├── ConfirmModal.vue      # Diálogo modal reutilizable para confirmaciones
│   │       ├── LoadingSpinner.vue    # Indicador visual de estado de carga
│   │       ├── StatCard.vue          # Tarjeta de KPI para el Dashboard
│   │       └── ToastContainer.vue    # Sistema flotante de alertas Toast
│   ├── router/
│   │   └── index.ts        # Definición de rutas y títulos dinámicos
│   ├── services/           # Capa de comunicación HTTP con Axios
│   │   ├── api.ts          # Instancia Axios con interceptores y normalización de errores
│   │   ├── categoryService.ts # Métodos REST para categorías
│   │   └── productService.ts  # Métodos REST para productos
│   ├── stores/             # Estado reactivo global con Pinia
│   │   ├── category.ts     # Store de categorías (CRUD, loading, error)
│   │   ├── product.ts      # Store de productos (CRUD, métricas, loading, error)
│   │   └── toast.ts        # Store de notificaciones emergentes (Toast)
│   ├── types/              # Contratos de TypeScript
│   │   ├── api.ts          # Interfaces de respuesta estándar (ApiResponse, ApiErrorResponse)
│   │   ├── category.ts     # Interfaces de Categoría y Payload
│   │   ├── product.ts      # Interfaces de Producto y Payload
│   │   └── toast.ts        # Definición de tipos de alerta (success, error, warning, info)
│   ├── views/              # Vistas mínimas requeridas
│   │   ├── DashboardView.vue         # Dashboard con métricas y accesos rápidos
│   │   ├── categories/
│   │   │   └── CategoryListView.vue  # Listado, búsqueda y gestión de categorías
│   │   └── products/
│   │       ├── ProductFormView.vue   # Formulario reactivo con validaciones (Crear/Editar)
│   │       └── ProductListView.vue   # Listado de productos con filtros y acciones
│   ├── App.vue             # Componente raíz con layout y ToastContainer
│   └── main.ts             # Punto de entrada (Vue + Pinia + Router)
├── .env                    # Variables de entorno activas
├── .env.example            # Plantilla de variables de entorno
├── index.html              # HTML base
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración de TypeScript
└── vite.config.ts          # Configuración de Vite con plugin Tailwind CSS
```

---

## 5. Manejo de Errores, Estados HTTP y Validación

### Estados en cada Petición HTTP

Toda operación asíncrona hacia la API gestiona de forma transparente tres estados:

1. **Estado de Carga (`Loading`)**:
   * Despliegue de spinners (`LoadingSpinner`) sobre tablas y tarjetas.
   * Botones de envío deshabilitados con spinner animado interno para evitar peticiones duplicadas.
2. **Estado de Éxito (`Success`)**:
   * Notificación visual emergente (`Toast`) de color verde (esmeralda), con título y mensaje devuelto por la API.
   * Redirección automática al listado tras crear o editar un registro.
3. **Estado de Error (`Error`)**:
   * Notificación visual emergente (`Toast`) de color rojo (rosa) persistente.
   * Banners informativos con botón de reintento en caso de fallo en la carga de datos.
   * Si el backend se encuentra apagado o inaccesible, el interceptor genera un mensaje explicativo claro indicando revisar la conexión en el puerto `8000`.

### Formato Estándar de Respuesta API

El cliente Axios (`src/services/api.ts`) procesa automáticamente la estructura estándar de la API:

#### Respuesta Exitosa (200 / 201)
```json
{
  "success": true,
  "message": "Producto creado correctamente",
  "data": {
    "id": 1,
    "name": "Camiseta Overskull",
    "description": "Camiseta negra edición limitada",
    "price": 89.90,
    "stock": 50,
    "category_id": 1
  }
}
```

#### Respuesta de Error de Validación (422 / 400)
```json
{
  "success": false,
  "message": "El campo 'name' es obligatorio",
  "errors": {
    "name": ["El campo 'name' es obligatorio"],
    "price": ["El campo 'price' es obligatorio"],
    "stock": ["El campo 'stock' es obligatorio"],
    "category_id": ["El campo 'category_id' es obligatorio"]
  }
}
```

### Validaciones del Formulario de Producto

El formulario cuenta con validación en dos capas:

* **Capa Cliente (Tiempo Real)**:
  * **Nombre**: Obligatorio, mínimo 2 caracteres.
  * **Precio**: Numérico, obligatorio y estrictamente mayor que `0` (`> 0`).
  * **Stock**: Numérico, obligatorio y mayor o igual a `0` (`>= 0`).
  * **Categoría**: Obligatoria, debe seleccionarse una opción válida de la lista.
* **Capa Servidor**: Si la API devuelve un código de error con el objeto `errors`, los mensajes específicos se mapean y resaltan debajo de cada campo correspondiente.
* **Integridad Referencial (Categorías)**: Si se intenta eliminar una categoría que contiene productos asociados, el backend responderá con error y el sistema desplegará un Toast de advertencia: *"No se puede eliminar la categoría porque tiene productos asociados"*.

---

## 6. Vistas Desarrolladas

1. **Dashboard Inicial (`/`)**:
   * Indicadores clave (KPIs): Total de productos, total de categorías, valor monetario del inventario y contador de productos con stock crítico (≤ 10 unidades).
   * Tabla resumen con los últimos productos registrados y accesos directos de creación.
2. **Listado de Productos (`/products`)**:
   * Tabla con buscador por texto, filtro reactivo por categoría, formato de moneda local y badges de estado de inventario (en stock, stock bajo, agotado).
   * Acciones rápidas para editar y eliminar mediante modal de confirmación.
3. **Formulario de Producto (`/products/create` y `/products/edit/:id`)**:
   * Formulario unificado para creación y edición con detección automática de ID por ruta.
   * Control de errores campo por campo, botón de restablecer datos y cancelación.
4. **Listado de Categorías (`/categories`)**:
   * Vista de administración de categorías con buscador integrado.
   * Modal interactivo (`CategoryModal`) para crear y modificar registros sin recargar la página.
   * Validación de eliminación con confirmación preventiva.

---

## 7. Catálogo de Endpoints REST & JSONs de Prueba

### Categorías

| Método | Endpoint | Acción | Descripción |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/categories` | `index` | Listar todas las categorías |
| `POST` | `/api/categories` | `store` | Crear una nueva categoría |
| `GET` | `/api/categories/{id}` | `show` | Consultar el detalle de una categoría |
| `PUT` | `/api/categories/{id}` | `update` | Actualizar una categoría existente |
| `DELETE` | `/api/categories/{id}` | `destroy` | Eliminar una categoría (valida que no tenga productos) |

#### JSON de Prueba — Categorías (POST / PUT)
```json
{
  "name": "Ropa Urbana",
  "description": "Prendas de vestir casuales y accesorios de estilo urbano"
}
```

---

### Productos

| Método | Endpoint | Acción | Descripción |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/products` | `index` | Listar todos los productos con su categoría asociada |
| `POST` | `/api/products` | `store` | Crear un nuevo producto |
| `GET` | `/api/products/{id}` | `show` | Consultar el detalle de un producto |
| `PUT` | `/api/products/{id}` | `update` | Actualizar un producto existente |
| `DELETE` | `/api/products/{id}` | `destroy` | Eliminar un producto del inventario |

#### JSON de Prueba — Creación de Producto (POST)
```json
{
  "name": "Camiseta Overskull",
  "description": "Camiseta negra edición limitada",
  "price": 89.90,
  "stock": 50,
  "category_id": 1
}
```

#### JSON de Prueba — Actualización de Producto (PUT)
```json
{
  "name": "Camiseta Overskull V2",
  "description": "Camiseta negra edición limitada con bordado premium",
  "price": 99.50,
  "stock": 45,
  "category_id": 1
}
```
