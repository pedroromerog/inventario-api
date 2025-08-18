import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Movimiento } from './entities/movimiento.entity'
import { MovimientosController } from './movimientos.controller'
import { MovimientosService } from './movimientos.service'
import { MovimientosRepository } from './repository/movimientos.repository'
import { CreateMovimientoAction } from './use-case/create-movimiento.usecase'
import { GetMovimientoAction } from './use-case/get-movimiento.usecase'
import { UpdateMovimientoAction } from './use-case/update-movimiento.usecase'
import { DeleteMovimientoAction } from './use-case/delete-movimiento.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento])],
  controllers: [MovimientosController],
  providers: [
    MovimientosService,
    MovimientosRepository,
    CreateMovimientoAction,
    GetMovimientoAction,
    UpdateMovimientoAction,
    DeleteMovimientoAction,
  ],
  exports: [MovimientosService, MovimientosRepository],
})
export class MovimientosModule {}
