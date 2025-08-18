import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bodega } from './entities/bodega.entity'
import { BodegasController } from './bodegas.controller'
import { BodegasService } from './bodegas.service'
import { BodegasRepository } from './repository/bodegas.repository'
import { CreateBodegaAction } from './use-case/create-bodega.usecase'
import { GetBodegaAction } from './use-case/get-bodega.usecase'
import { UpdateBodegaAction } from './use-case/update-bodega.usecase'
import { DeleteBodegaAction } from './use-case/delete-bodega.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Bodega])],
  controllers: [BodegasController],
  providers: [
    BodegasService,
    BodegasRepository,
    CreateBodegaAction,
    GetBodegaAction,
    UpdateBodegaAction,
    DeleteBodegaAction,
  ],
  exports: [BodegasService, BodegasRepository],
})
export class BodegasModule {}
