import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { StockRepository } from '../repository/stock.repository'
import { Stock } from '../entities/stock.entity'

@Injectable()
export class StockOperationsAction {
  constructor(private readonly stockRepository: StockRepository) {}

  /**
   * Reserva stock para un producto en una bodega específica
   */
  async reserveStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<Stock> {
    const stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      throw new NotFoundException(
        `No existe stock para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }

    const nuevoStockReservado = stock.stockReservado + cantidad
    const nuevoStockDisponible = stock.stockActual - nuevoStockReservado

    if (nuevoStockDisponible < 0) {
      throw new BadRequestException(
        `No hay suficiente stock disponible para reservar. Disponible: ${stock.stockDisponible}, Solicitado: ${cantidad}`,
      )
    }

    await this.stockRepository.updateStockByProductoAndBodega(
      productoId,
      bodegaId,
      {
        stockReservado: nuevoStockReservado,
        stockDisponible: nuevoStockDisponible,
        fechaUltimaActualizacion: new Date(),
      },
    )

    const updatedStock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )
    if (!updatedStock) {
      throw new NotFoundException(
        `No se pudo encontrar el stock actualizado para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }
    return updatedStock
  }

  /**
   * Libera stock reservado para un producto en una bodega específica
   */
  async releaseStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<Stock> {
    const stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      throw new NotFoundException(
        `No existe stock para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }

    const nuevoStockReservado = Math.max(0, stock.stockReservado - cantidad)
    const nuevoStockDisponible = stock.stockActual - nuevoStockReservado

    await this.stockRepository.updateStockByProductoAndBodega(
      productoId,
      bodegaId,
      {
        stockReservado: nuevoStockReservado,
        stockDisponible: nuevoStockDisponible,
        fechaUltimaActualizacion: new Date(),
      },
    )

    const updatedStock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )
    if (!updatedStock) {
      throw new NotFoundException(
        `No se pudo encontrar el stock actualizado para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }
    return updatedStock
  }

  /**
   * Consume stock reservado (convierte reservado en salida real)
   */
  async consumeReservedStock(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<Stock> {
    const stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      throw new NotFoundException(
        `No existe stock para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }

    if (stock.stockReservado < cantidad) {
      throw new BadRequestException(
        `No hay suficiente stock reservado. Reservado: ${stock.stockReservado}, Solicitado: ${cantidad}`,
      )
    }

    const nuevoStockActual = stock.stockActual - cantidad
    const nuevoStockReservado = stock.stockReservado - cantidad
    const nuevoStockDisponible = nuevoStockActual - nuevoStockReservado

    await this.stockRepository.updateStockByProductoAndBodega(
      productoId,
      bodegaId,
      {
        stockActual: nuevoStockActual,
        stockReservado: nuevoStockReservado,
        stockDisponible: nuevoStockDisponible,
        fechaUltimoMovimiento: new Date(),
        fechaUltimaActualizacion: new Date(),
      },
    )

    const updatedStock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )
    if (!updatedStock) {
      throw new NotFoundException(
        `No se pudo encontrar el stock actualizado para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }
    return updatedStock
  }

  /**
   * Obtiene el stock total de un producto en todas las bodegas
   */
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
    const stocks = await this.stockRepository.findByProducto(productoId)

    if (stocks.length === 0) {
      return {
        stockActual: 0,
        stockReservado: 0,
        stockDisponible: 0,
        bodegas: [],
      }
    }

    const totales = stocks.reduce(
      (acc, stock) => ({
        stockActual: acc.stockActual + stock.stockActual,
        stockReservado: acc.stockReservado + stock.stockReservado,
        stockDisponible: acc.stockDisponible + stock.stockDisponible,
      }),
      { stockActual: 0, stockReservado: 0, stockDisponible: 0 },
    )

    const bodegas = stocks.map((stock) => ({
      bodegaId: stock.bodegaId,
      bodegaNombre: stock.bodega?.nombre || 'Bodega desconocida',
      stockActual: stock.stockActual,
      stockReservado: stock.stockReservado,
      stockDisponible: stock.stockDisponible,
    }))

    return {
      ...totales,
      bodegas,
    }
  }

  /**
   * Verifica si hay stock suficiente para una operación
   */
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
    const stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      return {
        disponible: false,
        stockActual: 0,
        stockReservado: 0,
        stockDisponible: 0,
        mensaje: `No existe stock para el producto ${productoId} en la bodega ${bodegaId}`,
      }
    }

    const disponible = stock.stockDisponible >= cantidad
    const mensaje = disponible
      ? `Stock suficiente. Disponible: ${stock.stockDisponible}`
      : `Stock insuficiente. Disponible: ${stock.stockDisponible}, Solicitado: ${cantidad}`

    return {
      disponible,
      stockActual: stock.stockActual,
      stockReservado: stock.stockReservado,
      stockDisponible: stock.stockDisponible,
      mensaje,
    }
  }
}
