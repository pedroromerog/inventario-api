import { ApiProperty } from '@nestjs/swagger'

export class RoleResponseDto {
  @ApiProperty({ description: 'ID único del rol', example: 1 })
  id: number

  @ApiProperty({ description: 'Código único del rol', example: 'ADMIN' })
  codigo: string

  @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
  nombre: string

  @ApiProperty({
    description: 'Lista de permisos del rol',
    example: ['CREATE_USER', 'READ_USER'],
    required: false,
  })
  permisos?: string[]

  @ApiProperty({ description: 'Indica si el rol está activo', example: true })
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
