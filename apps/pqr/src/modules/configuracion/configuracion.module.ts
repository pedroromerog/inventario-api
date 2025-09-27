import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfiguracionEntidad } from './entities/configuracion.entity'
import { ConfiguracionService } from './configuracion.service'
import { ConfiguracionController } from './configuracion.controller'

@Module({
  imports: [TypeOrmModule.forFeature([ConfiguracionEntidad])],
  controllers: [ConfiguracionController],
  providers: [ConfiguracionService],
  exports: [ConfiguracionService],
})
export class ConfiguracionModule {}
