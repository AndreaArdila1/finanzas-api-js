# Finanzas API

API REST para la gestión de finanzas personales: usuarios, categorías y transacciones de ingresos y gastos.

Construida con **NestJS**, **Prisma** y **PostgreSQL**, con autenticación JWT, control de roles y documentación interactiva via Swagger.

---

## Características

- Autenticación JWT (registro e inicio de sesión)
- Roles: `USUARIO` y `ADMIN`
- CRUD de categorías (catálogo global; escritura solo para ADMIN)
- CRUD de transacciones propias; vista administrativa de todas
- Validación de datos con `class-validator`
- Rate limiting, helmet y CORS
- Documentación OpenAPI en `/docs`

---

## Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Framework | NestJS 12 (TypeScript, ESM) |
| ORM | Prisma 7 |
| Base de datos | PostgreSQL |
| Auth | JWT (`@nestjs/jwt` + Passport) |
| Validación | `class-validator` + `class-transformer` |
| Seguridad | `helmet`, `@nestjs/throttler` |
| Docs | `@nestjs/swagger` |
| Tests | Vitest + Supertest |
| Paquetes | pnpm |

---

## Requisitos previos

- Node.js 20+
- pnpm
- PostgreSQL corriendo en local (o una instancia accesible)

---

## Instalación

```bash
pnpm install
```

---

## Variables de entorno

Copia el archivo de ejemplo y completa tus valores:

```bash
cp .env.example .env
```

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL | `postgresql://postgres:123456789@localhost:5432/finanzas_api?schema=public` |
| `JWT_SECRET` | Clave secreta para firmar los tokens JWT | valor aleatorio fuerte |
| `JWT_EXPIRES_IN` | Duración del access token | `1h` |

> **Importante:** `JWT_SECRET` debe ser secreta y distinta en cada entorno. No la subas a control de versiones.

---

## Base de datos

Las migraciones viven en `prisma/migrations/`.

```bash
# Aplicar migraciones pendientes
npx prisma migrate deploy

# En desarrollo, crear migración a partir de cambios en schema.prisma
npx prisma migrate dev

# Regenerar el cliente de Prisma
npx prisma generate

# Abrir Prisma Studio (UI para inspeccionar datos)
npx prisma studio
```

El cliente se genera en `src/generated/prisma/` (no editar a mano).

---

## Ejecutar la API

```bash
# Desarrollo (watch)
pnpm start:dev

# Compilar y ejecutar
pnpm build
pnpm start:prod
```

Por defecto la API escucha en `http://localhost:3000`.

### Documentación Swagger

Con la API en marcha, abre:

```
http://localhost:3000/docs
```

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm start:dev` | Arranque en modo desarrollo con recarga |
| `pnpm build` | Compilar a `dist/` |
| `pnpm start:prod` | Ejecutar desde `dist/` |
| `pnpm lint` | Lint con oxlint (type-aware) |
| `pnpm format` | Formatear código con Prettier |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm test:cov` | Tests con cobertura |
| `pnpm test:e2e` | Tests end-to-end |

---

## Modelo de datos

### `Usuario`
- `id`, `nombre`, `email` (único), `password` (hash bcrypt), `rol`, `creadoEn`
- Relación 1→N con `Transaccion`

### `Categoria`
- `id`, `nombre` (único), `creadoEn`
- Relación 1→N con `Transaccion`
- Catálogo global compartido entre usuarios

### `Transaccion`
- `id`, `descripcion`, `monto` (Decimal 12,2), `tipo` (`INGRESO` | `GASTO`), `fecha`, `categoriaId`, `usuarioId`
- Relación N→1 con `Categoria` y `Usuario`

---

## Autenticación y autorización

1. **Registro:** `POST /auth/register` crea un usuario con rol `USUARIO`.
2. **Login:** `POST /auth/login` devuelve un `access_token` JWT.
3. **Uso:** envía el token en cada request protegido:

```http
Authorization: Bearer <access_token>
```

| Rol | Permisos |
|-----|----------|
| `USUARIO` | CRUD de transacciones propias; lectura de categorías |
| `ADMIN` | Todo lo anterior + CRUD de categorías + listar todas las transacciones |

---

## Endpoints

### Públicos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/` | Health check / Hello World |
| `POST` | `/auth/register` | Registrar usuario |
| `POST` | `/auth/login` | Obtener access token |

### Categorías (requieren JWT)

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `GET` | `/categorias` | Cualquiera | Listar categorías |
| `GET` | `/categorias/:id` | Cualquiera | Obtener una categoría |
| `POST` | `/categorias` | `ADMIN` | Crear categoría |
| `PATCH` | `/categorias/:id` | `ADMIN` | Actualizar categoría |
| `DELETE` | `/categorias/:id` | `ADMIN` | Eliminar categoría |

> Si una categoría tiene transacciones asociadas, el DELETE falla (FK `RESTRICT`).

### Transacciones (requieren JWT)

| Método | Ruta | Rol | Descripción |
|--------|------|-----|-------------|
| `POST` | `/transacciones` | Cualquiera | Crear transacción propia |
| `GET` | `/transacciones` | Cualquiera | Listar transacciones propias |
| `GET` | `/transacciones/admin/todas` | `ADMIN` | Listar todas las transacciones |
| `GET` | `/transacciones/:id` | Dueño | Obtener una transacción |
| `PATCH` | `/transacciones/:id` | Dueño | Actualizar transacción propia |
| `DELETE` | `/transacciones/:id` | Dueño | Eliminar transacción propia |

---

## Ejemplo de uso

### Registrar usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Pérez","email":"ana@correo.com","password":"clave1234"}'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@correo.com","password":"clave1234"}'
```

Respuesta:

```json
{ "access_token": "eyJhbGciOi..." }
```

### Crear una transacción

```bash
curl -X POST http://localhost:3000/transacciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"descripcion":"Mercado","monto":45.5,"tipo":"GASTO","categoriaId":1}'
```

---

## Estructura del proyecto

```
finanzas-api/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed (opcional)
├── src/
│   ├── main.ts                 # Bootstrap (helmet, CORS, validación, Swagger)
│   ├── app.module.ts           # Módulo raíz + throttler global
│   ├── auth/                   # JWT, roles, registro y login
│   ├── categorias/             # CRUD de categorías
│   ├── transacciones/          # CRUD de transacciones
│   ├── prisma/                 # PrismaService y módulo global
│   ├── common/filters/         # Filtro de errores de Prisma
│   └── generated/prisma/       # Cliente generado (no editar)
├── test/                       # Tests e2e
├── .env.example
└── package.json
```

---

## Seguridad

- Contraseñas con bcrypt (cost factor 10)
- Tokens JWT con expiración configurable
- Rate limiting global y más estricto en `/auth/login` (5 req/min)
- Cabeceras de seguridad con helmet
- Validación global de payloads (`whitelist: true`)
- Manejo de errores de Prisma (404/409/400)

---

## Licencia

Proyecto privado con fines educativos (módulo 3).
