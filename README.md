# Proyecto final de Node.js

API REST para administrar productos con Express, Firestore y autenticación JWT.

API publicada: [entrega-final-node-ebon.vercel.app](https://entrega-final-node-ebon.vercel.app).

Consultar el catálogo: [GET /api/products](https://entrega-final-node-ebon.vercel.app/api/products).

## Ejecución local

Requiere Node.js 22 y un proyecto de Firebase con Firestore y Authentication.

```sh
npm install
cp .env.example .env
```

Completar `.env` con la configuración de la aplicación web de Firebase,
un `JWT_SECRET` de al menos 32 caracteres y el UID del administrador en `ADMIN_UIDS`.
Luego ejecutar `npm run start`. El servidor se inicia en `http://localhost:3000`.

## Rutas

| Método | Ruta | Acceso |
| --- | --- | --- |
| GET | `/api/products` | Público |
| GET | `/api/products/:id` | Público |
| POST | `/auth/login` | Email y contraseña |
| POST | `/api/products/create` | Administrador |
| PUT | `/api/products/:id` | Administrador |
| DELETE | `/api/products/:id` | Administrador |

El login recibe las credenciales de un usuario de Firebase Authentication:

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña"
}
```

Devuelve `token`, `tokenType`, `expiresIn` y los datos del usuario.
El token dura una hora y se envía en las operaciones protegidas:

```text
Authorization: Bearer <token>
```

Para crear un producto:

```json
{
  "title": "Remera estampada",
  "price": 15000,
  "category": "remeras",
  "description": "Remera de algodón",
  "image": ""
}
```

`title`, `price` y `category` son obligatorios. El precio debe ser numérico y no
negativo. PUT permite actualizar solamente los campos enviados, por ejemplo
`{"price": 18000}`. Crear devuelve 201; las demás operaciones exitosas devuelven 200.

## Firebase

1. Crear un proyecto y una aplicación web en Firebase.
2. Crear la base de datos Firestore y habilitar Email/Password en Authentication.
3. Crear el usuario administrador en Authentication y copiar su UID a `ADMIN_UIDS`.
4. En Firestore, crear el documento `admins/<UID>` con el campo `activo: true`.
5. Publicar las reglas incluidas en `firestore.rules`.
6. Crear el primer producto desde la API con el usuario administrador.

Las lecturas del catálogo son públicas. Las escrituras requieren un usuario
administrador tanto en la API como en las reglas de Firestore.

## Estructura

`index.js` configura el servidor. La carpeta `src` contiene rutas, controladores,
servicios, modelos, middlewares y configuración.

## Errores

- 400: datos o JSON inválidos.
- 401: credenciales incorrectas, token ausente, inválido o vencido.
- 403: usuario sin permisos de administrador.
- 404: producto o ruta inexistente.
- 500: error interno o del servicio de datos.

## Vercel

Importar el repositorio en Vercel y agregar las variables de `.env.example` en la
configuración del proyecto. Vercel detecta Express y usa `index.js` como entrada.
El archivo `.env` se conserva localmente y no se sube al repositorio.
