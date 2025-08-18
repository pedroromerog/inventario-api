import { Injectable, ConflictException } from '@nestjs/common'
import { StockRepository } from '../repository/stock.repository'
import { CreateStockDto } from '../dto/create-stock.dto'
import { Stock } from '../entities/stock.entity'

@Injectable()
export class CreateStockAction {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(createStockDto: CreateStockDto): Promise<Stock> {
    // Verificar que no exista stock para el mismo producto en la misma bodega
    const existingStock = await this.stockRepository.findByProductoAndBodega(
      createStockDto.productoId,
      createStockDto.bodegaId,
    )

    if (existingStock) {
      throw new ConflictException(
        `Ya existe stock para el producto ${createStockDto.productoId} en la bodega ${createStockDto.bodegaId}`,
      )
    }

    // Crear el stock
    return this.stockRepository.createStock(createStockDto)
  }
}
