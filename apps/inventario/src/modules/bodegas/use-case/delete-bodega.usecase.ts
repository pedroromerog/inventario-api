import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { BodegasRepository } from '../repository/bodegas.repository'

@Injectable()
export class DeleteBodegaAction {
  constructor(private readonly bodegasRepository: BodegasRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que la bodega existe
    const existingBodega = await this.bodegasRepository.findById(id)
    if (!existingBodega) {
      throw new NotFoundException(`Bodega con ID ${id} no encontrada`)
    }

    // Verificar que no esté ya eliminada
    if (!existingBodega.isActive) {
      throw new BadRequestException(`La bodega con ID ${id} ya está eliminada`)
    }

    // Realizar soft delete
    await this.bodegasRepository.deleteBodega(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que la bodega existe
    const existingBodega = await this.bodegasRepository.findById(id)
    if (!existingBodega) {
      throw new NotFoundException(`Bodega con ID ${id} no encontrada`)
    }

    // Realizar hard delete
    await this.bodegasRepository.hardDeleteBodega(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que la bodega existe (incluyendo las eliminadas)
    const existingBodega = await this.bodegasRepository.findOne({
      where: { id },
    })

    if (!existingBodega) {
      throw new NotFoundException(`Bodega con ID ${id} no encontrada`)
    }

    // Verificar que esté eliminada
    if (existingBodega.isActive) {
      throw new BadRequestException(`La bodega con ID ${id} no está eliminada`)
    }

    // Restaurar la bodega
    await this.bodegasRepository.restoreBodega(id)
  }
}
