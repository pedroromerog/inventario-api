import { Injectable, ConflictException } from '@nestjs/common'
import { ProveedoresRepository } from '../repository/proveedores.repository'
import { CreateProveedorDto } from '../dto/create-proveedor.dto'
import { Proveedor } from '../entities/proveedor.entity'

@Injectable()
export class CreateProveedorAction {
  constructor(private readonly proveedoresRepository: ProveedoresRepository) {}

  async execute(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    // Verificar que el código no exista
    const existingByCodigo = await this.proveedoresRepository.findByCodigo(
      createProveedorDto.codigo,
    )
    if (existingByCodigo) {
      throw new ConflictException(
        `Ya existe un proveedor con el código ${createProveedorDto.codigo}`,
      )
    }

    // Verificar que el NIT no exista (si se proporciona)
    if (createProveedorDto.nit) {
      const existingByNit = await this.proveedoresRepository.findByNit(
        createProveedorDto.nit,
      )
      if (existingByNit) {
        throw new ConflictException(
          `Ya existe un proveedor con el NIT ${createProveedorDto.nit}`,
        )
      }
    }

    // Crear el proveedor
    return this.proveedoresRepository.createProveedor(createProveedorDto)
  }
}
