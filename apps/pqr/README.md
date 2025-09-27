# Sistema PQR - Backend

Sistema de Peticiones, Quejas y Reclamos (PQR) para entidad pública desarrollado con NestJS, TypeORM y PostgreSQL.

## Características

- **Autenticación JWT** con roles de usuario
- **Gestión de usuarios** (ciudadanos, funcionarios, administradores)
- **Organigrama** (secretarías y dependencias)
- **Sistema PQR completo** con trazabilidad
- **Generación automática de radicados**
- **Cálculo de SLA** excluyendo fines de semana
- **Validación de datos** con class-validator

## Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada de la aplicación
├── app.module.ts             # Módulo principal
└── modules/
    ├── configuracion/         # Configuración del sistema
    ├── users/                 # Gestión de usuarios y ciudadanos
    ├── auth/                  # Autenticación y autorización
    ├── organigrama/           # Secretarías y dependencias
    └── pqr/                   # Sistema PQR principal
```

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npm run migration:run

# Iniciar en modo desarrollo
npm run start:dev
```

## Variables de Entorno

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=pqr_db

# JWT
JWT_SECRET=your-secret-key

# Aplicación
NODE_ENV=development
PORT=3000
```

## API Endpoints

### Autenticación

- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registro de ciudadanos

### Configuración

- `GET /configuracion` - Obtener configuración
- `PUT /configuracion` - Actualizar configuración (admin)

### Usuarios

- `GET /users` - Listar usuarios (admin)
- `POST /users` - Crear usuario (admin)
- `GET /users/:id` - Obtener usuario
- `PATCH /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

### Ciudadanos

- `GET /users/ciudadanos` - Listar ciudadanos
- `POST /users/ciudadanos` - Crear ciudadano
- `GET /users/ciudadanos/:id` - Obtener ciudadano
- `PATCH /users/ciudadanos/:id` - Actualizar ciudadano
- `DELETE /users/ciudadanos/:id` - Eliminar ciudadano

### Organigrama

- `GET /organigrama/secretarias` - Listar secretarías
- `POST /organigrama/secretarias` - Crear secretaría
- `GET /organigrama/dependencias` - Listar dependencias
- `POST /organigrama/dependencias` - Crear dependencia

### PQR

- `POST /pqr` - Crear PQR
- `GET /pqr` - Listar PQRs (funcionarios)
- `GET /pqr/:id` - Obtener PQR
- `PATCH /pqr/:id` - Actualizar PQR
- `POST /pqr/trazabilidad` - Crear trazabilidad

## Roles de Usuario

- **ciudadano**: Puede crear PQRs
- **funcionario**: Puede gestionar PQRs asignados
- **lider_dependencia**: Puede gestionar PQRs de su dependencia
- **administrador**: Acceso completo al sistema
- **auditor**: Solo lectura

## Generación de Radicados

Los radicados se generan automáticamente con el formato:
`ALC-PQR-YYYY-NNNNN`

Ejemplo: `ALC-PQR-2024-00001`

## Cálculo de SLA

El sistema calcula automáticamente la fecha de vencimiento:

- **Peticiones**: 15 días hábiles
- **Quejas**: 15 días hábiles
- **Reclamos**: 15 días hábiles
- **Sugerencias**: 15 días hábiles
- **Denuncias**: 15 días hábiles

Los fines de semana se excluyen del cálculo.

## Trazabilidad

Cada PQR tiene un historial completo de actuaciones:

- Creación
- Asignación de secretaría
- Asignación de funcionario
- Reasignación
- Proyección de respuesta
- Respuesta oficial
- Cierre

## Tecnologías

- **NestJS**: Framework de Node.js
- **TypeORM**: ORM para TypeScript
- **PostgreSQL**: Base de datos
- **JWT**: Autenticación
- **bcrypt**: Hashing de contraseñas
- **class-validator**: Validación de datos
- **passport**: Estrategias de autenticación

## Desarrollo

```bash
# Ejecutar tests
npm run test

# Ejecutar tests con coverage
npm run test:cov

# Linting
npm run lint

# Formatear código
npm run format
```

## Producción

```bash
# Construir aplicación
npm run build

# Ejecutar en producción
npm run start:prod
```
