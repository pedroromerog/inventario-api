import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsOptional, IsString } from 'class-validator'
import { EstadoMovimiento } from '../enums/movimiento.enums'

export class UpdateMovimientoStatusDto {
  @ApiProperty({
    description: 'Nuevo estado del movimiento',
    enum: EstadoMovimiento,
    example: EstadoMovimiento.COMPLETADO,
  })
  @IsEnum(EstadoMovimiento)
  estado: EstadoMovimiento

  @ApiProperty({
    description: 'Observaciones adicionales sobre el cambio de estado',
    example: 'Movimiento completado exitosamente',
    required: false,
  })
  @IsString()
  @IsOptional()
  observaciones?: string
}
