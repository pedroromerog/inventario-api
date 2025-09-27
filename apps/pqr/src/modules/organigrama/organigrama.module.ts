import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Secretaria } from './entities/secretaria.entity'
import { Dependencia } from './entities/dependencia.entity'
import { OrganigramaService } from './organigrama.service'
import { OrganigramaController } from './organigrama.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Secretaria, Dependencia])],
  controllers: [OrganigramaController],
  providers: [OrganigramaService],
  exports: [OrganigramaService],
})
export class OrganigramaModule {}
