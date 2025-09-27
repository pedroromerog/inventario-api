import { IsEnum, IsString, IsUUID } from 'class-validator'
import { TipoActuacion } from '../entities/trazabilidad.entity'

export class CreateTrazabilidadDto {
  @IsEnum(TipoActuacion)
  tipoActuacion: TipoActuacion

  @IsString()
  descripcion: string

  @IsUUID()
  usuarioQueActuaId: string

  @IsUUID()
  pqrId: string
}
