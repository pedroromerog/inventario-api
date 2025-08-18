import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEmail,
  IsDateString,
  MaxLength,
  MinLength,
  Min,
  Max,
  IsUUID,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { TipoBodega, EstadoBodega } from '../enums/bodega.enums'

export class CreateBodegaDto {
  @ApiProperty({
    description: 'Código único de la bodega',
    example: 'BOD-001',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  codigo: string

  @ApiProperty({
    description: 'Nombre de la bodega',
    example: 'Bodega Central',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  nombre: string

  @ApiPropertyOptional({
    description: 'Descripción de la bodega',
  })
  @IsOptional()
  @IsString()
  descripcion?: string

  @ApiProperty({
    description: 'Tipo de bodega',
    enum: TipoBodega,
    example: TipoBodega.SECUNDARIA,
  })
  @IsEnum(TipoBodega)
  @IsNotEmpty()
  tipo: TipoBodega

  @ApiProperty({
    description: 'Estado de la bodega',
    enum: EstadoBodega,
    example: EstadoBodega.ACTIVA,
  })
  @IsEnum(EstadoBodega)
  @IsNotEmpty()
  estado: EstadoBodega

  @ApiPropertyOptional({
    description: 'Dirección de la bodega',
  })
  @IsOptional()
  @IsString()
  direccion?: string

  @ApiPropertyOptional({
    description: 'Ciudad de la bodega',
    example: 'Santiago',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ciudad?: string

  @ApiPropertyOptional({
    description: 'Código postal',
    example: '8320000',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  codigoPostal?: string

  @ApiPropertyOptional({
    description: 'Teléfono de contacto',
    example: '+56 2 2345 6789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string

  @ApiPropertyOptional({
    description: 'Email de contacto',
    example: 'bodega@empresa.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string

  @ApiPropertyOptional({
    description: 'Notas especiales',
  })
  @IsOptional()
  @IsString()
  notasEspeciales?: string

  @ApiPropertyOptional({
    description: 'ID del responsable de la bodega',
  })
  @IsOptional()
  @IsUUID()
  responsableId?: string
}
