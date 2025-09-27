import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Pqr } from './entities/pqr.entity'
import { Trazabilidad } from './entities/trazabilidad.entity'
import { Ciudadano } from '../users/entities/ciudadano.entity'
import { User } from '../users/entities/user.entity'
import { Secretaria } from '../organigrama/entities/secretaria.entity'
import { Dependencia } from '../organigrama/entities/dependencia.entity'
import { PqrService } from './pqr.service'
import { PqrController } from './pqr.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Pqr,
      Trazabilidad,
      Ciudadano,
      User,
      Secretaria,
      Dependencia,
    ]),
  ],
  controllers: [PqrController],
  providers: [PqrService],
  exports: [PqrService],
})
export class PqrModule {}
