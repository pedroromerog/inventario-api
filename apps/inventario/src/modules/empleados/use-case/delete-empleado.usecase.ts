import { Injectable, NotFoundException } from '@nestjs/common'
import { EmpleadosRepository } from '../repository/empleados.repository'

@Injectable()
export class DeleteEmpleadoAction {
  constructor(private readonly empleadosRepository: EmpleadosRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que el empleado existe
    const existingEmpleado = await this.empleadosRepository.findById(id)
    if (!existingEmpleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`)
    }

    // Soft delete
    await this.empleadosRepository.deleteEmpleado(id)
  }

  async restore(id: number): Promise<void> {
    const result = await this.empleadosRepository.restoreEmpleado(id)
    if (!result) {
      throw new NotFoundException(`Error al restaurar el empleado con ID ${id}`)
    }
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que el empleado existe
    const existingEmpleado = await this.empleadosRepository.findById(id)
    if (!existingEmpleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`)
    }

    // Hard delete
    await this.empleadosRepository.hardDeleteEmpleado(id)
  }
}
