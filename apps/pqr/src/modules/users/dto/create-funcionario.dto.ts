import {
  IsString,
  IsEmail,
  IsOptional,
  IsUUID,
  IsDateString,
  IsBoolean,
  IsNumber,
} from 'class-validator'

export class CreateFuncionarioDto {
  @IsString()
  nombres: string

  @IsString()
  apellidos: string

  @IsString()
  cargo: string

  @IsOptional()
  @IsString()
  telefono?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsString()
  direccion?: string

  @IsOptional()
  @IsDateString()
  fechaIngreso?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean

  @IsNumber()
  dependenciaId: number

  @IsOptional()
  @IsUUID()
  userId?: string
}
