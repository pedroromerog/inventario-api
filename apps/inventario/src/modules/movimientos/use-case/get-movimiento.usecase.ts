import { Injectable, NotFoundException } from '@nestjs/common'
import { MovimientosRepository } from '../repository/movimientos.repository'
import { Movimiento } from '../entities/movimiento.entity'
import {
  TipoMovimiento,
  EstadoMovimiento,
  MotivoMovimiento,
} from '../enums/movimiento.enums'

@Injectable()
export class GetMovimientoAction {
  constructor(private readonly movimientosRepository: MovimientosRepository) {}

  async findById(id: number): Promise<Movimiento> {
    const movimiento = await this.movimientosRepository.findById(id)
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`)
    }
    return movimiento
  }

  async findByCodigo(codigo: string): Promise<Movimiento> {
    const movimiento = await this.movimientosRepository.findByCodigo(codigo)
    if (!movimiento) {
      throw new NotFoundException(
        `Movimiento con código ${codigo} no encontrado`,
      )
    }
    return movimiento
  }

  async findAll(): Promise<Movimiento[]> {
    return this.movimientosRepository.findActive()
  }

  async findByTipo(tipo: TipoMovimiento): Promise<Movimiento[]> {
    return this.movimientosRepository.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoMovimiento): Promise<Movimiento[]> {
    return this.movimientosRepository.findByEstado(estado)
  }

  async findByMotivo(motivo: MotivoMovimiento): Promise<Movimiento[]> {
    return this.movimientosRepository.findByMotivo(motivo)
  }

  async findByProducto(productoId: number): Promise<Movimiento[]> {
    return this.movimientosRepository.findByProducto(productoId)
  }

  async findByBodegaOrigen(bodegaOrigenId: number): Promise<Movimiento[]> {
    return this.movimientosRepository.findByBodegaOrigen(bodegaOrigenId)
  }

  async findByBodegaDestino(bodegaDestinoId: number): Promise<Movimiento[]> {
    return this.movimientosRepository.findByBodegaDestino(bodegaDestinoId)
  }

  async findByAutorizador(autorizadorId: string): Promise<Movimiento[]> {
    return this.movimientosRepository.findByAutorizador(autorizadorId)
  }

  async findByFechaRange(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Movimiento[]> {
    return this.movimientosRepository.findByFechaRange(fechaInicio, fechaFin)
  }

  async searchByTerm(term: string): Promise<Movimiento[]> {
    return this.movimientosRepository.searchByTerm(term)
  }

  async findPendientes(): Promise<Movimiento[]> {
    return this.movimientosRepository.findPendientes()
  }

  async findCompletados(): Promise<Movimiento[]> {
    return this.movimientosRepository.findCompletados()
  }
}
