import { Injectable, ConflictException } from '@nestjs/common'
import { ProductosRepository } from '../repository/productos.repository'
import { CreateProductoDto } from '../dto/create-producto.dto'
import { Producto } from '../entities/producto.entity'

@Injectable()
export class CreateProductoAction {
  constructor(private readonly productosRepository: ProductosRepository) {}

  async execute(createProductoDto: CreateProductoDto): Promise<Producto> {
    // Verificar que el código no exista
    const existingByCodigo = await this.productosRepository.findByCodigo(
      createProductoDto.codigo,
    )
    if (existingByCodigo) {
      throw new ConflictException(
        `Ya existe un producto con el código ${createProductoDto.codigo}`,
      )
    }

    // Crear el producto con valores por defecto de stock
    const productoData = {
      ...createProductoDto,
      stockActual: 0,
      stockReservado: 0,
      stockDisponible: 0,
    }

    return this.productosRepository.createProducto(productoData)
  }
}
