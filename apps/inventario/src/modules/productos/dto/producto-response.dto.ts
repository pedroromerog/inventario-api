import { ApiProperty } from '@nestjs/swagger'
import {
  TipoProducto,
  EstadoProducto,
  UnidadMedida,
} from '../enums/producto.enums'

export class ProductoResponseDto {
  @ApiProperty({ description: 'ID único del producto', example: 1 })
  id: number

  @ApiProperty({ description: 'Código único del producto', example: 'PROD001' })
  codigo: string

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell Inspiron',
  })
  nombre: string

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de 15 pulgadas con procesador Intel i5',
    required: false,
  })
  descripcion?: string

  @ApiProperty({
    description: 'Tipo de producto',
    enum: TipoProducto,
    example: TipoProducto.EQUIPO,
  })
  tipo: TipoProducto

  @ApiProperty({
    description: 'Estado del producto',
    enum: EstadoProducto,
    example: EstadoProducto.ACTIVO,
  })
  estado: EstadoProducto

  @ApiProperty({
    description: 'Unidad de medida',
    enum: UnidadMedida,
    example: UnidadMedida.UNIDAD,
  })
  unidadMedida: UnidadMedida

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
    required: false,
  })
  categoriaId?: number

  @ApiProperty({ description: 'ID del proveedor', example: 1, required: false })
  proveedorId?: number

  @ApiProperty({
    description: 'Precio de compra',
    example: 500.0,
    required: false,
  })
  precioCompra?: number

  @ApiProperty({
    description: 'Precio de venta',
    example: 750.0,
    required: false,
  })
  precioVenta?: number

  @ApiProperty({
    description: 'Precio promedio',
    example: 625.0,
    required: false,
  })
  precioPromedio?: number

  @ApiProperty({ description: 'Stock mínimo', example: 5 })
  stockMinimo: number

  @ApiProperty({ description: 'Stock máximo', example: 100 })
  stockMaximo: number

  @ApiProperty({ description: 'Stock actual', example: 25 })
  stockActual: number

  @ApiProperty({ description: 'Stock reservado', example: 3 })
  stockReservado: number

  @ApiProperty({ description: 'Stock disponible', example: 22 })
  stockDisponible: number

  @ApiProperty({
    description: 'Marca del producto',
    example: 'Dell',
    required: false,
  })
  marca?: string

  @ApiProperty({
    description: 'Modelo del producto',
    example: 'Inspiron 15 3000',
    required: false,
  })
  modelo?: string

  @ApiProperty({
    description: 'Color del producto',
    example: 'Negro',
    required: false,
  })
  color?: string

  @ApiProperty({
    description: 'Dimensiones del producto',
    example: '15.6 x 10.2 x 0.9 pulgadas',
    required: false,
  })
  dimensiones?: string

  @ApiProperty({
    description: 'Peso del producto en kg',
    example: 2.1,
    required: false,
  })
  peso?: number

  @ApiProperty({
    description: 'Especificaciones técnicas',
    example: 'Intel i5, 8GB RAM, 256GB SSD',
    required: false,
  })
  especificaciones?: string

  @ApiProperty({
    description: 'Instrucciones de uso',
    example: 'Manual de usuario incluido',
    required: false,
  })
  instrucciones?: string

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Producto con garantía de 1 año',
    required: false,
  })
  notas?: string

  @ApiProperty({ description: 'Requiere refrigeración', example: false })
  requiereRefrigeracion: boolean

  @ApiProperty({ description: 'Es frágil', example: true })
  esFragil: boolean

  @ApiProperty({ description: 'Es peligroso', example: false })
  esPeligroso: boolean

  @ApiProperty({ description: 'Días de vida útil', example: 1095 })
  diasVidaUtil: number

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  imagenUrl?: string

  @ApiProperty({
    description: 'Indica si el producto está activo',
    example: true,
  })
  isActive: boolean

  @ApiProperty({
    description: 'Fecha de creación del registro',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: null,
    required: false,
  })
  deletedAt?: Date
}
