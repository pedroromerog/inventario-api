import { Injectable, NotFoundException } from '@nestjs/common'
import { EmpleadosRepository } from '../repository/empleados.repository'
import { Empleado } from '../entities/empleado.entity'
import { TipoEmpleado, EstadoEmpleado } from '../enums/empleado.enums'

@Injectable()
export class GetEmpleadoAction {
  constructor(private readonly empleadosRepository: EmpleadosRepository) {}

  async findById(id: number): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findById(id)
    if (!empleado) {
      throw new NotFoundException(`Empleado con ID ${id} no encontrado`)
    }
    return empleado
  }

  async findByCodigo(codigo: string): Promise<Empleado> {
    const empleado = await this.empleadosRepository.findByCodigo(codigo)
    if (!empleado) {
      throw new NotFoundException(`Empleado con código ${codigo} no encontrado`)
    }
    return empleado
  }

  async findAll(): Promise<Empleado[]> {
    return this.empleadosRepository.findActive()
  }

  async findByTipo(tipo: TipoEmpleado): Promise<Empleado[]> {
    return this.empleadosRepository.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoEmpleado): Promise<Empleado[]> {
    return this.empleadosRepository.findByEstado(estado)
  }

  async findByCargo(cargo: string): Promise<Empleado[]> {
    return this.empleadosRepository.findByCargo(cargo)
  }

  async searchByTerm(term: string): Promise<Empleado[]> {
    return this.empleadosRepository.searchByTerm(term)
  }
}
