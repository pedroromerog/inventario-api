import { Injectable, NotFoundException } from '@nestjs/common'
import { StockRepository } from '../repository/stock.repository'
import { Stock } from '../entities/stock.entity'
import { EstadoStock } from '../enums/stock.enums'

@Injectable()
export class GetStockAction {
  constructor(private readonly stockRepository: StockRepository) {}

  async findById(id: number): Promise<Stock> {
    const stock = await this.stockRepository.findById(id)
    if (!stock) {
      throw new NotFoundException(`Stock con ID ${id} no encontrado`)
    }
    return stock
  }

  async findByProductoAndBodega(
    productoId: number,
    bodegaId: number,
  ): Promise<Stock> {
    const stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )
    if (!stock) {
      throw new NotFoundException(
        `Stock no encontrado para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }
    return stock
  }

  async findAll(): Promise<Stock[]> {
    return this.stockRepository.findActive()
  }

  async findByProducto(productoId: number): Promise<Stock[]> {
    return this.stockRepository.findByProducto(productoId)
  }

  async findByBodega(bodegaId: number): Promise<Stock[]> {
    return this.stockRepository.findByBodega(bodegaId)
  }

  async findByEstado(estado: EstadoStock): Promise<Stock[]> {
    return this.stockRepository.findByEstado(estado)
  }

  async findLowStock(): Promise<Stock[]> {
    return this.stockRepository.findLowStock()
  }

  async findOutOfStock(): Promise<Stock[]> {
    return this.stockRepository.findOutOfStock()
  }

  async findOverStock(): Promise<Stock[]> {
    return this.stockRepository.findOverStock()
  }

  async searchByTerm(term: string): Promise<Stock[]> {
    return this.stockRepository.searchByTerm(term)
  }

  async findStockSummary(): Promise<any[]> {
    return this.stockRepository.findStockSummary()
  }
}
