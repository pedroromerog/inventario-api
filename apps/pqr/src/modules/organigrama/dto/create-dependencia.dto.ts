import { IsString, IsNumber } from 'class-validator'

export class CreateDependenciaDto {
  @IsString()
  nombre: string

  @IsNumber()
  secretariaId: number
}
