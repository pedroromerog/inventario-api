/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { MovimientosRepository } from '../repository/movimientos.repository'
import { StockRepository } from '../../stock/repository/stock.repository'
import { Movimiento } from '../entities/movimiento.entity'
import { EstadoMovimiento, TipoMovimiento } from '../enums/movimiento.enums'

@Injectable()
export class UpdateMovimientoStatusAction {
  constructor(
    private readonly movimientosRepository: MovimientosRepository,
    private readonly stockRepository: StockRepository,
  ) {}

  async execute(
    id: number,
    nuevoEstado: EstadoMovimiento,
    observaciones?: string,
  ): Promise<Movimiento> {
    // Verificar que el movimiento existe
    const movimiento = await this.movimientosRepository.findById(id)
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`)
    }

    // Validar transición de estado
    this.validateStateTransition(movimiento.estado, nuevoEstado)

    // Actualizar el movimiento
    const movimientoActualizado =
      await this.movimientosRepository.updateMovimiento(id, {
        estado: nuevoEstado,
        observaciones: observaciones || movimiento.observaciones,
      })

    // Solo actualizar el stock si el movimiento cambia de un estado no completado a completado
    // Esto evita la doble actualización ya que el stock se actualiza al crear el movimiento
    if (
      nuevoEstado === EstadoMovimiento.COMPLETADO &&
      movimiento.estado !== EstadoMovimiento.COMPLETADO &&
      movimientoActualizado
    ) {
      await this.updateStockFromMovement(movimientoActualizado)
    }

    return movimientoActualizado
  }

  private validateStateTransition(
    estadoActual: EstadoMovimiento,
    nuevoEstado: EstadoMovimiento,
  ): void {
    const transicionesValidas: Record<EstadoMovimiento, EstadoMovimiento[]> = {
      [EstadoMovimiento.PENDIENTE]: [
        EstadoMovimiento.EN_PROCESO,
        EstadoMovimiento.COMPLETADO,
        EstadoMovimiento.CANCELADO,
        EstadoMovimiento.RECHAZADO,
      ],
      [EstadoMovimiento.EN_PROCESO]: [
        EstadoMovimiento.COMPLETADO,
        EstadoMovimiento.CANCELADO,
        EstadoMovimiento.EN_REVISION,
      ],
      [EstadoMovimiento.EN_REVISION]: [
        EstadoMovimiento.COMPLETADO,
        EstadoMovimiento.CANCELADO,
        EstadoMovimiento.EN_PROCESO,
      ],
      [EstadoMovimiento.COMPLETADO]: [], // No se puede cambiar desde completado
      [EstadoMovimiento.CANCELADO]: [], // No se puede cambiar desde cancelado
      [EstadoMovimiento.RECHAZADO]: [
        EstadoMovimiento.PENDIENTE,
        EstadoMovimiento.CANCELADO,
      ],
    }

    if (!transicionesValidas[estadoActual].includes(nuevoEstado)) {
      throw new BadRequestException(
        `No se puede cambiar el estado de ${estadoActual} a ${nuevoEstado}`,
      )
    }
  }

  private async updateStockFromMovement(movimiento: Movimiento): Promise<void> {
    const {
      tipo,
      bodegaOrigenId,
      bodegaDestinoId,
      productoId,
      cantidad,
      precioUnitario,
    } = movimiento

    const entradas = [
      TipoMovimiento.ENTRADA,
      TipoMovimiento.COMPRA,
      TipoMovimiento.PRODUCCION,
      TipoMovimiento.DEVOLUCION,
    ]
    const salidas = [
      TipoMovimiento.SALIDA,
      TipoMovimiento.VENTA,
      TipoMovimiento.CONSUMO,
      TipoMovimiento.MERMA,
    ]

    try {
      // Manejar movimientos de entrada
      if (entradas.includes(tipo as TipoMovimiento) && bodegaDestinoId) {
        await this.handleStockEntry(
          productoId,
          bodegaDestinoId,
          cantidad,
          precioUnitario,
        )
      }

      // Manejar movimientos de salida
      if (salidas.includes(tipo as TipoMovimiento) && bodegaOrigenId) {
        await this.handleStockExit(productoId, bodegaOrigenId, cantidad)
      }

      // Manejar transferencias
      if (
        tipo === TipoMovimiento.TRANSFERENCIA &&
        bodegaOrigenId &&
        bodegaDestinoId
      ) {
        await this.handleStockTransfer(
          productoId,
          bodegaOrigenId,
          bodegaDestinoId,
          cantidad,
        )
      }

      // Manejar ajustes
      if (tipo === TipoMovimiento.AJUSTE) {
        const bodegaId = bodegaDestinoId || bodegaOrigenId
        if (bodegaId) {
          await this.handleStockAdjustment(productoId, bodegaId, cantidad)
        }
      }
    } catch (error) {
      // Si hay error actualizando el stock, marcar el movimiento como en revisión
      await this.movimientosRepository.updateMovimiento(movimiento.id, {
        estado: EstadoMovimiento.EN_REVISION,
        observaciones:
          `Error actualizando stock: ${error.message}. ${movimiento.observaciones || ''}`.trim(),
      })
      throw error
    }
  }

  private async handleStockEntry(
    productoId: number,
    bodegaId: number,
    cantidad: number,
    precioUnitario?: number,
  ): Promise<void> {
    let stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      // Crear nuevo stock si no existe
      stock = await this.stockRepository.createStock({
        productoId,
        bodegaId,
        stockActual: cantidad,
        stockReservado: 0,
        stockDisponible: cantidad,
        stockMinimo: 0,
        stockMaximo: 0,
        precioUltimo: precioUnitario,
        fechaUltimoMovimiento: new Date(),
        fechaUltimaActualizacion: new Date(),
      })
    } else {
      // Actualizar stock existente
      const nuevoStockActual = stock.stockActual + cantidad
      const nuevoStockDisponible = nuevoStockActual - stock.stockReservado

      // Calcular precio promedio ponderado si se proporciona precio
      let nuevoPrecioPromedio = stock.precioPromedio
      if (precioUnitario && precioUnitario > 0) {
        const valorActual = (stock.precioPromedio ?? 0) * stock.stockActual
        const valorNuevo = precioUnitario * cantidad
        const stockTotal = nuevoStockActual
        nuevoPrecioPromedio =
          stockTotal > 0
            ? (valorActual + valorNuevo) / stockTotal
            : precioUnitario
      }

      await this.stockRepository.updateStockByProductoAndBodega(
        productoId,
        bodegaId,
        {
          stockActual: nuevoStockActual,
          stockDisponible: nuevoStockDisponible,
          precioPromedio: nuevoPrecioPromedio,
          precioUltimo: precioUnitario || stock.precioUltimo,
          fechaUltimoMovimiento: new Date(),
          fechaUltimaActualizacion: new Date(),
        },
      )
    }
  }

  private async handleStockExit(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<void> {
    const stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      throw new NotFoundException(
        `No existe stock para el producto ${productoId} en la bodega ${bodegaId}`,
      )
    }

    const nuevoStockActual = stock.stockActual - cantidad
    const nuevoStockDisponible = nuevoStockActual - stock.stockReservado

    if (nuevoStockActual < 0) {
      throw new BadRequestException(
        `No hay suficiente stock. Disponible: ${stock.stockActual}, Solicitado: ${cantidad}`,
      )
    }

    await this.stockRepository.updateStockByProductoAndBodega(
      productoId,
      bodegaId,
      {
        stockActual: nuevoStockActual,
        stockDisponible: nuevoStockDisponible,
        fechaUltimoMovimiento: new Date(),
        fechaUltimaActualizacion: new Date(),
      },
    )
  }

  private async handleStockTransfer(
    productoId: number,
    bodegaOrigenId: number,
    bodegaDestinoId: number,
    cantidad: number,
  ): Promise<void> {
    // Reducir stock en bodega origen
    await this.handleStockExit(productoId, bodegaOrigenId, cantidad)

    // Aumentar stock en bodega destino
    await this.handleStockEntry(productoId, bodegaDestinoId, cantidad)
  }

  private async handleStockAdjustment(
    productoId: number,
    bodegaId: number,
    cantidad: number,
  ): Promise<void> {
    let stock = await this.stockRepository.findByProductoAndBodega(
      productoId,
      bodegaId,
    )

    if (!stock) {
      // Crear nuevo stock si no existe
      stock = await this.stockRepository.createStock({
        productoId,
        bodegaId,
        stockActual: cantidad,
        stockReservado: 0,
        stockDisponible: cantidad,
        stockMinimo: 0,
        stockMaximo: 0,
        fechaUltimoMovimiento: new Date(),
        fechaUltimaActualizacion: new Date(),
      })
    } else {
      // Ajustar stock existente
      const nuevoStockActual = cantidad
      const nuevoStockDisponible = nuevoStockActual - stock.stockReservado

      await this.stockRepository.updateStockByProductoAndBodega(
        productoId,
        bodegaId,
        {
          stockActual: nuevoStockActual,
          stockDisponible: nuevoStockDisponible,
          fechaUltimoMovimiento: new Date(),
          fechaUltimaActualizacion: new Date(),
        },
      )
    }
  }
}
