import { Injectable, ConflictException } from '@nestjs/common'
import { EmpleadosRepository } from '../repository/empleados.repository'
import { CreateEmpleadoDto } from '../dto/create-empleado.dto'
import { Empleado } from '../entities/empleado.entity'

@Injectable()
export class CreateEmpleadoAction {
  constructor(private readonly empleadosRepository: EmpleadosRepository) {}

  async execute(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    // Verificar que no exista un empleado con el mismo código
    const existingByCodigo = await this.empleadosRepository.findByCodigo(
      createEmpleadoDto.codigo,
    )
    if (existingByCodigo) {
      throw new ConflictException(
        `Ya existe un empleado con el código ${createEmpleadoDto.codigo}`,
      )
    }

    // Verificar que no exista un empleado con el mismo email
    const existingByEmail = await this.empleadosRepository.findByEmail(
      createEmpleadoDto.email,
    )
    if (existingByEmail) {
      throw new ConflictException(
        `Ya existe un empleado con el email ${createEmpleadoDto.email}`,
      )
    }

    // Crear el empleado
    return this.empleadosRepository.createEmpleado(createEmpleadoDto)
  }
}
