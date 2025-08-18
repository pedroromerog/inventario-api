import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { ProductosRepository } from '../repository/productos.repository'

@Injectable()
export class DeleteProductoAction {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que el producto existe
    const existingProducto = await this.productosRepository.findById(id)
    if (!existingProducto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }

    // Verificar que no esté ya eliminado
    if (!existingProducto.isActive) {
      throw new BadRequestException(
        `El producto con ID ${id} ya está eliminado`,
      )
    }

    // Soft delete
    await this.productosRepository.deleteProducto(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que el producto existe
    const existingProducto = await this.productosRepository.findById(id)
    if (!existingProducto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }

    // Hard delete
    await this.productosRepository.hardDeleteProducto(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que el producto existe (incluyendo eliminados)
    const existingProducto = await this.productosRepository.findOne({
      where: { id },
    })

    if (!existingProducto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }

    // Verificar que esté eliminado
    if (existingProducto.isActive) {
      throw new BadRequestException(
        `El producto con ID ${id} no está eliminado`,
      )
    }

    // Restaurar
    await this.productosRepository.restoreProducto(id)
  }
}
