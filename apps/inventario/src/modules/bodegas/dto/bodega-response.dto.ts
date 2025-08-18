import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TipoBodega, EstadoBodega } from '../enums/bodega.enums'

export class BodegaResponseDto {
  @ApiProperty({ example: 1 })
  id: number

  @ApiProperty({ example: 'BOD-001' })
  codigo: string

  @ApiProperty({ example: 'Bodega Central' })
  nombre: string

  @ApiPropertyOptional({ example: 'Bodega principal de la empresa' })
  descripcion?: string

  @ApiProperty({ enum: TipoBodega, example: TipoBodega.SECUNDARIA })
  tipo: TipoBodega

  @ApiProperty({ enum: EstadoBodega, example: EstadoBodega.ACTIVA })
  estado: EstadoBodega

  @ApiPropertyOptional({ example: 'Av. Providencia 1234' })
  direccion?: string

  @ApiPropertyOptional({ example: 'Santiago' })
  ciudad?: string

  @ApiPropertyOptional({ example: '8320000' })
  codigoPostal?: string

  @ApiPropertyOptional({ example: '+56 2 2345 6789' })
  telefono?: string

  @ApiPropertyOptional({ example: 'bodega@empresa.com' })
  email?: string

  @ApiPropertyOptional({ example: 'Notas importantes sobre la bodega' })
  notasEspeciales?: string

  @ApiPropertyOptional({ example: 'uuid-del-responsable' })
  responsableId?: string

  @ApiProperty({ example: true })
  isActive: boolean

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  createdAt: Date

  @ApiProperty({ example: '2024-01-15T09:00:00Z' })
  updatedAt: Date

  @ApiPropertyOptional({ example: null })
  deletedAt?: Date
}
