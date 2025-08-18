import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ProveedoresRepository } from '../repository/proveedores.repository'
import { UpdateProveedorDto } from '../dto/update-proveedor.dto'
import { Proveedor } from '../entities/proveedor.entity'

@Injectable()
export class UpdateProveedorAction {
  constructor(private readonly proveedoresRepository: ProveedoresRepository) {}

  async execute(
    id: number,
    updateProveedorDto: UpdateProveedorDto,
  ): Promise<Proveedor> {
    // Verificar que el proveedor existe
    const existingProveedor = await this.proveedoresRepository.findById(id)
    if (!existingProveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`)
    }

    // Verificar que el código no exista en otro proveedor (si se actualiza)
    if (
      updateProveedorDto.codigo &&
      updateProveedorDto.codigo !== existingProveedor.codigo
    ) {
      const existingByCodigo = await this.proveedoresRepository.findByCodigo(
        updateProveedorDto.codigo,
      )
      if (existingByCodigo) {
        throw new ConflictException(
          `Ya existe un proveedor con el código ${updateProveedorDto.codigo}`,
        )
      }
    }

    // Verificar que el NIT no exista en otro proveedor (si se actualiza)
    if (
      updateProveedorDto.nit &&
      updateProveedorDto.nit !== existingProveedor.nit
    ) {
      const existingByNit = await this.proveedoresRepository.findByNit(
        updateProveedorDto.nit,
      )
      if (existingByNit) {
        throw new ConflictException(
          `Ya existe un proveedor con el NIT ${updateProveedorDto.nit}`,
        )
      }
    }

    // Actualizar el proveedor
    const updatedProveedor = await this.proveedoresRepository.updateProveedor(
      id,
      updateProveedorDto,
    )
    if (!updatedProveedor) {
      throw new NotFoundException(
        `Error al actualizar el proveedor con ID ${id}`,
      )
    }

    return updatedProveedor
  }
}
