import { Injectable, ConflictException } from '@nestjs/common'
import { RolesRepository } from '../repository/roles.repository'
import { CreateRoleDto } from '../dto/create-role.dto'
import { Rol } from '../entities/rol.entity'

@Injectable()
export class CreateRoleAction {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async execute(createRoleDto: CreateRoleDto): Promise<Rol> {
    // Verificar que no exista un rol con el mismo código
    const existingRole = await this.rolesRepository.findByCodigo(
      createRoleDto.codigo,
    )
    if (existingRole) {
      throw new ConflictException(
        `Ya existe un rol con el código ${createRoleDto.codigo}`,
      )
    }
    console.log('---------')
    console.log(createRoleDto)

    // Crear el rol
    return this.rolesRepository.createRole(createRoleDto)
  }
}
