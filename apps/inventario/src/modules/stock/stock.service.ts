import { Injectable } from '@nestjs/common'
import { CreateStockAction } from './use-case/create-stock.usecase'
import { GetStockAction } from './use-case/get-stock.usecase'
import { UpdateStockAction } from './use-case/update-stock.usecase'
import { StockOperationsAction } from './use-case/stock-operations.usecase'
import { DeleteStockAction } from './use-case/delete-stock.usecase'
import { StockRepository } from './repository/stock.repository'
import { CreateStockDto } from './dto/create-stock.dto'
import { UpdateStockDto } from './dto/update-stock.dto'
import { Stock } from './entities/stock.entity'
import { EstadoStock } from './enums/stock.enums'

@Injectable()
export class StockService {
  constructor(
    private readonly createStockAction: CreateStockAction,
    private readonly getStockAction: GetStockAction,
    private readonly updateStockAction: UpdateStockAction,
    private readonly stockOperationsAction: StockOperationsAction,
    private readonly deleteStockAction: DeleteStockAction,
    private readonly stockRepository: StockRepository,
  ) {}

  async create(createStockDto: CreateStockDto): Promise<Stock> {
    return this.createStockAction.execute(createStockDto)
  }

  async findAll(): Promise<Stock[]> {
    return this.getStockAction.findAll()
  }

  async findOne(id: number): Promise<Stock> {
    return this.getStockAction.findById(id)
  }

  async findByProductoAndBodega(
    productoId: number,
    bodegaId: number,
  ): Promise<Stock> {
    return this.getStockAction.findByProductoAndBodega(productoId, bodegaId)
  }

  async findByProducto(productoId: number): Promise<Stock[]> {
    return this.getStockAction.findByProducto(productoId)
  }

  async findByBodega(bodegaId: number): Promise<Stock[]> {
    return this.getStockAction.findByBodega(bodegaId)
  }

  async findByEstado(estado: EstadoStock): Promise<Stock[]> {
    return this.getStockAction.findByEstado(estado)
  }

  async findLowStock(): Promise<Stock[]> {
    return this.getStockAction.findLowStock()
  }

  async findOutOfStock(): Promise<Stock[]> {
    return this.getStockAction.findOutOfStock()
  }

  async findOverStock(): Promise<Stock[]> {
    return this.getStockAction.findOverStock()
  }

  async searchByTerm(term: string): Promise<Stock[]> {
    return this.getStockAction.searchByTerm(term)
  }

  async findStockSummary(): Promise<any[]> {
    return this.getStockAction.findStockSummary()
  }

  async update(id: number, updateStockDto: UpdateStockDto): Promise<Stock> {
    return this.updateStockAction.execute(id, updateStockDto)
  }

  async updateStockQuantities(
    productoId: number,
    bodegaId: number,
    stockActual: number,
    stockReservado: number,
  ): Promise<void> {
    await this.updateStockAction.updateStockQuantities(
      productoId,
      bodegaId,
      stockActual,
      stockReservado,
    )
  }

  async remove(id: number): Promise<void> {
    return this.deleteStockAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteStockAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteStockAction.hardDelete(id)
  }

  // Métodos para operaciones de stock
  async reserveStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<Stock> {
    return this.stockOperationsAction.reserveStock(
      productoId,
      bodegaId,
      cantidad,
    )
  }

  async releaseStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<Stock> {
    return this.stockOperationsAction.releaseStock(
      productoId,
      bodegaId,
      cantidad,
    )
  }

  async consumeReservedStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<Stock> {
    return this.stockOperationsAction.consumeReservedStock(
      productoId,
      bodegaId,
      cantidad,
    )
  }

  async getTotalStockByProduct(productoId: number): Promise<{
    stockActual: number
    stockReservado: number
    stockDisponible: number
    bodegas: Array<{
      bodegaId: number
      bodegaNombre: string
      stockActual: number
      stockReservado: number
      stockDisponible: number
    }>
  }> {
    return this.stockOperationsAction.getTotalStockByProduct(productoId)
  }

  async checkStockAvailability(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<{
    disponible: boolean
    stockActual: number
    stockReservado: number
    stockDisponible: number
    mensaje: string
  }> {
    return this.stockOperationsAction.checkStockAvailability(
      productoId,
      bodegaId,
      cantidad,
    )
  }
}
