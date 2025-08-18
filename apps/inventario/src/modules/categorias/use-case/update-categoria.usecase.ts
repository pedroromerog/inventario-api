import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { CategoriasRepository } from '../repository/categorias.repository'
import { UpdateCategoriaDto } from '../dto/update-categoria.dto'
import { Categoria } from '../entities/categoria.entity'

@Injectable()
export class UpdateCategoriaAction {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async execute(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    // Verificar que la categoría existe
    const existingCategoria = await this.categoriasRepository.findById(id)
    if (!existingCategoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`)
    }

    // Si se está actualizando el código, verificar que sea único
    if (
      updateCategoriaDto.codigo &&
      updateCategoriaDto.codigo !== existingCategoria.codigo
    ) {
      const categoriaWithCode = await this.categoriasRepository.findByCodigo(
        updateCategoriaDto.codigo,
      )
      if (categoriaWithCode) {
        throw new ConflictException(
          `Ya existe una categoría con el código: ${updateCategoriaDto.codigo}`,
        )
      }
    }

    // Si se está actualizando el nombre, verificar que sea único
    if (
      updateCategoriaDto.nombre &&
      updateCategoriaDto.nombre !== existingCategoria.nombre
    ) {
      const categoriaWithName = await this.categoriasRepository
        .createQueryBuilder('categoria')
        .where('categoria.nombre = :nombre', {
          nombre: updateCategoriaDto.nombre,
        })
        .andWhere('categoria.isActive = :isActive', { isActive: true })
        .andWhere('categoria.id != :id', { id })
        .getOne()

      if (categoriaWithName) {
        throw new ConflictException(
          `Ya existe una categoría con el nombre: ${updateCategoriaDto.nombre}`,
        )
      }
    }

    // Actualizar la categoría
    const updatedCategoria = await this.categoriasRepository.updateCategoria(
      id,
      updateCategoriaDto,
    )

    return updatedCategoria!
  }
}
