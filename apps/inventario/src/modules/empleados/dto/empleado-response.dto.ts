import { ApiProperty } from '@nestjs/swagger'
import { TipoEmpleado, EstadoEmpleado } from '../enums/empleado.enums'

export class EmpleadoResponseDto {
  @ApiProperty({ description: 'ID único del empleado', example: 1 })
  id: number

  @ApiProperty({ description: 'Código único del empleado', example: 'EMP001' })
  codigo: string

  @ApiProperty({ description: 'Nombres del empleado', example: 'Juan Carlos' })
  nombres: string

  @ApiProperty({
    description: 'Apellidos del empleado',
    example: 'Pérez González',
  })
  apellidos: string

  @ApiProperty({
    description: 'Email único del empleado',
    example: 'juan.perez@empresa.com',
  })
  email: string

  @ApiProperty({
    description: 'Teléfono del empleado',
    example: '+52 55 1234 5678',
    required: false,
  })
  telefono?: string

  @ApiProperty({
    description: 'Tipo de empleado',
    enum: TipoEmpleado,
    example: TipoEmpleado.OPERATIVO,
  })
  tipo: TipoEmpleado

  @ApiProperty({
    description: 'Estado del empleado',
    enum: EstadoEmpleado,
    example: EstadoEmpleado.ACTIVO,
  })
  estado: EstadoEmpleado

  @ApiProperty({
    description: 'Cargo del empleado',
    example: 'Vendedor',
    required: false,
  })
  cargo?: string

  @ApiProperty({
    description: 'Fecha de contratación',
    example: '2024-01-15',
    required: false,
  })
  fechaContratacion?: Date

  @ApiProperty({
    description: 'Observaciones sobre el empleado',
    example: 'Empleado nuevo en el sistema',
    required: false,
  })
  observaciones?: string

  @ApiProperty({
    description: 'Indica si el empleado está activo',
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
