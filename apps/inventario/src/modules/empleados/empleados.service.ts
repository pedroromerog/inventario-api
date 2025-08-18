import { Injectable } from '@nestjs/common'
import { CreateEmpleadoAction } from './use-case/create-empleado.usecase'
import { GetEmpleadoAction } from './use-case/get-empleado.usecase'
import { UpdateEmpleadoAction } from './use-case/update-empleado.usecase'
import { DeleteEmpleadoAction } from './use-case/delete-empleado.usecase'
import { EmpleadosRepository } from './repository/empleados.repository'
import { CreateEmpleadoDto } from './dto/create-empleado.dto'
import { UpdateEmpleadoDto } from './dto/update-empleado.dto'
import { Empleado } from './entities/empleado.entity'
import { TipoEmpleado, EstadoEmpleado } from './enums/empleado.enums'

@Injectable()
export class EmpleadosService {
  constructor(
    private readonly createEmpleadoAction: CreateEmpleadoAction,
    private readonly getEmpleadoAction: GetEmpleadoAction,
    private readonly updateEmpleadoAction: UpdateEmpleadoAction,
    private readonly deleteEmpleadoAction: DeleteEmpleadoAction,
    private readonly empleadosRepository: EmpleadosRepository,
  ) {}

  async create(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    return this.createEmpleadoAction.execute(createEmpleadoDto)
  }

  async findAll(): Promise<Empleado[]> {
    return this.getEmpleadoAction.findAll()
  }

  async findOne(id: number): Promise<Empleado> {
    return this.getEmpleadoAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Empleado> {
    return this.getEmpleadoAction.findByCodigo(codigo)
  }

  async findByTipo(tipo: TipoEmpleado): Promise<Empleado[]> {
    return this.getEmpleadoAction.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoEmpleado): Promise<Empleado[]> {
    return this.getEmpleadoAction.findByEstado(estado)
  }

  async findByCargo(cargo: string): Promise<Empleado[]> {
    return this.getEmpleadoAction.findByCargo(cargo)
  }

  async searchByTerm(term: string): Promise<Empleado[]> {
    return this.getEmpleadoAction.searchByTerm(term)
  }

  async update(
    id: number,
    updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<Empleado> {
    return this.updateEmpleadoAction.execute(id, updateEmpleadoDto)
  }

  async remove(id: number): Promise<void> {
    return this.deleteEmpleadoAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteEmpleadoAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteEmpleadoAction.hardDelete(id)
  }
}
