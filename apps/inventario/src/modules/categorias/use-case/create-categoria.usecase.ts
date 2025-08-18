import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common'
import { CategoriasRepository } from '../repository/categorias.repository'
import { CreateCategoriaDto } from '../dto/create-categoria.dto'
import { Categoria } from '../entities/categoria.entity'

@Injectable()
export class CreateCategoriaAction {
  constructor(private readonly categoriasRepository: CategoriasRepository) {}

  async execute(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    // Validar que el código sea único
    const existingCategoria = await this.categoriasRepository.findByCodigo(
      createCategoriaDto.codigo,
    )
    if (existingCategoria) {
      throw new ConflictException(
        `Ya existe una categoría con el código: ${createCategoriaDto.codigo}`,
      )
    }

    // Validar que el nombre no esté duplicado
    const existingByName = await this.categoriasRepository
      .createQueryBuilder('categoria')
      .where('categoria.nombre = :nombre', {
        nombre: createCategoriaDto.nombre,
      })
      .andWhere('categoria.isActive = :isActive', { isActive: true })
      .getOne()

    if (existingByName) {
      throw new ConflictException(
        `Ya existe una categoría con el nombre: ${createCategoriaDto.nombre}`,
      )
    }

    // Crear la categoría
    const categoria =
      await this.categoriasRepository.createCategoria(createCategoriaDto)

    return categoria
  }
}
