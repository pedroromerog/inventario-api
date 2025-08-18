import { ApiProperty } from '@nestjs/swagger'
import { EstadoUsuario } from '../../users/enums/user.enums'

export class RolDto {
  @ApiProperty({ description: 'ID del rol', example: 1 })
  id: number

  @ApiProperty({ description: 'Código del rol', example: 'ADMIN' })
  codigo: string

  @ApiProperty({ description: 'Nombre del rol', example: 'Administrador' })
  nombre: string
}

export class UserAuthDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'uuid-del-usuario',
  })
  id: string

  @ApiProperty({ description: 'Username del usuario', example: 'juan.perez' })
  username: string

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan' })
  nombre: string

  @ApiProperty({ description: 'Apellido del usuario', example: 'Pérez' })
  apellido: string

  @ApiProperty({
    description: 'Email del usuario',
    example: 'juan.perez@empresa.com',
  })
  email: string

  @ApiProperty({
    description: 'Estado del usuario',
    enum: EstadoUsuario,
    example: EstadoUsuario.ACTIVO,
  })
  estado: EstadoUsuario

  @ApiProperty({ description: 'Rol del usuario', type: RolDto })
  rol: RolDto

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '+1234567890',
    required: false,
  })
  telefono?: string

  @ApiProperty({
    description: 'Departamento del usuario',
    example: 'Ventas',
    required: false,
  })
  departamento?: string

  @ApiProperty({
    description: 'Cargo del usuario',
    example: 'Vendedor',
    required: false,
  })
  cargo?: string

  @ApiProperty({
    description: 'Último acceso del usuario',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
  })
  ultimoAcceso?: Date
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'Token de refresco',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string

  @ApiProperty({
    description: 'Tiempo de expiración del token en segundos',
    example: 3600,
  })
  expiresIn: number

  @ApiProperty({ description: 'Tipo de token', example: 'Bearer' })
  tokenType: string

  @ApiProperty({
    description: 'Información del usuario autenticado',
    type: UserAuthDto,
  })
  user: UserAuthDto
}

export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'Nuevo token de acceso JWT',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string

  @ApiProperty({
    description: 'Nuevo token de refresco',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string

  @ApiProperty({
    description: 'Tiempo de expiración del token en segundos',
    example: 3600,
  })
  expiresIn: number

  @ApiProperty({ description: 'Tipo de token', example: 'Bearer' })
  tokenType: string
}

export class LogoutResponseDto {
  @ApiProperty({
    description: 'Mensaje de confirmación',
    example: 'Sesión cerrada exitosamente',
  })
  message: string

  @ApiProperty({
    description: 'Indica si el logout fue exitoso',
    example: true,
  })
  success: boolean
}
