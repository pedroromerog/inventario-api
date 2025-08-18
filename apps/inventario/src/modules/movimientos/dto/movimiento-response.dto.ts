import { ApiProperty } from '@nestjs/swagger'
import {
  TipoMovimiento,
  EstadoMovimiento,
  MotivoMovimiento,
} from '../enums/movimiento.enums'

export class UserResponseDto {
  @ApiProperty({ description: 'ID del usuario', example: 'uuid-del-usuario' })
  id: string

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  nombre: string

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  apellido: string

  @ApiProperty({ description: 'Username del usuario', example: 'juan.perez' })
  username: string

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@empresa.com',
  })
  email: string

  @ApiProperty({ description: 'Rol del usuario', example: 'supervisor' })
  rol: string
}

export class MovimientoResponseDto {
  @ApiProperty({ description: 'ID único del movimiento', example: 1 })
  id: number

  @ApiProperty({
    description: 'Código único del movimiento',
    example: 'MOV001',
  })
  codigo: string

  @ApiProperty({
    description: 'Tipo de movimiento',
    enum: TipoMovimiento,
    example: TipoMovimiento.TRANSFERENCIA,
  })
  tipo: TipoMovimiento

  @ApiProperty({
    description: 'Estado del movimiento',
    enum: EstadoMovimiento,
    example: EstadoMovimiento.PENDIENTE,
  })
  estado: EstadoMovimiento

  @ApiProperty({
    description: 'Motivo del movimiento',
    enum: MotivoMovimiento,
    example: MotivoMovimiento.TRANSFERENCIA_BODEGA,
  })
  motivo: MotivoMovimiento

  @ApiProperty({
    description: 'ID de la bodega origen',
    example: 1,
    required: false,
  })
  bodegaOrigenId?: number

  @ApiProperty({
    description: 'ID de la bodega destino',
    example: 2,
    required: false,
  })
  bodegaDestinoId?: number

  @ApiProperty({ description: 'ID del producto', example: 1 })
  productoId: number

  @ApiProperty({ description: 'Cantidad del movimiento', example: 10.5 })
  cantidad: number

  @ApiProperty({
    description: 'Precio unitario',
    example: 25.5,
    required: false,
  })
  precioUnitario?: number

  @ApiProperty({ description: 'Precio total', example: 255.0, required: false })
  precioTotal?: number

  @ApiProperty({ description: 'Fecha del movimiento', example: '2024-01-15' })
  fechaMovimiento: Date

  @ApiProperty({
    description: 'Referencia del movimiento',
    example: 'REF-2024-001',
    required: false,
  })
  referencia?: string

  @ApiProperty({
    description: 'Número de documento',
    example: 'FAC-001',
    required: false,
  })
  numeroDocumento?: string

  @ApiProperty({
    description: 'Tipo de documento',
    example: 'Factura',
    required: false,
  })
  tipoDocumento?: string

  @ApiProperty({
    description: 'Observaciones del movimiento',
    example: 'Movimiento de transferencia entre bodegas',
    required: false,
  })
  observaciones?: string

  @ApiProperty({
    description: 'Solicitante del movimiento',
    example: 'Juan Pérez',
    required: false,
  })
  solicitante?: string

  @ApiProperty({
    description: 'ID del usuario autorizador',
    example: 'uuid-del-usuario',
    required: false,
  })
  autorizadorId?: string

  @ApiProperty({
    description: 'Usuario autorizador',
    type: UserResponseDto,
    required: false,
  })
  autorizador?: UserResponseDto

  @ApiProperty({
    description: 'URL de evidencia',
    example: 'https://example.com/evidencia.pdf',
    required: false,
  })
  evidenciaUrl?: string

  @ApiProperty({
    description: 'Indica si el movimiento está activo',
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
