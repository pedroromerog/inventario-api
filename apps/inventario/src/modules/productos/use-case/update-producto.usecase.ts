import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ProductosRepository } from '../repository/productos.repository'
import { UpdateProductoDto } from '../dto/update-producto.dto'
import { Producto } from '../entities/producto.entity'

@Injectable()
export class UpdateProductoAction {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async execute(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    // Verificar que el producto existe
    const existingProducto = await this.productosRepository.findById(id)
    if (!existingProducto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`)
    }

    // Verificar que el código no exista en otro producto (si se actualiza)
    if (
      updateProductoDto.codigo &&
      updateProductoDto.codigo !== existingProducto.codigo
    ) {
      const existingByCodigo = await this.productosRepository.findByCodigo(
        updateProductoDto.codigo,
      )
      if (existingByCodigo) {
        throw new ConflictException(
          `Ya existe un producto con el código ${updateProductoDto.codigo}`,
        )
      }
    }

    // Actualizar el producto
    const updatedProducto = await this.productosRepository.updateProducto(
      id,
      updateProductoDto,
    )
    if (!updatedProducto) {
      throw new NotFoundException(
        `Error al actualizar el producto con ID ${id}`,
      )
    }

    return updatedProducto
  }
}
