import { Injectable } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { User } from '../entities/user.entity'
import { EstadoUsuario } from '../enums/user.enums'

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager())
  }

  async findById(id: string): Promise<User | null> {
    return this.findOne({
      where: { id, isActive: true },
    })
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.findOne({
      where: { username, isActive: true },
    })
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email, isActive: true },
    })
  }

  async findActive(): Promise<User[]> {
    return this.find({
      where: { isActive: true },
      order: { nombre: 'ASC', apellido: 'ASC' },
    })
  }

  async findByEstado(estado: EstadoUsuario): Promise<User[]> {
    return this.find({
      where: { estado, isActive: true },
      order: { nombre: 'ASC', apellido: 'ASC' },
    })
  }

  async findByRol(rolId: number): Promise<User[]> {
    return this.find({
      where: { rolId, isActive: true },
      order: { nombre: 'ASC', apellido: 'ASC' },
    })
  }

  async searchByTerm(term: string): Promise<User[]> {
    return this.createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true })
      .andWhere(
        '(user.nombre LIKE :term OR user.apellido LIKE :term OR user.username LIKE :term OR user.email LIKE :term)',
        { term: `%${term}%` },
      )
      .orderBy('user.nombre', 'ASC')
      .addOrderBy('user.apellido', 'ASC')
      .getMany()
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.create(data)
    return this.save(user)
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await this.update(id, data)
    return this.findById(id)
  }

  async deleteUser(id: string): Promise<void> {
    await this.update(id, { isActive: false, deletedAt: new Date() })
  }

  async hardDeleteUser(id: string): Promise<void> {
    await this.delete(id)
  }

  async restoreUser(id: string): Promise<User | null> {
    await this.update(id, { isActive: true, deletedAt: undefined })
    return this.findById(id)
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.update(id, {
      password: hashedPassword,
      requiereCambioPassword: false,
      updatedAt: new Date(),
    })
  }

  async updateLastAccess(id: string): Promise<void> {
    await this.update(id, {
      ultimoAcceso: new Date(),
      updatedAt: new Date(),
    })
  }

  async activateUser(id: string): Promise<void> {
    await this.update(id, {
      estado: EstadoUsuario.ACTIVO,
      updatedAt: new Date(),
    })
  }

  async deactivateUser(id: string): Promise<void> {
    await this.update(id, {
      estado: EstadoUsuario.INACTIVO,
      updatedAt: new Date(),
    })
  }
}
