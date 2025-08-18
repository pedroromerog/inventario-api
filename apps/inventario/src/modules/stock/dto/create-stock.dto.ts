import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { EstadoStock } from '../enums/stock.enums'

export class CreateStockDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productoId: number

  @ApiProperty({ description: 'ID de la bodega', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  bodegaId: number

  @ApiProperty({
    description: 'Stock actual del producto',
    example: 100.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockActual?: number

  @ApiProperty({
    description: 'Stock reservado del producto',
    example: 10.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockReservado?: number

  @ApiProperty({
    description: 'Stock mínimo del producto',
    example: 20.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockMinimo?: number

  @ApiProperty({
    description: 'Stock máximo del producto',
    example: 500.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockMaximo?: number

  @ApiProperty({
    description: 'Stock en tránsito',
    example: 25.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  stockEnTransito?: number

  @ApiProperty({ description: 'Stock retenido', example: 5.0, required: false })
  @IsNumber()
  @IsOptional()
  stockRetenido?: number

  @ApiProperty({
    description: 'Estado del stock',
    enum: EstadoStock,
    example: EstadoStock.DISPONIBLE,
    required: false,
  })
  @IsEnum(EstadoStock)
  @IsOptional()
  estado?: EstadoStock

  @ApiProperty({
    description: 'Precio promedio del producto',
    example: 25.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioPromedio?: number

  @ApiProperty({
    description: 'Último precio del producto',
    example: 26.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioUltimo?: number

  @ApiProperty({
    description: 'Fecha del último movimiento',
    example: '2024-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaUltimoMovimiento?: Date

  @ApiProperty({
    description: 'Observaciones sobre el stock',
    example: 'Stock inicial del producto',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string
}
