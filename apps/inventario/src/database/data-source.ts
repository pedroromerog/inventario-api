import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { config } from 'dotenv'

// Cargar variables de entorno
config()

const configService = new ConfigService()

export const AppDataSource = new DataSource({
  type: (configService.get('database.type') || 'postgres') as 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password') || 'password',
  database: (configService.get('database.database') || 'inventario') as string,
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
  entities: configService.get('database.entities'),
  migrations: configService.get('database.migrations'),
  migrationsRun: configService.get('database.migrationsRun'),
  migrationsTableName: configService.get('database.migrationsTableName'),
  ssl: configService.get('database.ssl'),
})

// Inicializar la conexión
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Data Source ha sido inicializado exitosamente')
  })
  .catch((err) => {
    console.error('❌ Error durante la inicialización del Data Source:', err)
  })
