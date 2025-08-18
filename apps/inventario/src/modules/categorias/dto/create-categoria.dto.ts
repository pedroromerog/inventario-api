import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  MinLength,
  Min,
  Max,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TipoCategoria, EstadoCategoria } from '../enums/categoria.enums'

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Código único de la categoría',
    example: 'CAT-001',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  codigo: string

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre: string

  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
  })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiProperty({
    description: 'Tipo de categoría',
    enum: TipoCategoria,
    example: TipoCategoria.PRODUCTO,
  })
  @IsEnum(TipoCategoria)
  @IsNotEmpty()
  tipo: TipoCategoria

  @ApiProperty({
    description: 'Estado de la categoría',
    enum: EstadoCategoria,
    example: EstadoCategoria.ACTIVA,
  })
  @IsEnum(EstadoCategoria)
  @IsNotEmpty()
  estado: EstadoCategoria

  @ApiPropertyOptional({
    description: 'Color de la categoría (hex)',
    example: '#FF5733',
  })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  color?: string

  @ApiPropertyOptional({
    description: 'Orden de la categoría',
    example: 1,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  orden?: number

  @ApiPropertyOptional({
    description: 'Notas adicionales',
  })
  @IsOptional()
  @IsString()
  notas?: string
}
