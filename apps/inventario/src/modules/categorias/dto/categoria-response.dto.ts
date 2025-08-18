import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TipoCategoria, EstadoCategoria } from '../enums/categoria.enums'

export class CategoriaResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'CAT-001' })
  codigo: string

  @ApiProperty({ example: 'Electrónicos' })
  nombre: string

  @ApiPropertyOptional({ example: 'Productos electrónicos y tecnología' })
  descripcion?: string

  @ApiProperty({ enum: TipoCategoria, example: TipoCategoria.PRODUCTO })
  tipo: TipoCategoria

  @ApiProperty({ enum: EstadoCategoria, example: EstadoCategoria.ACTIVA })
  estado: EstadoCategoria

  @ApiPropertyOptional({ example: '#FF5733' })
  color?: string

  @ApiProperty({ example: 1 })
  orden: number

  @ApiPropertyOptional({ example: 'Notas importantes sobre la categoría' })
  notas?: string

  @ApiProperty({ example: true })
  isActive: boolean

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  createdAt: Date

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  updatedAt: Date

  @ApiPropertyOptional({ example: null })
  deletedAt?: Date
}
