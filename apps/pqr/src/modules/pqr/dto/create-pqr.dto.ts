import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator'
import { TipoPqr, CanalRecepcion } from '../entities/pqr.entity'

export class CreatePqrDto {
  @IsString()
  asunto: string

  @IsString()
  descripcion: string

  @IsEnum(TipoPqr)
  tipo: TipoPqr

  @IsEnum(CanalRecepcion)
  canalRecepcion: CanalRecepcion

  @IsUUID()
  creadoPorCiudadanoId: string

  @IsOptional()
  @IsUUID()
  radicadoPorFuncionarioId?: string

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string
}
