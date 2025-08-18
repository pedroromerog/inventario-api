import { Injectable } from '@nestjs/common'
import { CreateRoleAction } from './use-case/create-role.usecase'
import { GetRoleAction } from './use-case/get-role.usecase'
import { UpdateRoleAction } from './use-case/update-role.usecase'
import { DeleteRoleAction } from './use-case/delete-role.usecase'
import { RolesRepository } from './repository/roles.repository'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'
import { Rol } from './entities/rol.entity'

@Injectable()
export class RolesService {
  constructor(
    private readonly createRoleAction: CreateRoleAction,
    private readonly getRoleAction: GetRoleAction,
    private readonly updateRoleAction: UpdateRoleAction,
    private readonly deleteRoleAction: DeleteRoleAction,
    private readonly rolesRepository: RolesRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Rol> {
    return this.createRoleAction.execute(createRoleDto)
  }

  async findAll(): Promise<[Rol[], number]> {
    return this.getRoleAction.findAll()
  }

  async findOne(id: number): Promise<Rol> {
    return this.getRoleAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Rol> {
    return this.getRoleAction.findByCodigo(codigo)
  }

  async searchByTerm(term: string): Promise<Rol[]> {
    return this.getRoleAction.searchByTerm(term)
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Rol> {
    return this.updateRoleAction.execute(id, updateRoleDto)
  }

  async remove(id: number): Promise<void> {
    return this.deleteRoleAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteRoleAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteRoleAction.hardDelete(id)
  }
}
