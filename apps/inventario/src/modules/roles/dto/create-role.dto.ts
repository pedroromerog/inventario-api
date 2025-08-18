import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsArray,
  IsOptional,
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateRoleDto {
  @ApiProperty({ description: 'Código único del rol', example: 'ADMIN' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  codigo: string

  @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  nombre: string

  @ApiProperty({
    description: 'Lista de permisos del rol',
    example: ['CREATE_USER', 'READ_USER'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  permisos?: string[]
}
