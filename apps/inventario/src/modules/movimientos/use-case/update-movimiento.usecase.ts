import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { MovimientosRepository } from '../repository/movimientos.repository'
import { UpdateMovimientoDto } from '../dto/update-movimiento.dto'
import { Movimiento } from '../entities/movimiento.entity'

@Injectable()
export class UpdateMovimientoAction {
  constructor(private readonly movimientosRepository: MovimientosRepository) {}

  async execute(
    id: number,
    updateMovimientoDto: UpdateMovimientoDto,
  ): Promise<Movimiento> {
    // Verificar que el movimiento existe
    const existingMovimiento = await this.movimientosRepository.findById(id)
    if (!existingMovimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`)
    }

    // Verificar que el código no exista en otro movimiento (si se actualiza)
    if (
      updateMovimientoDto.codigo &&
      updateMovimientoDto.codigo !== existingMovimiento.codigo
    ) {
      const existingByCodigo = await this.movimientosRepository.findByCodigo(
        updateMovimientoDto.codigo,
      )
      if (existingByCodigo) {
        throw new ConflictException(
          `Ya existe un movimiento con el código ${updateMovimientoDto.codigo}`,
        )
      }
    }

    // Actualizar el movimiento
    const updatedMovimiento = await this.movimientosRepository.updateMovimiento(
      id,
      updateMovimientoDto,
    )
    if (!updatedMovimiento) {
      throw new NotFoundException(
        `Error al actualizar el movimiento con ID ${id}`,
      )
    }

    return updatedMovimiento
  }
}
