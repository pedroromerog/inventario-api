import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator'
import { TipoDocumento } from '../entities/ciudadano.entity'

export class CreateCiudadanoDto {
  @IsEnum(TipoDocumento)
  tipoDocumento: TipoDocumento

  @IsString()
  numeroDocumento: string

  @IsString()
  nombreCompleto: string

  @IsEmail()
  email: string

  @IsString()
  telefono: string

  @IsString()
  direccion: string

  @IsOptional()
  @IsString()
  userId?: string
}
