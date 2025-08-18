import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { EstadoUsuario } from '../../users/enums/user.enums'

export class RegisterDto {
  @ApiProperty({
    description: 'Username único del usuario',
    example: 'juan.perez',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  nombre: string

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  apellido: string

  @ApiProperty({
    description: 'Email único del usuario',
    example: 'juan.perez@empresa.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  password: string

  @ApiProperty({
    description: 'Confirmación de contraseña',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string

  @ApiProperty({
    description: 'ID del rol del usuario',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  rolId?: number

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  telefono?: string

  @ApiProperty({
    description: 'Departamento del usuario',
    example: 'Ventas',
    required: false,
  })
  @IsString()
  @IsOptional()
  departamento?: string

  @ApiProperty({
    description: 'Cargo del usuario',
    example: 'Vendedor',
    required: false,
  })
  @IsString()
  @IsOptional()
  cargo?: string
}
