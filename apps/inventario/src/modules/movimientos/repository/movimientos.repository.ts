import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Movimiento } from '../entities/movimiento.entity'
import {
  EstadoMovimiento,
  MotivoMovimiento,
  TipoMovimiento,
} from '../enums/movimiento.enums'

@Injectable()
export class MovimientosRepository extends Repository<Movimiento> {
  constructor(private dataSource: DataSource) {
    super(Movimiento, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Movimiento | null> {
    return this.findOne({
      where: { id, isActive: true },
      relations: ['autorizador'],
    })
  }

  async findByCodigo(codigo: string): Promise<Movimiento | null> {
    return this.findOne({
      where: { codigo, isActive: true },
      relations: ['autorizador'],
    })
  }

  async findActive(): Promise<Movimiento[]> {
    return this.find({
      where: { isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByTipo(tipo: TipoMovimiento): Promise<Movimiento[]> {
    return this.find({
      where: { tipo, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByEstado(estado: EstadoMovimiento): Promise<Movimiento[]> {
    return this.find({
      where: { estado, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByMotivo(motivo: MotivoMovimiento): Promise<Movimiento[]> {
    return this.find({
      where: { motivo, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByProducto(productoId: number): Promise<Movimiento[]> {
    return this.find({
      where: { productoId, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByBodegaOrigen(bodegaOrigenId: number): Promise<Movimiento[]> {
    return this.find({
      where: { bodegaOrigenId, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByBodegaDestino(bodegaDestinoId: number): Promise<Movimiento[]> {
    return this.find({
      where: { bodegaDestinoId, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByAutorizador(autorizadorId: string): Promise<Movimiento[]> {
    return this.find({
      where: { autorizadorId, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }

  async findByFechaRange(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<Movimiento[]> {
    return this.createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.autorizador', 'autorizador')
      .where('movimiento.isActive = :isActive', { isActive: true })
      .andWhere(
        'movimiento.fechaMovimiento BETWEEN :fechaInicio AND :fechaFin',
        { fechaInicio, fechaFin },
      )
      .orderBy('movimiento.fechaMovimiento', 'DESC')
      .getMany()
  }

  async searchByTerm(term: string): Promise<Movimiento[]> {
    return this.createQueryBuilder('movimiento')
      .leftJoinAndSelect('movimiento.autorizador', 'autorizador')
      .where('movimiento.isActive = :isActive', { isActive: true })
      .andWhere(
        '(movimiento.codigo LIKE :term OR movimiento.referencia LIKE :term OR movimiento.numeroDocumento LIKE :term OR movimiento.solicitante LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('movimiento.fechaMovimiento', 'DESC')
      .getMany()
  }

  async createMovimiento(data: Partial<Movimiento>): Promise<Movimiento> {
    const movimiento = this.create(data)
    return this.save(movimiento)
  }

  async updateMovimiento(
    id: number,
    data: Partial<Movimiento>,
  ): Promise<Movimiento | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteMovimiento(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteMovimiento(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreMovimiento(id: number): Promise<Movimiento | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }

  async findPendientes(): Promise<Movimiento[]> {
    return this.find({
      where: { estado: EstadoMovimiento.PENDIENTE, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'ASC' },
    })
  }

  async findCompletados(): Promise<Movimiento[]> {
    return this.find({
      where: { estado: EstadoMovimiento.COMPLETADO, isActive: true },
      relations: ['autorizador'],
      order: { fechaMovimiento: 'DESC' },
    })
  }
}
