import { registerAs } from '@nestjs/config'

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  refreshSecret:
    process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  issuer: process.env.JWT_ISSUER || 'inventario-api',
  audience: process.env.JWT_AUDIENCE || 'inventario-app',
}))
