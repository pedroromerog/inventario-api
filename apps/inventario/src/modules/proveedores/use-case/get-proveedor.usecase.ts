import { Injectable, NotFoundException } from '@nestjs/common'
import { ProveedoresRepository } from '../repository/proveedores.repository'
import { Proveedor } from '../entities/proveedor.entity'
import { TipoProveedor, EstadoProveedor } from '../enums/proveedor.enums'

@Injectable()
export class GetProveedorAction {
  constructor(private readonly proveedoresRepository: ProveedoresRepository) {}

  async findById(id: number): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findById(id)
    if (!proveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`)
    }
    return proveedor
  }

  async findByCodigo(codigo: string): Promise<Proveedor> {
    const proveedor = await this.proveedoresRepository.findByCodigo(codigo)
    if (!proveedor) {
      throw new NotFoundException(
        `Proveedor con código ${codigo} no encontrado`,
      )
    }
    return proveedor
  }

  async findAll(): Promise<Proveedor[]> {
    return this.proveedoresRepository.findActive()
  }

  async findByTipo(tipo: TipoProveedor): Promise<Proveedor[]> {
    return this.proveedoresRepository.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoProveedor): Promise<Proveedor[]> {
    return this.proveedoresRepository.findByEstado(estado)
  }

  async findByCiudad(ciudad: string): Promise<Proveedor[]> {
    return this.proveedoresRepository.findByCiudad(ciudad)
  }

  async searchByTerm(term: string): Promise<Proveedor[]> {
    return this.proveedoresRepository.searchByTerm(term)
  }
}
