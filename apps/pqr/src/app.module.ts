import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

// Módulos de configuración
import { ConfiguracionModule } from './modules/configuracion/configuracion.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { OrganigramaModule } from './modules/organigrama/organigrama.module'
import { PqrModule } from './modules/pqr/pqr.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME_PQR || 'pqr_db',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ConfiguracionModule,
    UsersModule,
    AuthModule,
    OrganigramaModule,
    PqrModule,
  ],
})
export class AppModule {}
