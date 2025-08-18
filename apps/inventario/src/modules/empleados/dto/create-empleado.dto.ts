import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsEmail,
  IsDateString,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { TipoEmpleado, EstadoEmpleado } from '../enums/empleado.enums'

export class CreateEmpleadoDto {
  @ApiProperty({ description: 'Código único del empleado', example: 'EMP001' })
  @IsString()
  @IsNotEmpty()
  codigo: string

  @ApiProperty({ description: 'Nombres del empleado', example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  nombres: string

  @ApiProperty({
    description: 'Apellidos del empleado',
    example: 'Pérez González',
  })
  @IsString()
  @IsNotEmpty()
  apellidos: string

  @ApiProperty({
    description: 'Email único del empleado',
    example: 'juan.perez@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'Teléfono del empleado',
    example: '+52 55 1234 5678',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefono?: string

  @ApiProperty({
    description: 'Tipo de empleado',
    enum: TipoEmpleado,
    example: TipoEmpleado.OPERATIVO,
    required: false,
  })
  @IsEnum(TipoEmpleado)
  @IsOptional()
  tipo?: TipoEmpleado

  @ApiProperty({
    description: 'Estado del empleado',
    enum: EstadoEmpleado,
    example: EstadoEmpleado.ACTIVO,
    required: false,
  })
  @IsEnum(EstadoEmpleado)
  @IsOptional()
  estado?: EstadoEmpleado

  @ApiProperty({
    description: 'Cargo del empleado',
    example: 'Vendedor',
    required: false,
  })
  @IsString()
  @IsOptional()
  cargo?: string

  @ApiProperty({
    description: 'Fecha de contratación',
    example: '2024-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  fechaContratacion?: Date

  @ApiProperty({
    description: 'Observaciones sobre el empleado',
    example: 'Empleado nuevo en el sistema',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string
}
