import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Rol } from '../entities/rol.entity'

@Injectable()
export class RolesRepository extends Repository<Rol> {
  constructor(private dataSource: DataSource) {
    super(Rol, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Rol | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByCodigo(codigo: string): Promise<Rol | null> {
    return this.findOne({
      where: { codigo: codigo.toUpperCase(), isActive: true },
    })
  }

  async findActive(): Promise<[Rol[], number]> {
    return this.findAndCount({
      where: { isActive: true },
      order: { nombre: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<Rol[]> {
    return this.createQueryBuilder('role')
      .where('role.isActive = :isActive', { isActive: true })
      .andWhere('(role.nombre LIKE :term OR role.codigo LIKE :term)', {
        term: `%${term}%`,
      })
      .orderBy('role.nombre', 'ASC')
      .getMany()
  }

  async createRole(data: Partial<Rol>): Promise<Rol> {
    const role = this.create(data)
    return this.save(role)
  }

  async updateRole(id: number, data: Partial<Rol>): Promise<Rol | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteRole(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteRole(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreRole(id: number): Promise<Rol | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }
}
