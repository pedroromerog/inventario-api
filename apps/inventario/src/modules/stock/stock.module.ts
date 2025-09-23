import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Stock } from './entities/stock.entity'
import { StockController } from './stock.controller'
import { StockService } from './stock.service'
import { StockRepository } from './repository/stock.repository'
import { CreateStockAction } from './use-case/create-stock.usecase'
import { GetStockAction } from './use-case/get-stock.usecase'
import { UpdateStockAction } from './use-case/update-stock.usecase'
import { StockOperationsAction } from './use-case/stock-operations.usecase'
import { DeleteStockAction } from './use-case/delete-stock.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Stock])],
  controllers: [StockController],
  providers: [
    StockService,
    StockRepository,
    CreateStockAction,
    GetStockAction,
    UpdateStockAction,
    StockOperationsAction,
    DeleteStockAction,
  ],
  exports: [StockService, StockRepository],
})
export class StockModule {}
