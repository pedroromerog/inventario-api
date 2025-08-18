import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rol } from './entities/rol.entity'
import { RolesController } from './roles.controller'
import { RolesService } from './roles.service'
import { RolesRepository } from './repository/roles.repository'
import { CreateRoleAction } from './use-case/create-role.usecase'
import { GetRoleAction } from './use-case/get-role.usecase'
import { UpdateRoleAction } from './use-case/update-role.usecase'
import { DeleteRoleAction } from './use-case/delete-role.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesRepository,
    CreateRoleAction,
    GetRoleAction,
    UpdateRoleAction,
    DeleteRoleAction,
  ],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
