import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsUrl,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import {
  TipoProducto,
  EstadoProducto,
  UnidadMedida,
} from '../enums/producto.enums'

export class CreateProductoDto {
  @ApiProperty({ description: 'Código único del producto', example: 'PROD001' })
  @IsString()
  @IsNotEmpty()
  codigo: string

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell Inspiron',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de 15 pulgadas con procesador Intel i5',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string

  @ApiProperty({
    description: 'Tipo de producto',
    enum: TipoProducto,
    example: TipoProducto.EQUIPO,
  })
  @IsEnum(TipoProducto)
  @IsOptional()
  tipo?: TipoProducto

  @ApiProperty({
    description: 'Estado del producto',
    enum: EstadoProducto,
    example: EstadoProducto.ACTIVO,
  })
  @IsEnum(EstadoProducto)
  @IsOptional()
  estado?: EstadoProducto

  @ApiProperty({
    description: 'Unidad de medida',
    enum: UnidadMedida,
    example: UnidadMedida.UNIDAD,
  })
  @IsEnum(UnidadMedida)
  @IsOptional()
  unidadMedida?: UnidadMedida

  @ApiProperty({
    description: 'ID de la categoría',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  categoriaId?: number

  @ApiProperty({ description: 'ID del proveedor', example: 1, required: false })
  @IsNumber()
  @IsOptional()
  proveedorId?: number

  @ApiProperty({
    description: 'Precio de compra',
    example: 500.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioCompra?: number

  @ApiProperty({
    description: 'Precio de venta',
    example: 750.0,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioVenta?: number

  @ApiProperty({ description: 'Stock mínimo', example: 5, required: false })
  @IsNumber()
  @IsOptional()
  stockMinimo?: number

  @ApiProperty({ description: 'Stock máximo', example: 100, required: false })
  @IsNumber()
  @IsOptional()
  stockMaximo?: number

  @ApiProperty({
    description: 'Marca del producto',
    example: 'Dell',
    required: false,
  })
  @IsString()
  @IsOptional()
  marca?: string

  @ApiProperty({
    description: 'Modelo del producto',
    example: 'Inspiron 15 3000',
    required: false,
  })
  @IsString()
  @IsOptional()
  modelo?: string

  @ApiProperty({
    description: 'Color del producto',
    example: 'Negro',
    required: false,
  })
  @IsString()
  @IsOptional()
  color?: string

  @ApiProperty({
    description: 'Dimensiones del producto',
    example: '15.6 x 10.2 x 0.9 pulgadas',
    required: false,
  })
  @IsString()
  @IsOptional()
  dimensiones?: string

  @ApiProperty({
    description: 'Peso del producto en kg',
    example: 2.1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  peso?: number

  @ApiProperty({
    description: 'Especificaciones técnicas',
    example: 'Intel i5, 8GB RAM, 256GB SSD',
    required: false,
  })
  @IsString()
  @IsOptional()
  especificaciones?: string

  @ApiProperty({
    description: 'Instrucciones de uso',
    example: 'Manual de usuario incluido',
    required: false,
  })
  @IsString()
  @IsOptional()
  instrucciones?: string

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Producto con garantía de 1 año',
    required: false,
  })
  @IsString()
  @IsOptional()
  notas?: string

  @ApiProperty({
    description: 'Requiere refrigeración',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  requiereRefrigeracion?: boolean

  @ApiProperty({ description: 'Es frágil', example: true, required: false })
  @IsBoolean()
  @IsOptional()
  esFragil?: boolean

  @ApiProperty({ description: 'Es peligroso', example: false, required: false })
  @IsBoolean()
  @IsOptional()
  esPeligroso?: boolean

  @ApiProperty({
    description: 'Días de vida útil',
    example: 1095,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  diasVidaUtil?: number

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  imagenUrl?: string
}
