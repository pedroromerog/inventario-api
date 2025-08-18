import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { RolesRepository } from '../repository/roles.repository'
import { UpdateRoleDto } from '../dto/update-role.dto'
import { Rol } from '../entities/rol.entity'

@Injectable()
export class UpdateRoleAction {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async execute(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    // Verificar que el rol existe
    const existingRole = await this.rolesRepository.findById(id)
    if (!existingRole) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`)
    }

    // Si se está cambiando el código, verificar que no exista conflicto
    if (updateRoleDto.codigo && updateRoleDto.codigo !== existingRole.codigo) {
      const conflictingRole = await this.rolesRepository.findByCodigo(
        updateRoleDto.codigo,
      )
      if (conflictingRole) {
        throw new ConflictException(
          `Ya existe un rol con el código ${updateRoleDto.codigo}`,
        )
      }
    }

    // Actualizar el rol
    const updatedRole = await this.rolesRepository.updateRole(id, updateRoleDto)
    if (!updatedRole) {
      throw new NotFoundException(`Error al actualizar el rol con ID ${id}`)
    }

    return updatedRole
  }
}
