import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUUID,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import {
  TipoMovimiento,
  EstadoMovimiento,
  MotivoMovimiento,
} from '../enums/movimiento.enums'

export class CreateMovimientoDto {
  @ApiProperty({
    description: 'Código único del movimiento',
    example: 'MOV001',
  })
  @IsString()
  @IsNotEmpty()
  codigo: string

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: TipoMovimiento,
    example: TipoMovimiento.TRANSFERENCIA,
  })
  @IsEnum(TipoMovimiento)
  @IsOptional()
  tipo?: TipoMovimiento

  @ApiProperty({
    description: 'Estado del movimiento',
    enum: EstadoMovimiento,
    example: EstadoMovimiento.PENDIENTE,
  })
  @IsEnum(EstadoMovimiento)
  @IsOptional()
  estado?: EstadoMovimiento

  @ApiProperty({
    description: 'Motivo del movimiento',
    enum: MotivoMovimiento,
    example: MotivoMovimiento.TRANSFERENCIA_BODEGA,
  })
  @IsEnum(MotivoMovimiento)
  @IsOptional()
  motivo?: MotivoMovimiento

  @ApiProperty({
    description: 'ID de la bodega origen',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  bodegaOrigenId?: number

  @ApiProperty({
    description: 'ID de la bodega destino',
    example: 2,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  bodegaDestinoId?: number

  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productoId: number

  @ApiProperty({ description: 'Cantidad del movimiento', example: 10.5 })
  @IsNumber()
  @IsNotEmpty()
  cantidad: number

  @ApiProperty({
    description: 'Precio unitario',
    example: 25.5,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  precioUnitario?: number

  @ApiProperty({ description: 'Precio total', example: 255.0, required: false })
  @IsNumber()
  @IsOptional()
  precioTotal?: number

  @ApiProperty({ description: 'Fecha del movimiento', example: '2024-01-15' })
  @IsDateString()
  @IsNotEmpty()
  fechaMovimiento: Date

  @ApiProperty({
    description: 'Referencia del movimiento',
    example: 'REF-2024-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  referencia?: string

  @ApiProperty({
    description: 'Número de documento',
    example: 'FAC-001',
    required: false,
  })
  @IsString()
  @IsOptional()
  numeroDocumento?: string

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'Factura',
    required: false,
  })
  @IsString()
  @IsOptional()
  tipoDocumento?: string

  @ApiProperty({
    description: 'Observaciones del movimiento',
    example: 'Movimiento de transferencia entre bodegas',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string

  @ApiProperty({
    description: 'Solicitante del movimiento',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  solicitante?: string

  @ApiProperty({
    description: 'ID del usuario autorizador',
    example: 'uuid-del-usuario',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  autorizadorId?: string

  @ApiProperty({
    description: 'URL de evidencia',
    example: 'https://example.com/evidencia.pdf',
    required: false,
  })
  @IsString()
  @IsOptional()
  evidenciaUrl?: string
}
