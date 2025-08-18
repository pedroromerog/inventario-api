import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { StockRepository } from '../repository/stock.repository'

@Injectable()
export class DeleteStockAction {
  constructor(private readonly stockRepository: StockRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que el stock existe
    const existingStock = await this.stockRepository.findById(id)
    if (!existingStock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`)
    }

    // Verificar que no esté ya eliminado
    if (!existingStock.isActive) {
      throw new BadRequestException(`El stock con ID ${id} ya está eliminado`)
    }

    // Soft delete
    await this.stockRepository.deleteStock(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que el stock existe
    const existingStock = await this.stockRepository.findById(id)
    if (!existingStock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`)
    }

    // Hard delete
    await this.stockRepository.hardDeleteStock(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que el stock existe (incluyendo eliminados)
    const existingStock = await this.stockRepository.findOne({
      where: { id },
    })

    if (!existingStock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`)
    }

    // Verificar que esté eliminado
    if (existingStock.isActive) {
      throw new BadRequestException(`El stock con ID ${id} no está eliminado`)
    }

    // Restaurar
    await this.stockRepository.restoreStock(id)
  }
}
