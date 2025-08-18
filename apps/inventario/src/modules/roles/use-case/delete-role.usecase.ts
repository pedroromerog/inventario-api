import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { RolesRepository } from '../repository/roles.repository'

@Injectable()
export class DeleteRoleAction {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que el rol existe
    const existingRole = await this.rolesRepository.findById(id)
    if (!existingRole) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`)
    }

    // Verificar que no esté ya eliminado
    if (!existingRole.isActive) {
      throw new BadRequestException(`El rol con ID ${id} ya está eliminado`)
    }

    // Soft delete
    await this.rolesRepository.deleteRole(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que el rol existe
    const existingRole = await this.rolesRepository.findById(id)
    if (!existingRole) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`)
    }

    // Hard delete
    await this.rolesRepository.hardDeleteRole(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que el rol existe (incluyendo eliminados)
    const existingRole = await this.rolesRepository.findOne({
      where: { id },
    })

    if (!existingRole) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`)
    }

    // Verificar que esté eliminado
    if (existingRole.isActive) {
      throw new BadRequestException(`El rol con ID ${id} no está eliminado`)
    }

    // Restaurar
    await this.rolesRepository.restoreRole(id)
  }
}
