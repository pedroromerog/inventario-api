import { Injectable } from '@nestjs/common'
import { CreateCategoriaAction } from './use-case/create-categoria.usecase'
import { GetCategoriaAction } from './use-case/get-categoria.usecase'
import { Categoria } from './entities/categoria.entity'
import { TipoCategoria, EstadoCategoria } from './enums/categoria.enums'
import { CategoriasRepository } from './repository/categorias.repository'
import { UpdateCategoriaAction } from './use-case/update-categoria.usecase'
import { DeleteCategoriaAction } from './use-case/delete-categoria.usecase'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'

@Injectable()
export class CategoriasService {
  constructor(
    private readonly createCategoriaAction: CreateCategoriaAction,
    private readonly getCategoriaAction: GetCategoriaAction,
    private readonly updateCategoriaAction: UpdateCategoriaAction,
    private readonly deleteCategoriaAction: DeleteCategoriaAction,
    private readonly categoriasRepository: CategoriasRepository,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    return this.createCategoriaAction.execute(createCategoriaDto)
  }

  async findAll(): Promise<Categoria[]> {
    return this.getCategoriaAction.findAll()
  }

  async findOne(id: number): Promise<Categoria> {
    return this.getCategoriaAction.findById(id)
  }

  async findByCodigo(codigo: string): Promise<Categoria> {
    return this.getCategoriaAction.findByCodigo(codigo)
  }

  async findByTipo(tipo: TipoCategoria): Promise<Categoria[]> {
    return this.getCategoriaAction.findByTipo(tipo)
  }

  async findByEstado(estado: EstadoCategoria): Promise<Categoria[]> {
    return this.getCategoriaAction.findByEstado(estado)
  }

  async searchByTerm(term: string): Promise<Categoria[]> {
    return this.getCategoriaAction.searchByTerm(term)
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    return this.updateCategoriaAction.execute(id, updateCategoriaDto)
  }

  async remove(id: number): Promise<void> {
    return this.deleteCategoriaAction.execute(id)
  }

  async restore(id: number): Promise<void> {
    return this.deleteCategoriaAction.restore(id)
  }

  async hardRemove(id: number): Promise<void> {
    return this.deleteCategoriaAction.hardDelete(id)
  }
}
