import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { ProveedoresRepository } from '../repository/proveedores.repository'

@Injectable()
export class DeleteProveedorAction {
  constructor(private readonly proveedoresRepository: ProveedoresRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que el proveedor existe
    const existingProveedor = await this.proveedoresRepository.findById(id)
    if (!existingProveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`)
    }

    // Verificar que no esté ya eliminado
    if (!existingProveedor.isActive) {
      throw new BadRequestException(
        `El proveedor con ID ${id} ya está eliminado`,
      )
    }

    // Soft delete
    await this.proveedoresRepository.deleteProveedor(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que el proveedor existe
    const existingProveedor = await this.proveedoresRepository.findById(id)
    if (!existingProveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`)
    }

    // Hard delete
    await this.proveedoresRepository.hardDeleteProveedor(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que el proveedor existe (incluyendo eliminados)
    const existingProveedor = await this.proveedoresRepository.findOne({
      where: { id },
    })

    if (!existingProveedor) {
      throw new NotFoundException(`Proveedor con ID ${id} no encontrado`)
    }

    // Verificar que esté eliminado
    if (existingProveedor.isActive) {
      throw new BadRequestException(
        `El proveedor con ID ${id} no está eliminado`,
      )
    }

    // Restaurar
    await this.proveedoresRepository.restoreProveedor(id)
  }
}
