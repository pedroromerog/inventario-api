import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Empleado } from './entities/empleado.entity'
import { EmpleadosController } from './empleados.controller'
import { EmpleadosService } from './empleados.service'
import { EmpleadosRepository } from './repository/empleados.repository'
import { CreateEmpleadoAction } from './use-case/create-empleado.usecase'
import { GetEmpleadoAction } from './use-case/get-empleado.usecase'
import { UpdateEmpleadoAction } from './use-case/update-empleado.usecase'
import { DeleteEmpleadoAction } from './use-case/delete-empleado.usecase'

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [EmpleadosController],
  providers: [
    EmpleadosService,
    EmpleadosRepository,
    CreateEmpleadoAction,
    GetEmpleadoAction,
    UpdateEmpleadoAction,
    DeleteEmpleadoAction,
  ],
  exports: [EmpleadosService],
})
export class EmpleadosModule {}
