# Productos API

Este proyecto es una API RESTful para gestionar productos. Permite listar, obtener, crear y actualizar productos en una base de datos PostgreSQL.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución para JavaScript.
- **Express**: Framework para crear aplicaciones web y APIs.
- **PostgreSQL**: Base de datos relacional utilizada para almacenar los productos.
- **Postman**: Utilizado para probar los endpoints de la API.
- **Render**: Servicio para alojar la base de datos PostgreSQL (si es necesario).

## Requisitos Previos

1. Tener Node.js y npm instalados en tu sistema.
2. Tener una base de datos PostgreSQL configurada y en ejecución.
3. Crear un archivo `.env` con las siguientes variables:

```
DATABASE_URL=<postgresql://prog3_final_user:S140vt0tlXiAJqJZPV4hltirPJfaE6Ga@dpg-ctacjf9u0jms73ev25cg-a.oregon-postgres.render.com/prog3_final>
PORT=<5000>
```

## Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. Clona este repositorio:
   ```bash
   git clone <https://github.com/Tunmas/Prog3-Final-Diciembre.git>
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura el archivo `.env` con la URL de tu base de datos PostgreSQL.

4. Inicia el servidor:
   ```bash
   npm start
   ```

5. La API estará disponible en `http://localhost:5000` por defecto (o en el puerto especificado en `.env`).

## Endpoints de la API

### Listar productos
- **URL:** `GET /api/productos`
- **Descripción:** Obtiene una lista de productos con soporte para paginación.
- **Parámetros opcionales:**
  - `limit`: Número de productos por página.
  - `offset`: Índice de inicio para los productos.
- **Ejemplo de solicitud:**
  ```bash
  curl 'http://localhost:5000/api/productos?limit=10&offset=0'
  ```

### Crear producto
- **URL:** `POST /api/productos`
- **Descripción:** Crea un nuevo producto.
- **Cuerpo del JSON:**
  ```json
  {
    "nombre": "Producto X",
    "precio": 100.5,
    "cantidad": 10,
    "estado": true
  }
  ```
- **Ejemplo de solicitud:**
  ```bash
  curl -X POST 'http://localhost:5000/api/productos' \
  -H 'Content-Type: application/json' \
  -d '{"nombre": "Producto X", "precio": 100.5, "cantidad": 10, "estado": true}'
  ```

### Actualizar cantidad de producto
- **URL:** `PUT /api/productos/:id`
- **Descripción:** Actualiza la cantidad de un producto y ajusta su estado automáticamente.
- **Cuerpo del JSON:**
  ```json
  {
    "cantidad": 5
  }
  ```
- **Ejemplo de solicitud:**
  ```bash
  curl -X PUT 'http://localhost:5000/api/productos/1' \
  -H 'Content-Type: application/json' \
  -d '{"cantidad": 5}'
  ```

## Notas

- La base de datos debe tener una tabla llamada `Productos` con las siguientes columnas:
  - `id` (serial, primary key)
  - `nombre` (text)
  - `precio` (numeric)
  - `cantidad` (integer)
  - `estado` (boolean)

- Puedes utilizar herramientas como Postman para probar los endpoints.

```
COLECCION EN POSTMAN: https://web.postman.co/workspace/My-Workspace~65a1ea06-5aa2-4ecc-8f3f-6d0d9db5accd/collection/26858187-dcfa3f70-9e5a-4023-910b-edcf99ebba67?action=share&source=copy-link&creator=26858187
```