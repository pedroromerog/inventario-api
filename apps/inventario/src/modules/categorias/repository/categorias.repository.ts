import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Categoria } from '../entities/categoria.entity'
import { TipoCategoria, EstadoCategoria } from '../enums/categoria.enums'

@Injectable()
export class CategoriasRepository extends Repository<Categoria> {
  constructor(private dataSource: DataSource) {
    super(Categoria, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Categoria | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByCodigo(codigo: string): Promise<Categoria | null> {
    return this.findOne({
      where: { codigo, isActive: true },
    })
  }

  async findActive(): Promise<Categoria[]> {
    return this.find({
      where: { isActive: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    })
  }

  async findByTipo(tipo: TipoCategoria): Promise<Categoria[]> {
    return this.find({
      where: { tipo, isActive: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoCategoria): Promise<Categoria[]> {
    return this.find({
      where: { estado, isActive: true },
      order: { orden: 'ASC', nombre: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<Categoria[]> {
    return this.createQueryBuilder('categoria')
      .where('categoria.isActive = :isActive', { isActive: true })
      .andWhere(
        '(categoria.nombre LIKE :term OR categoria.codigo LIKE :term OR categoria.descripcion LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('categoria.orden', 'ASC')
      .addOrderBy('categoria.nombre', 'ASC')
      .getMany()
  }

  async createCategoria(data: Partial<Categoria>): Promise<Categoria> {
    const categoria = this.create(data)
    return this.save(categoria)
  }

  async updateCategoria(
    id: number,
    data: Partial<Categoria>,
  ): Promise<Categoria | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteCategoria(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteCategoria(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreCategoria(id: number): Promise<Categoria | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }
}
