import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator'
import { TipoDocumento } from '../../users/entities/ciudadano.entity'

export class RegisterDto {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento

  @IsString()
  numeroDocumento: string

  @IsString()
  nombreCompleto: string

  @IsString()
  telefono: string

  @IsString()
  direccion: string
}
