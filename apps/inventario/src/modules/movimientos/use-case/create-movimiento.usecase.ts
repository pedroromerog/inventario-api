import { Injectable, ConflictException } from '@nestjs/common'
import { MovimientosRepository } from '../repository/movimientos.repository'
import { CreateMovimientoDto } from '../dto/create-movimiento.dto'
import { Movimiento } from '../entities/movimiento.entity'

@Injectable()
export class CreateMovimientoAction {
  constructor(private readonly movimientosRepository: MovimientosRepository) {}

  async execute(createMovimientoDto: CreateMovimientoDto): Promise<Movimiento> {
    // Verificar que el código no exista
    const existingByCodigo = await this.movimientosRepository.findByCodigo(
      createMovimientoDto.codigo,
    )
    if (existingByCodigo) {
      throw new ConflictException(
        `Ya existe un movimiento con el código ${createMovimientoDto.codigo}`,
      )
    }

    // Crear el movimiento
    return this.movimientosRepository.createMovimiento(createMovimientoDto)
  }
}
