import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { BodegasRepository } from '../repository/bodegas.repository'
import { UpdateBodegaDto } from '../dto/update-bodega.dto'
import { Bodega } from '../entities/bodega.entity'

@Injectable()
export class UpdateBodegaAction {
  constructor(private readonly bodegasRepository: BodegasRepository) {}

  async execute(id: number, updateBodegaDto: UpdateBodegaDto): Promise<Bodega> {
    // Verificar que la bodega existe
    const existingBodega = await this.bodegasRepository.findById(id)
    if (!existingBodega) {
      throw new NotFoundException(`Bodega con ID ${id} no encontrada`)
    }

    // Si se está actualizando el código, verificar que sea único
    if (
      updateBodegaDto.codigo &&
      updateBodegaDto.codigo !== existingBodega.codigo
    ) {
      const bodegaWithCode = await this.bodegasRepository.findByCodigo(
        updateBodegaDto.codigo,
      )
      if (bodegaWithCode) {
        throw new ConflictException(
          `Ya existe una bodega con el código: ${updateBodegaDto.codigo}`,
        )
      }
    }

    // Si se está actualizando el nombre, verificar que sea único
    if (
      updateBodegaDto.nombre &&
      updateBodegaDto.nombre !== existingBodega.nombre
    ) {
      const bodegaWithName = await this.bodegasRepository
        .createQueryBuilder('bodega')
        .where('bodega.nombre = :nombre', { nombre: updateBodegaDto.nombre })
        .andWhere('bodega.isActive = :isActive', { isActive: true })
        .andWhere('bodega.id != :id', { id })
        .getOne()

      if (bodegaWithName) {
        throw new ConflictException(
          `Ya existe una bodega con el nombre: ${updateBodegaDto.nombre}`,
        )
      }
    }

    // Actualizar la bodega
    const updatedBodega = await this.bodegasRepository.updateBodega(
      id,
      updateBodegaDto,
    )

    return updatedBodega!
  }
}
