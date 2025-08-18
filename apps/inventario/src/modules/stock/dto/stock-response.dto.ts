import { ApiProperty } from '@nestjs/swagger'
import { EstadoStock } from '../enums/stock.enums'

export class ProductoResponseDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  id: number

  @ApiProperty({ description: 'Código del producto', example: 'PROD001' })
  codigo: string

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell Inspiron',
  })
  nombre: string

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de 15 pulgadas',
    required: false,
  })
  descripcion?: string
}

export class BodegaResponseDto {
  @ApiProperty({ description: 'ID de la bodega', example: 1 })
  id: number

  @ApiProperty({ description: 'Código de la bodega', example: 'BOD001' })
  codigo: string

  @ApiProperty({
    description: 'Nombre de la bodega',
    example: 'Bodega Principal',
  })
  nombre: string

  @ApiProperty({
    description: 'Descripción de la bodega',
    example: 'Bodega principal del almacén',
    required: false,
  })
  descripcion?: string
}

export class StockResponseDto {
  @ApiProperty({ description: 'ID único del stock', example: 1 })
  id: number

  @ApiProperty({ description: 'ID del producto', example: 1 })
  productoId: number

  @ApiProperty({ description: 'ID de la bodega', example: 1 })
  bodegaId: number

  @ApiProperty({ description: 'Stock actual del producto', example: 100.5 })
  stockActual: number

  @ApiProperty({ description: 'Stock reservado del producto', example: 10.0 })
  stockReservado: number

  @ApiProperty({ description: 'Stock disponible del producto', example: 90.5 })
  stockDisponible: number

  @ApiProperty({ description: 'Stock mínimo del producto', example: 20.0 })
  stockMinimo: number

  @ApiProperty({ description: 'Stock máximo del producto', example: 500.0 })
  stockMaximo: number

  @ApiProperty({
    description: 'Stock en tránsito',
    example: 25.0,
    required: false,
  })
  stockEnTransito?: number

  @ApiProperty({ description: 'Stock retenido', example: 5.0, required: false })
  stockRetenido?: number

  @ApiProperty({
    description: 'Estado del stock',
    enum: EstadoStock,
    example: EstadoStock.DISPONIBLE,
  })
  estado: EstadoStock

  @ApiProperty({
    description: 'Precio promedio del producto',
    example: 25.5,
    required: false,
  })
  precioPromedio?: number

  @ApiProperty({
    description: 'Último precio del producto',
    example: 26.0,
    required: false,
  })
  precioUltimo?: number

  @ApiProperty({
    description: 'Fecha del último movimiento',
    example: '2024-01-15',
    required: false,
  })
  fechaUltimoMovimiento?: Date

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15',
    required: false,
  })
  fechaUltimaActualizacion?: Date

  @ApiProperty({
    description: 'Observaciones sobre el stock',
    example: 'Stock inicial del producto',
    required: false,
  })
  observaciones?: string

  @ApiProperty({ description: 'Indica si el stock está activo', example: true })
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

  @ApiProperty({
    description: 'Información del producto',
    type: ProductoResponseDto,
  })
  producto: ProductoResponseDto

  @ApiProperty({
    description: 'Información de la bodega',
    type: BodegaResponseDto,
  })
  bodega: BodegaResponseDto
}
