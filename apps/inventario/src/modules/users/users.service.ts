import { Injectable } from '@nestjs/common'
import { UsersRepository } from './repository/users.repository'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './entities/user.entity'
import { EstadoUsuario } from './enums/user.enums'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto)
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findActive()
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new Error(`Usuario con ID ${id} no encontrado`)
    }
    return user
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username)
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findByEmail(email)
  }

  async findByEstado(estado: EstadoUsuario): Promise<User[]> {
    return this.usersRepository.findByEstado(estado)
  }

  async findByRol(rolId: number): Promise<User[]> {
    return this.usersRepository.findByRol(rolId)
  }

  async searchByTerm(term: string): Promise<User[]> {
    return this.usersRepository.searchByTerm(term)
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.usersRepository.updateUser(id, updateUserDto)
    if (!updatedUser) {
      throw new Error(`Error al actualizar el usuario con ID ${id}`)
    }
    return updatedUser
  }

  async remove(id: string): Promise<void> {
    return this.usersRepository.deleteUser(id)
  }

  async restore(id: string): Promise<void> {
    const result = await this.usersRepository.restoreUser(id)
    if (!result) {
      throw new Error(`Error al restaurar el usuario con ID ${id}`)
    }
  }

  async hardRemove(id: string): Promise<void> {
    return this.usersRepository.hardDeleteUser(id)
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    return this.usersRepository.updatePassword(id, hashedPassword)
  }

  async updateLastAccess(id: string): Promise<void> {
    return this.usersRepository.updateLastAccess(id)
  }

  async activateUser(id: string): Promise<void> {
    return this.usersRepository.activateUser(id)
  }

  async deactivateUser(id: string): Promise<void> {
    return this.usersRepository.deactivateUser(id)
  }
}
