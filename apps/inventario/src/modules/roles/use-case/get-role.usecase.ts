import { Injectable, NotFoundException } from '@nestjs/common'
import { RolesRepository } from '../repository/roles.repository'
import { Rol } from '../entities/rol.entity'

@Injectable()
export class GetRoleAction {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findById(id: number): Promise<Rol> {
    const role = await this.rolesRepository.findById(id)
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`)
    }
    return role
  }

  async findByCodigo(codigo: string): Promise<Rol> {
    const role = await this.rolesRepository.findByCodigo(codigo)
    if (!role) {
      throw new NotFoundException(`Rol con código ${codigo} no encontrado`)
    }
    return role
  }

  async findAll(): Promise<[Rol[], number]> {
    return this.rolesRepository.findActive()
  }

  async searchByTerm(term: string): Promise<Rol[]> {
    return this.rolesRepository.searchByTerm(term)
  }
}
