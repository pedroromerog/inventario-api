import { Injectable } from '@nestjs/common'
import { CreateMovimientoAction } from './use-case/create-movimiento.usecase'
import { GetMovimientoAction } from './use-case/get-movimiento.usecase'
import { UpdateMovimientoAction } from './use-case/update-movimiento.usecase'
import { UpdateMovimientoStatusAction } from './use-case/update-movimiento-status.usecase'
import { DeleteMovimientoAction } from './use-case/delete-movimiento.usecase'
import { MovimientosRepository } from './repository/movimientos.repository'
import { CreateMovimientoDto } from './dto/create-movimiento.dto'
import { UpdateMovimientoDto } from './dto/update-movimiento.dto'
import { Movimiento } from './entities/movimiento.entity'
import {
  TipoMovimiento,
  EstadoMovimiento,
  MotivoMovimiento,
} from './enums/movimiento.enums'

@Injectable()
export class MovimientosService {
  constructor(
    private readonly createMovimientoAction: CreateMovimientoAction,
    private readonly getMovimientoAction: GetMovimientoAction,
    private readonly updateMovimientoAction: UpdateMovimientoAction,
    private readonly updateMovimientoStatusAction: UpdateMovimientoStatusAction,
    private readonly deleteMovimientoAction: DeleteMovimientoAction,
    private readonly movimientosRepository: MovimientosRepository,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    return this.createMovimientoAction.execute(createMovimientoDto)
  }

  async findAll(): Promise<Movimiento[]> {
    return this.getMovimientoAction.findAll()
  }

  async findOne(id: number): Promise<Movimiento> {
    return this.getMovimientoAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Movimiento> {
    return this.getMovimientoAction.findByCodigo(codigo)
  }

  async findByTipo(tipo: TipoMovimiento): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoMovimiento): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByEstado(estado)
  }

  async findByMotivo(motivo: MotivoMovimiento): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByMotivo(motivo)
  }

  async findByProducto(productoId: number): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByProducto(productoId)
  }

  async findByBodegaOrigen(bodegaOrigenId: number): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByBodegaOrigen(bodegaOrigenId)
  }

  async findByBodegaDestino(bodegaDestinoId: number): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByBodegaDestino(bodegaDestinoId)
  }

  async findByAutorizador(autorizadorId: string): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByAutorizador(autorizadorId)
  }

  async findByFechaRange(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Movimiento[]> {
    return this.getMovimientoAction.findByFechaRange(fechaInicio, fechaFin)
  }

  async searchByTerm(term: string): Promise<Movimiento[]> {
    return this.getMovimientoAction.searchByTerm(term)
  }

  async findPendientes(): Promise<Movimiento[]> {
    return this.getMovimientoAction.findPendientes()
  }

  async findCompletados(): Promise<Movimiento[]> {
    return this.getMovimientoAction.findCompletados()
  }

  async update(
    id: number,
    updateMovimientoDto: UpdateMovimientoDto,
  ): Promise<Movimiento> {
    return this.updateMovimientoAction.execute(id, updateMovimientoDto)
  }

  async updateStatus(
    id: number,
    nuevoEstado: EstadoMovimiento,
    observaciones?: string,
  ): Promise<Movimiento> {
    return this.updateMovimientoStatusAction.execute(
      id,
      nuevoEstado,
      observaciones,
    )
  }

  async remove(id: number): Promise<void> {
    return this.deleteMovimientoAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteMovimientoAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteMovimientoAction.hardDelete(id)
  }
}
