# Implementación de Autenticación por Cookies en NestJS

## Descripción

Esta implementación permite validar tokens JWT desde cookies HTTP en lugar de headers de autorización, proporcionando mayor seguridad y facilidad de uso.

## Características

- **Tokens almacenados en cookies**: Los tokens JWT se almacenan en cookies `httpOnly` para mayor seguridad
- **Validación automática**: Las cookies se envían automáticamente en cada request
- **Protección CSRF**: Configuración `sameSite: 'strict'` para prevenir ataques CSRF
- **Fallback a headers**: Mantiene compatibilidad con tokens en headers Authorization
- **Configuración centralizada**: Opciones de cookies configuradas en un archivo central

## Archivos Modificados

### 1. Estrategia JWT (`jwt.strategy.ts`)

- Configurada para extraer tokens desde cookies como método principal
- Mantiene fallback a headers Authorization

### 2. Middleware de Cookies (`main.ts`)

- Agregado `cookie-parser` para parsear cookies
- Configurado CORS con `credentials: true`

### 3. Acciones de Autenticación

- **LoginAction**: Establece cookies al iniciar sesión
- **RefreshTokenAction**: Renueva cookies al refrescar tokens

### 4. Servicio de Autenticación (`auth.service.ts`)

- Métodos actualizados para manejar cookies
- Limpieza de cookies en logout

### 5. Controlador de Autenticación (`auth.controller.ts`)

- Endpoints actualizados para trabajar con cookies
- Extracción de refresh token desde cookies

### 6. Configuración de Cookies (`cookie.config.ts`)

- Configuración centralizada de opciones de cookies
- Opciones de seguridad predefinidas

## Configuración de Cookies

```typescript
export const cookieConfig = {
  accessToken: {
    name: 'access_token',
    options: {
      httpOnly: true, // Previene acceso desde JavaScript
      secure: true, // Solo HTTPS en producción
      sameSite: 'strict', // Protección CSRF
      maxAge: 60 * 60 * 1000, // 1 hora por defecto
    },
  },
  refreshToken: {
    name: 'refresh_token',
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    },
  },
}
```

## Flujo de Autenticación

### 1. Login

1. Usuario envía credenciales
2. Sistema valida credenciales
3. Se generan tokens JWT
4. Se establecen cookies `httpOnly`
5. Se retorna información del usuario (sin tokens)

### 2. Validación de Tokens

1. Sistema extrae token desde cookie `access_token`
2. Si no existe, fallback a header Authorization
3. Se valida el token JWT
4. Se actualiza último acceso del usuario

### 3. Refresh de Tokens

1. Sistema extrae refresh token desde cookie `refresh_token`
2. Se valida el refresh token
3. Se generan nuevos tokens
4. Se actualizan las cookies

### 4. Logout

1. Se limpian las cookies de autenticación
2. Se retorna mensaje de éxito

## Endpoints Disponibles

- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Refrescar token
- `POST /auth/logout` - Cerrar sesión
- `POST /auth/change-password` - Cambiar contraseña
- `POST /auth/profile` - Obtener perfil (POST)
- `GET /auth/profile` - Obtener perfil (GET)
- `GET /auth/verify-token` - Verificar token

## Ventajas de usar Cookies

1. **Seguridad**: `httpOnly` previene acceso desde JavaScript (XSS)
2. **Automatismo**: Se envían automáticamente en cada request
3. **CSRF Protection**: `sameSite: 'strict'` protege contra ataques CSRF
4. **No manejo manual**: Frontend no necesita almacenar tokens
5. **Compatibilidad**: Mantiene soporte para headers Authorization

## Consideraciones

- **CORS**: Configurar `credentials: true` si el frontend está en dominio diferente
- **HTTPS**: En producción, cookies `secure: true` requieren HTTPS
- **Dominios**: Las cookies se envían solo al dominio que las estableció
- **Tamaño**: Las cookies tienen límite de tamaño (4KB por cookie)

## Uso en Frontend

### Configuración de Axios/Fetch

```typescript
// Configurar para enviar cookies
axios.defaults.withCredentials = true

// O en fetch
fetch('/api/endpoint', {
  credentials: 'include',
})
```

### Configuración de CORS

```typescript
app.enableCors({
  origin: ['http://localhost:3000', 'https://tudominio.com'],
  credentials: true, // Importante para cookies
})
```

## Dependencias Instaladas

```bash
npm install cookie-parser @types/cookie-parser
```

## Variables de Entorno

```env
NODE_ENV=production  # Para cookies secure: true
JWT_SECRET=tu-secret-jwt
JWT_REFRESH_SECRET=tu-secret-refresh
CORS_ORIGIN=https://tudominio.com
```

## Testing

Para probar la implementación:

1. Hacer login para establecer cookies
2. Verificar que las cookies se establecen correctamente
3. Hacer requests a endpoints protegidos
4. Verificar que la autenticación funciona sin enviar tokens manualmente
5. Probar refresh de tokens
6. Verificar logout limpia las cookies

## Troubleshooting

### Cookies no se establecen

- Verificar que `cookie-parser` esté configurado
- Verificar configuración CORS con `credentials: true`

### Autenticación falla

- Verificar que las cookies se envían correctamente
- Verificar configuración de la estrategia JWT
- Verificar que las cookies no expiraron

### CORS errors

- Verificar configuración de `origin` en CORS
- Verificar `credentials: true` en CORS
- Verificar configuración del frontend para enviar cookies

