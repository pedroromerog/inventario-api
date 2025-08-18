import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Proveedor } from '../entities/proveedor.entity'
import { TipoProveedor, EstadoProveedor } from '../enums/proveedor.enums'

@Injectable()
export class ProveedoresRepository extends Repository<Proveedor> {
  constructor(private dataSource: DataSource) {
    super(Proveedor, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Proveedor | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByCodigo(codigo: string): Promise<Proveedor | null> {
    return this.findOne({
      where: { codigo, isActive: true },
    })
  }

  async findByNit(nit: string): Promise<Proveedor | null> {
    return this.findOne({
      where: { nit, isActive: true },
    })
  }

  async findActive(): Promise<Proveedor[]> {
    return this.find({
      where: { isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByTipo(tipo: TipoProveedor): Promise<Proveedor[]> {
    return this.find({
      where: { tipo, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoProveedor): Promise<Proveedor[]> {
    return this.find({
      where: { estado, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async findByCiudad(ciudad: string): Promise<Proveedor[]> {
    return this.find({
      where: { ciudad, isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<Proveedor[]> {
    return this.createQueryBuilder('proveedor')
      .where('proveedor.isActive = :isActive', { isActive: true })
      .andWhere(
        '(proveedor.nombre LIKE :term OR proveedor.codigo LIKE :term OR proveedor.descripcion LIKE :term OR proveedor.ciudad LIKE :term OR proveedor.nit LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('proveedor.nombre', 'ASC')
      .getMany()
  }

  async createProveedor(data: Partial<Proveedor>): Promise<Proveedor> {
    const proveedor = this.create(data)
    return this.save(proveedor)
  }

  async updateProveedor(
    id: number,
    data: Partial<Proveedor>,
  ): Promise<Proveedor | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteProveedor(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteProveedor(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreProveedor(id: number): Promise<Proveedor | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }
}
