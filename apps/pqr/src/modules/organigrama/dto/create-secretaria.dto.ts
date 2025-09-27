import { IsString } from 'class-validator'

export class CreateSecretariaDto {
  @IsString()
  nombre: string
}
