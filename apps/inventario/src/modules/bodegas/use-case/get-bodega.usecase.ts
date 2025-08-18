import { Injectable, NotFoundException } from '@nestjs/common'
import { BodegasRepository } from '../repository/bodegas.repository'
import { Bodega } from '../entities/bodega.entity'
import { TipoBodega, EstadoBodega } from '../enums/bodega.enums'

@Injectable()
export class GetBodegaAction {
  constructor(private readonly bodegasRepository: BodegasRepository) {}

  async findById(id: number): Promise<Bodega> {
    const bodega = await this.bodegasRepository.findById(id)
    if (!bodega) {
      throw new NotFoundException(`Bodega con ID ${id} no encontrada`)
    }
    return bodega
  }

  async findByCodigo(codigo: string): Promise<Bodega> {
    const bodega = await this.bodegasRepository.findByCodigo(codigo)
    if (!bodega) {
      throw new NotFoundException(`Bodega con código ${codigo} no encontrada`)
    }
    return bodega
  }

  async findAll(): Promise<Bodega[]> {
    return this.bodegasRepository.findActive()
  }

  async findByTipo(tipo: TipoBodega): Promise<Bodega[]> {
    return this.bodegasRepository.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoBodega): Promise<Bodega[]> {
    return this.bodegasRepository.findByEstado(estado)
  }

  async findByCiudad(ciudad: string): Promise<Bodega[]> {
    return this.bodegasRepository.findByCiudad(ciudad)
  }

  async findByResponsable(responsableId: string): Promise<Bodega[]> {
    return this.bodegasRepository.findByResponsable(responsableId)
  }

  async searchByTerm(term: string): Promise<Bodega[]> {
    if (!term || term.trim().length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres')
    }
    return this.bodegasRepository.searchByTerm(term.trim())
  }
}
