import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { MovimientosRepository } from '../repository/movimientos.repository'

@Injectable()
export class DeleteMovimientoAction {
  constructor(private readonly movimientosRepository: MovimientosRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que el movimiento existe
    const existingMovimiento = await this.movimientosRepository.findById(id)
    if (!existingMovimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`)
    }

    // Verificar que no esté ya eliminado
    if (!existingMovimiento.isActive) {
      throw new BadRequestException(
        `El movimiento con ID ${id} ya está eliminado`,
      )
    }

    // Soft delete
    await this.movimientosRepository.deleteMovimiento(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que el movimiento existe
    const existingMovimiento = await this.movimientosRepository.findById(id)
    if (!existingMovimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`)
    }

    // Hard delete
    await this.movimientosRepository.hardDeleteMovimiento(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que el movimiento existe (incluyendo eliminados)
    const existingMovimiento = await this.movimientosRepository.findOne({
      where: { id },
    })

    if (!existingMovimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`)
    }

    // Verificar que esté eliminado
    if (existingMovimiento.isActive) {
      throw new BadRequestException(
        `El movimiento con ID ${id} no está eliminado`,
      )
    }

    // Restaurar
    await this.movimientosRepository.restoreMovimiento(id)
  }
}
