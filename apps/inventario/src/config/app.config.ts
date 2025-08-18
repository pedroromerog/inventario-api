import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Inventario API',
  version: process.env.APP_VERSION || '1.0.0',
  port: parseInt(process.env.PORT || '3000', 10),
  environment: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || 'api',
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite por IP
  },
}))
