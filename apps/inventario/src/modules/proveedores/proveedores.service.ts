import { Injectable } from '@nestjs/common'
import { CreateProveedorAction } from './use-case/create-proveedor.usecase'
import { GetProveedorAction } from './use-case/get-proveedor.usecase'
import { UpdateProveedorAction } from './use-case/update-proveedor.usecase'
import { DeleteProveedorAction } from './use-case/delete-proveedor.usecase'
import { ProveedoresRepository } from './repository/proveedores.repository'
import { CreateProveedorDto } from './dto/create-proveedor.dto'
import { UpdateProveedorDto } from './dto/update-proveedor.dto'
import { Proveedor } from './entities/proveedor.entity'
import { TipoProveedor, EstadoProveedor } from './enums/proveedor.enums'

@Injectable()
export class ProveedoresService {
  constructor(
    private readonly createProveedorAction: CreateProveedorAction,
    private readonly getProveedorAction: GetProveedorAction,
    private readonly updateProveedorAction: UpdateProveedorAction,
    private readonly deleteProveedorAction: DeleteProveedorAction,
    private readonly proveedoresRepository: ProveedoresRepository,
  ) {}

  async create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    return this.createProveedorAction.execute(createProveedorDto)
  }

  async findAll(): Promise<Proveedor[]> {
    return this.getProveedorAction.findAll()
  }

  async findOne(id: number): Promise<Proveedor> {
    return this.getProveedorAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Proveedor> {
    return this.getProveedorAction.findByCodigo(codigo)
  }

  async findByTipo(tipo: TipoProveedor): Promise<Proveedor[]> {
    return this.getProveedorAction.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoProveedor): Promise<Proveedor[]> {
    return this.getProveedorAction.findByEstado(estado)
  }

  async findByCiudad(ciudad: string): Promise<Proveedor[]> {
    return this.getProveedorAction.findByCiudad(ciudad)
  }

  async searchByTerm(term: string): Promise<Proveedor[]> {
    return this.getProveedorAction.searchByTerm(term)
  }

  async update(
    id: number,
    updateProveedorDto: UpdateProveedorDto,
  ): Promise<Proveedor> {
    return this.updateProveedorAction.execute(id, updateProveedorDto)
  }

  async remove(id: number): Promise<void> {
    return this.deleteProveedorAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteProveedorAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteProveedorAction.hardDelete(id)
  }
}
