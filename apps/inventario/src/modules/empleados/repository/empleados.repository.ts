import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Empleado } from '../entities/empleado.entity'
import { TipoEmpleado, EstadoEmpleado } from '../enums/empleado.enums'

@Injectable()
export class EmpleadosRepository extends Repository<Empleado> {
  constructor(private dataSource: DataSource) {
    super(Empleado, dataSource.createEntityManager())
  }

  async findById(id: number): Promise<Empleado | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByCodigo(codigo: string): Promise<Empleado | null> {
    return this.findOne({
      where: { codigo, isActive: true },
    })
  }

  async findByEmail(email: string): Promise<Empleado | null> {
    return this.findOne({
      where: { email, isActive: true },
    })
  }

  async findActive(): Promise<Empleado[]> {
    return this.find({
      where: { isActive: true },
      order: { nombres: 'ASC', apellidos: 'ASC' },
    })
  }

  async findByTipo(tipo: TipoEmpleado): Promise<Empleado[]> {
    return this.find({
      where: { tipo, isActive: true },
      order: { nombres: 'ASC', apellidos: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoEmpleado): Promise<Empleado[]> {
    return this.find({
      where: { estado, isActive: true },
      order: { nombres: 'ASC', apellidos: 'ASC' },
    })
  }

  async findByCargo(cargo: string): Promise<Empleado[]> {
    return this.find({
      where: { cargo, isActive: true },
      order: { nombres: 'ASC', apellidos: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<Empleado[]> {
    return this.createQueryBuilder('empleado')
      .where('empleado.isActive = :isActive', { isActive: true })
      .andWhere(
        '(empleado.nombres LIKE :term OR empleado.apellidos LIKE :term OR empleado.codigo LIKE :term OR empleado.email LIKE :term OR empleado.cargo LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('empleado.nombres', 'ASC')
      .addOrderBy('empleado.apellidos', 'ASC')
      .getMany()
  }

  async createEmpleado(data: Partial<Empleado>): Promise<Empleado> {
    const empleado = this.create(data)
    return this.save(empleado)
  }

  async updateEmpleado(
    id: number,
    data: Partial<Empleado>,
  ): Promise<Empleado | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteEmpleado(id: number): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteEmpleado(id: number): Promise<void> {
    await this.delete(id)
  }

  async restoreEmpleado(id: number): Promise<Empleado | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }
}
