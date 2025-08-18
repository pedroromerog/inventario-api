import { ApiProperty } from '@nestjs/swagger'
import { TipoProveedor, EstadoProveedor } from '../enums/proveedor.enums'

export class ProveedorResponseDto {
  @ApiProperty({ description: 'ID único del proveedor', example: 1 })
  id: number

  @ApiProperty({
    description: 'Código único del proveedor',
    example: 'PROV001',
  })
  codigo: string

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Empresa ABC S.A.',
  })
  nombre: string

  @ApiProperty({
    description: 'Descripción del proveedor',
    example: 'Proveedor de materiales de construcción',
    required: false,
  })
  descripcion?: string

  @ApiProperty({
    description: 'Tipo de proveedor',
    enum: TipoProveedor,
    example: TipoProveedor.MATERIALES,
  })
  tipo: TipoProveedor

  @ApiProperty({
    description: 'Estado del proveedor',
    enum: EstadoProveedor,
    example: EstadoProveedor.ACTIVO,
  })
  estado: EstadoProveedor

  @ApiProperty({
    description: 'NIT del proveedor',
    example: '12345678-9',
    required: false,
  })
  nit?: string

  @ApiProperty({
    description: 'Razón social del proveedor',
    example: 'Empresa ABC Sociedad Anónima',
    required: false,
  })
  razonSocial?: string

  @ApiProperty({
    description: 'Dirección del proveedor',
    example: 'Calle 123 #45-67',
    required: false,
  })
  direccion?: string

  @ApiProperty({
    description: 'Ciudad del proveedor',
    example: 'Bogotá',
    required: false,
  })
  ciudad?: string

  @ApiProperty({
    description: 'Departamento del proveedor',
    example: 'Cundinamarca',
    required: false,
  })
  departamento?: string

  @ApiProperty({
    description: 'Teléfono del proveedor',
    example: '3001234567',
    required: false,
  })
  telefono?: string

  @ApiProperty({
    description: 'Email del proveedor',
    example: 'contacto@empresaabc.com',
    required: false,
  })
  email?: string

  @ApiProperty({
    description: 'Sitio web del proveedor',
    example: 'https://www.empresaabc.com',
    required: false,
  })
  sitioWeb?: string

  @ApiProperty({
    description: 'Nombre del contacto principal',
    example: 'Juan Pérez',
    required: false,
  })
  contactoPrincipal?: string

  @ApiProperty({
    description: 'Teléfono del contacto principal',
    example: '3001234567',
    required: false,
  })
  telefonoContacto?: string

  @ApiProperty({
    description: 'Email del contacto principal',
    example: 'juan.perez@empresaabc.com',
    required: false,
  })
  emailContacto?: string

  @ApiProperty({
    description: 'Notas adicionales sobre el proveedor',
    example: 'Proveedor confiable con 10 años de experiencia',
    required: false,
  })
  notas?: string

  @ApiProperty({
    description: 'Indica si el proveedor está activo',
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
