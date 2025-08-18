import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// Importar todos los módulos de la aplicación
import { AuthModule } from './modules/auth/auth.module'
import { BodegasModule } from './modules/bodegas/bodegas.module'
import { CategoriasModule } from './modules/categorias/categorias.module'
import { EmpleadosModule } from './modules/empleados/empleados.module'
import { MovimientosModule } from './modules/movimientos/movimientos.module'
import { ProductosModule } from './modules/productos/productos.module'
import { ProveedoresModule } from './modules/proveedores/proveedores.module'
import { RolesModule } from './modules/roles/roles.module'
import { StockModule } from './modules/stock/stock.module'
import { UsersModule } from './modules/users/users.module'

// Configuraciones
import appConfig from './config/app.config'
import databaseConfig from './config/database.config'
import jwtConfig from './config/jwt.config'

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
      envFilePath: '.env',
    }),

    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => ({
        type: configService.get('database.type'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: configService.get('database.entities'),
        migrations: configService.get('database.migrations'),
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
        migrationsRun: configService.get('database.migrationsRun'),
        migrationsTableName: configService.get('database.migrationsTableName'),
        ssl: configService.get('database.ssl'),
        autoLoadEntities: true,
        keepConnectionAlive: true,
      }),
      inject: [ConfigService],
    }),

    // Módulos de la aplicación
    AuthModule,
    BodegasModule,
    CategoriasModule,
    EmpleadosModule,
    MovimientosModule,
    ProductosModule,
    ProveedoresModule,
    RolesModule,
    StockModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class InventarioModule {}
