import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { InventarioModule } from './inventario.module'
import cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(InventarioModule)

  // Configurar cookie parser
  app.use(cookieParser())

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Configurar CORS para cookies
  const corsOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.CORS_ORIGIN || 'https://tudominio.com']
      : [
          'http://localhost:4200',
          'http://localhost:4201',
          'http://localhost:4203',
        ]

  app.enableCors({
    origin: corsOrigins,
    credentials: true, // Importante para cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Inventario API')
    .setDescription('API de gestión de inventario con autenticación JWT')
    .setVersion('1.0')
    .addTag(
      'Autenticación',
      'Endpoints para login, registro y gestión de tokens',
    )
    .addTag('Usuarios', 'Gestión de usuarios del sistema')
    .addTag('Productos', 'Gestión de productos e inventario')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa el token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: 'Inventario API - Documentación',
  })

  const port = process.env.PORT || 3000
  console.log(`🚀 Aplicación iniciada en el puerto ${port}`)
  console.log(
    `📚 Documentación Swagger disponible en: http://localhost:${port}/api/docs`,
  )

  await app.listen(port)
}
bootstrap()
