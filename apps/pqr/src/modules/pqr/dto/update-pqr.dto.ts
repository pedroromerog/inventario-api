import { PartialType } from '@nestjs/mapped-types'
import { CreatePqrDto } from './create-pqr.dto'
import { IsEnum, IsOptional, IsNumber, IsUUID } from 'class-validator'
import { EstadoPqr } from '../entities/pqr.entity'

export class UpdatePqrDto extends PartialType(CreatePqrDto) {
  @IsOptional()
  @IsEnum(EstadoPqr)
  estado?: EstadoPqr

  @IsOptional()
  @IsNumber()
  secretariaAsignadaId?: number

  @IsOptional()
  @IsNumber()
  dependenciaAsignadaId?: number

  @IsOptional()
  @IsUUID()
  funcionarioAsignadoId?: string
}
