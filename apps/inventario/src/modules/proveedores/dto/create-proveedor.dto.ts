import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator'
import { EstadoProveedor, TipoProveedor } from '../enums/proveedor.enums'

export class CreateProveedorDto {
  @ApiProperty({
    description: 'Código único del proveedor',
    example: 'PROV001',
  })
  @IsString()
  @IsNotEmpty()
  codigo: string

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Empresa ABC S.A.',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string

  @ApiProperty({
    description: 'Descripción del proveedor',
    example: 'Proveedor de materiales de construcción',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string

  @ApiProperty({
    description: 'Tipo de proveedor',
    enum: TipoProveedor,
    example: TipoProveedor.MATERIALES,
  })
  @IsEnum(TipoProveedor)
  @IsOptional()
  tipo?: TipoProveedor

  @ApiProperty({
    description: 'Estado del proveedor',
    enum: EstadoProveedor,
    example: EstadoProveedor.ACTIVO,
  })
  @IsEnum(EstadoProveedor)
  @IsOptional()
  estado?: EstadoProveedor

  @ApiProperty({
    description: 'NIT del proveedor',
    example: '12345678-9',
    required: false,
  })
  @IsString()
  @IsOptional()
  nit?: string

  @ApiProperty({
    description: 'Razón social del proveedor',
    example: 'Empresa ABC Sociedad Anónima',
    required: false,
  })
  @IsString()
  @IsOptional()
  razonSocial?: string

  @ApiProperty({
    description: 'Dirección del proveedor',
    example: 'Calle 123 #45-67',
    required: false,
  })
  @IsString()
  @IsOptional()
  direccion?: string

  @ApiProperty({
    description: 'Ciudad del proveedor',
    example: 'Bogotá',
    required: false,
  })
  @IsString()
  @IsOptional()
  ciudad?: string

  @ApiProperty({
    description: 'Departamento del proveedor',
    example: 'Cundinamarca',
    required: false,
  })
  @IsString()
  @IsOptional()
  departamento?: string

  @ApiProperty({
    description: 'Teléfono del proveedor',
    example: '3001234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefono?: string

  @ApiProperty({
    description: 'Email del proveedor',
    example: 'contacto@empresaabc.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({
    description: 'Sitio web del proveedor',
    example: 'https://www.empresaabc.com',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  sitioWeb?: string

  @ApiProperty({
    description: 'Nombre del contacto principal',
    example: 'Juan Pérez',
    required: false,
  })
  @IsString()
  @IsOptional()
  contactoPrincipal?: string

  @IsBoolean()
  @IsOptional()
  is_active?: boolean

  @ApiProperty({
    description: 'Teléfono del contacto principal',
    example: '3001234567',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefonoContacto?: string

  @ApiProperty({
    description: 'Email del contacto principal',
    example: 'juan.perez@empresaabc.com',
    required: false,
  })
  // @IsEmail()
  @IsOptional()
  emailContacto?: string

  @ApiProperty({
    description: 'Notas adicionales sobre el proveedor',
    example: 'Proveedor confiable con 10 años de experiencia',
    required: false,
  })
  @IsString()
  @IsOptional()
  notas?: string
}
