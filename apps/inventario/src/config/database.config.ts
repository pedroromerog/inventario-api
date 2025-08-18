import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'inventario_db',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['src/database/migrations/*.ts', 'dist/database/migrations/*.js'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false,
  // Configuración adicional para asegurar que las entidades se carguen
  autoLoadEntities: true,
  keepConnectionAlive: true,
}))
