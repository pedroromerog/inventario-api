import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({ description: 'Username del usuario', example: 'juan.perez' })
  @IsString()
  @IsNotEmpty()
  username: string

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'Recordar sesión',
    example: false,
    required: false,
  })
  @IsOptional()
  rememberMe?: boolean
}
