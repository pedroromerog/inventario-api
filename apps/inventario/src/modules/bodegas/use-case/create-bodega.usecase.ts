import { Injectable, ConflictException } from '@nestjs/common'
import { BodegasRepository } from '../repository/bodegas.repository'
import { CreateBodegaDto } from '../dto/create-bodega.dto'
import { Bodega } from '../entities/bodega.entity'

@Injectable()
export class CreateBodegaAction {
  constructor(private readonly bodegasRepository: BodegasRepository) {}

  async execute(createBodegaDto: CreateBodegaDto): Promise<Bodega> {
    // Validar que el código sea único
    const existingBodega = await this.bodegasRepository.findByCodigo(
      createBodegaDto.codigo,
    )
    if (existingBodega) {
      throw new ConflictException(
        `Ya existe una bodega con el código: ${createBodegaDto.codigo}`,
      )
    }

    // Validar que el nombre no esté duplicado
    const existingByName = await this.bodegasRepository
      .createQueryBuilder('bodega')
      .where('bodega.nombre = :nombre', { nombre: createBodegaDto.nombre })
      .andWhere('bodega.isActive = :isActive', { isActive: true })
      .getOne()

    if (existingByName) {
      throw new ConflictException(
        `Ya existe una bodega con el nombre: ${createBodegaDto.nombre}`,
      )
    }

    // Crear la bodega
    const bodega = await this.bodegasRepository.createBodega(createBodegaDto)

    return bodega
  }
}
