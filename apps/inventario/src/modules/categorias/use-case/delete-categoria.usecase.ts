import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { CategoriasRepository } from '../repository/categorias.repository'

@Injectable()
export class DeleteCategoriaAction {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async execute(id: number): Promise<void> {
    // Verificar que la categoría existe
    const existingCategoria = await this.categoriasRepository.findById(id)
    if (!existingCategoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`)
    }

    // Verificar que no esté ya eliminada
    if (!existingCategoria.isActive) {
      throw new BadRequestException(
        `La categoría con ID ${id} ya está eliminada`,
      )
    }

    // Realizar soft delete
    await this.categoriasRepository.deleteCategoria(id)
  }

  async hardDelete(id: number): Promise<void> {
    // Verificar que la categoría existe
    const existingCategoria = await this.categoriasRepository.findById(id)
    if (!existingCategoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`)
    }

    // Realizar hard delete
    await this.categoriasRepository.hardDeleteCategoria(id)
  }

  async restore(id: number): Promise<void> {
    // Verificar que la categoría existe (incluyendo las eliminadas)
    const existingCategoria = await this.categoriasRepository.findOne({
      where: { id },
    })

    if (!existingCategoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`)
    }

    // Verificar que esté eliminada
    if (existingCategoria.isActive) {
      throw new BadRequestException(
        `La categoría con ID ${id} no está eliminada`,
      )
    }

    // Restaurar la categoría
    await this.categoriasRepository.restoreCategoria(id)
  }
}
