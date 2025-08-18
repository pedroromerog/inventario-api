import { Injectable, NotFoundException } from '@nestjs/common'
import { CategoriasRepository } from '../repository/categorias.repository'
import { Categoria } from '../entities/categoria.entity'
import { TipoCategoria, EstadoCategoria } from '../enums/categoria.enums'

@Injectable()
export class GetCategoriaAction {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async findById(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findById(id)
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`)
    }
    return categoria
  }

  async findByCodigo(codigo: string): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findByCodigo(codigo)
    if (!categoria) {
      throw new NotFoundException(
        `Categoría con código ${codigo} no encontrada`,
      )
    }
    return categoria
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.findActive()
  }

  async findByTipo(tipo: TipoCategoria): Promise<Categoria[]> {
    return this.categoriasRepository.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoCategoria): Promise<Categoria[]> {
    return this.categoriasRepository.findByEstado(estado)
  }

  async searchByTerm(term: string): Promise<Categoria[]> {
    if (!term || term.trim().length < 2) {
      throw new Error('El término de búsqueda debe tener al menos 2 caracteres')
    }
    return this.categoriasRepository.searchByTerm(term.trim())
  }
}
