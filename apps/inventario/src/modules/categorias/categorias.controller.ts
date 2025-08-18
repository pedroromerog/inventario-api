import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CategoriasService } from './categorias.service'
import { CreateCategoriaDto } from './dto/create-categoria.dto'
import { UpdateCategoriaDto } from './dto/update-categoria.dto'
import { TipoCategoria, EstadoCategoria } from './enums/categoria.enums'

@Controller('categorias')
@UseGuards(JwtAuthGuard)
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  async create(@Body() createCategoriaDto: CreateCategoriaDto) {
    return this.categoriasService.create(createCategoriaDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías activas' })
  async findAll() {
    return this.categoriasService.findAll()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener categorías por tipo' })
  async findByTipo(@Param('tipo') tipo: TipoCategoria) {
    return this.categoriasService.findByTipo(tipo)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener categorías por estado' })
  async findByEstado(@Param('estado') estado: EstadoCategoria) {
    return this.categoriasService.findByEstado(estado)
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar categorías por término' })
  async search(@Query('term') term: string) {
    return this.categoriasService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  async findOne(@Param('id') id: string) {
    return this.categoriasService.findOne(+id)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener una categoría por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.categoriasService.findByCodigo(codigo)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una categoría' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoriaDto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.update(+id, updateCategoriaDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.categoriasService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar una categoría eliminada' })
  async restore(@Param('id') id: string) {
    return this.categoriasService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente una categoría' })
  async hardRemove(@Param('id') id: string) {
    return this.categoriasService.hardRemove(+id)
  }
}
