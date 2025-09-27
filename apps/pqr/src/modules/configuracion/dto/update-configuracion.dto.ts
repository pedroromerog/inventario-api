import { IsString, IsOptional, IsUrl } from 'class-validator'

export class UpdateConfiguracionDto {
  @IsString()
  @IsOptional()
  nit?: string

  @IsString()
  @IsOptional()
  nombreOficial?: string

  @IsString()
  @IsOptional()
  @IsUrl()
  logotipoUrl?: string

  @IsString()
  @IsOptional()
  nombreAlcaldeActual?: string

  @IsString()
  @IsOptional()
  eslogan?: string

  @IsString()
  @IsOptional()
  @IsUrl()
  urlPaginaWeb?: string
}
