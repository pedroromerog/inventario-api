import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Proveedor } from './entities/proveedor.entity'

import { ProveedoresService } from './proveedores.service'
import { ProveedoresRepository } from './repository/proveedores.repository'
import { CreateProveedorAction } from './use-case/create-proveedor.usecase'
import { GetProveedorAction } from './use-case/get-proveedor.usecase'
import { UpdateProveedorAction } from './use-case/update-proveedor.usecase'
import { DeleteProveedorAction } from './use-case/delete-proveedor.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])],

  providers: [
    ProveedoresService,
    ProveedoresRepository,
    CreateProveedorAction,
    GetProveedorAction,
    UpdateProveedorAction,
    DeleteProveedorAction,
  ],
  exports: [ProveedoresService, ProveedoresRepository],
})
export class ProveedoresModule {}
