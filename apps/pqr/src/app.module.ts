import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

// Módulos de configuración
import { AuthModule } from './modules/auth/auth.module'
import { ConfiguracionModule } from './modules/configuracion/configuracion.module'
import { OrganigramaModule } from './modules/organigrama/organigrama.module'
import { PqrModule } from './modules/pqr/pqr.module'
import { UsersModule } from './modules/users/users.module'
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      cache: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME_PQR || 'pqr_db',
      autoLoadEntities: true,
      logger: 'advanced-console',
      logging: 'all',
      synchronize: process.env.NODE_ENV !== 'production',
      namingStrategy: new SnakeNamingStrategy(),
    }),
    ConfiguracionModule,
    UsersModule,
    AuthModule,
    OrganigramaModule,
    PqrModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
