import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Movimiento } from './entities/movimiento.entity'
import { Stock } from '../stock/entities/stock.entity'
import { MovimientosController } from './movimientos.controller'
import { MovimientosService } from './movimientos.service'
import { MovimientosRepository } from './repository/movimientos.repository'
import { StockRepository } from '../stock/repository/stock.repository'
import { CreateMovimientoAction } from './use-case/create-movimiento.usecase'
import { GetMovimientoAction } from './use-case/get-movimiento.usecase'
import { UpdateMovimientoAction } from './use-case/update-movimiento.usecase'
import { UpdateMovimientoStatusAction } from './use-case/update-movimiento-status.usecase'
import { DeleteMovimientoAction } from './use-case/delete-movimiento.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Movimiento, Stock])],
  controllers: [MovimientosController],
  providers: [
    MovimientosService,
    MovimientosRepository,
    StockRepository,
    CreateMovimientoAction,
    GetMovimientoAction,
    UpdateMovimientoAction,
    UpdateMovimientoStatusAction,
    DeleteMovimientoAction,
  ],
  exports: [MovimientosService, MovimientosRepository],
})
export class MovimientosModule {}
