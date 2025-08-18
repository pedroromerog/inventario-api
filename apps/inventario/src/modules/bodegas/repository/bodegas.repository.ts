import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Bodega } from '../entities/bodega.entity'
import { TipoBodega, EstadoBodega } from '../enums/bodega.enums'

@Injectable()
export class BodegasRepository extends Repository<Bodega> {
  constructor(private dataSource: DataSource) {
    super(Bodega, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Bodega | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByCodigo(codigo: string): Promise<Bodega | null> {
    return this.findOne({
      where: { codigo, isActive: true },
    })
  }

  async findActive(): Promise<Bodega[]> {
    return this.find({
      where: { isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByTipo(tipo: TipoBodega): Promise<Bodega[]> {
    return this.find({
      where: { tipo, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoBodega): Promise<Bodega[]> {
    return this.find({
      where: { estado, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByCiudad(ciudad: string): Promise<Bodega[]> {
    return this.find({
      where: { ciudad, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByResponsable(responsableId: string): Promise<Bodega[]> {
    return this.find({
      where: { responsableId, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<Bodega[]> {
    return this.createQueryBuilder('bodega')
      .where('bodega.isActive = :isActive', { isActive: true })
      .andWhere(
        '(bodega.nombre LIKE :term OR bodega.codigo LIKE :term OR bodega.descripcion LIKE :term OR bodega.ciudad LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('bodega.nombre', 'ASC')
      .getMany()
  }

  async createBodega(data: Partial<Bodega>): Promise<Bodega> {
    const bodega = this.create(data)
    return this.save(bodega)
  }

  async updateBodega(
    id: number,
    data: Partial<Bodega>,
  ): Promise<Bodega | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteBodega(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteBodega(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreBodega(id: number): Promise<Bodega | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }
}
