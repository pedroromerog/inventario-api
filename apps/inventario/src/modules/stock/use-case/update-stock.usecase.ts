import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { StockRepository } from '../repository/stock.repository'
import { UpdateStockDto } from '../dto/update-stock.dto'
import { Stock } from '../entities/stock.entity'

@Injectable()
export class UpdateStockAction {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    // Verificar que el stock existe
    const existingStock = await this.stockRepository.findById(id)
    if (!existingStock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`)
    }

    // Si se está cambiando producto o bodega, verificar que no exista conflicto
    if (updateStockDto.productoId || updateStockDto.bodegaId) {
      const newProductoId =
        updateStockDto.productoId || existingStock.productoId
      const newBodegaId = updateStockDto.bodegaId || existingStock.bodegaId

      if (
        newProductoId !== existingStock.productoId ||
        newBodegaId !== existingStock.bodegaId
      ) {
        const conflictingStock =
          await this.stockRepository.findByProductoAndBodega(
            newProductoId,
            newBodegaId,
          )
        if (conflictingStock && conflictingStock.id !== id) {
          throw new ConflictException(
            `Ya existe stock para el producto ${newProductoId} en la bodega ${newBodegaId}`,
          )
        }
      }
    }

    // Actualizar el stock
    const updatedStock = await this.stockRepository.updateStock(
      id,
      updateStockDto,
    )
    if (!updatedStock) {
      throw new NotFoundException(`Error al actualizar el stock con ID ${id}`)
    }

    return updatedStock
  }

  async updateStockQuantities(
    productoId: number,
    bodegaId: number,
    stockActual: number,
    stockReservado: number,
  ): Promise<void> {
    // Verificar que el stock existe
    const existingStock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )
    if (!existingStock) {
      throw new NotFoundException(
        `Stock no encontrado para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }

    // Actualizar cantidades
    await this.stockRepository.updateStockQuantities(
      productoId,
      bodegaId,
      stockActual,
      stockReservado,
    )
  }
}
