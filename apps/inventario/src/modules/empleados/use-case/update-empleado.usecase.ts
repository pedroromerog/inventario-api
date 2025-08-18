import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { EmpleadosRepository } from '../repository/empleados.repository'
import { UpdateEmpleadoDto } from '../dto/update-empleado.dto'
import { Empleado } from '../entities/empleado.entity'

@Injectable()
export class UpdateEmpleadoAction {
  constructor(private readonly empleadosRepository: EmpleadosRepository) {}

  async execute(
    id: number,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<Empleado> {
    // Verificar que el empleado existe
    const existingEmpleado = await this.empleadosRepository.findById(id)
    if (!existingEmpleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`)
    }

    // Si se está cambiando el código, verificar que no exista conflicto
    if (
      updateEmpleadoDto.codigo &&
      updateEmpleadoDto.codigo !== existingEmpleado.codigo
    ) {
      const conflictingByCodigo = await this.empleadosRepository.findByCodigo(
        updateEmpleadoDto.codigo,
      )
      if (conflictingByCodigo) {
        throw new ConflictException(
          `Ya existe un empleado con el código ${updateEmpleadoDto.codigo}`,
        )
      }
    }

    // Si se está cambiando el email, verificar que no exista conflicto
    if (
      updateEmpleadoDto.email &&
      updateEmpleadoDto.email !== existingEmpleado.email
    ) {
      const conflictingByEmail = await this.empleadosRepository.findByEmail(
        updateEmpleadoDto.email,
      )
      if (conflictingByEmail) {
        throw new ConflictException(
          `Ya existe un empleado con el email ${updateEmpleadoDto.email}`,
        )
      }
    }

    // Actualizar el empleado
    const updatedEmpleado = await this.empleadosRepository.updateEmpleado(
      id,
      updateEmpleadoDto,
    )
    if (!updatedEmpleado) {
      throw new NotFoundException(
        `Error al actualizar el empleado con ID ${id}`,
      )
    }

    return updatedEmpleado
  }
}
