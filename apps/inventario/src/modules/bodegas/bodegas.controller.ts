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
import { BodegasService } from './bodegas.service'
import { CreateBodegaDto } from './dto/create-bodega.dto'
import { UpdateBodegaDto } from './dto/update-bodega.dto'
import { TipoBodega, EstadoBodega } from './enums/bodega.enums'

@Controller('bodegas')
@UseGuards(JwtAuthGuard)
export class BodegasController {
  constructor(private readonly bodegasService: BodegasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva bodega' })
  async create(@Body() createBodegaDto: CreateBodegaDto) {
    return this.bodegasService.create(createBodegaDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las bodegas activas' })
  async findAll() {
    return this.bodegasService.findAll()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener bodegas por tipo' })
  async findByTipo(@Param('tipo') tipo: TipoBodega) {
    return this.bodegasService.findByTipo(tipo)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener bodegas por estado' })
  async findByEstado(@Param('estado') estado: EstadoBodega) {
    return this.bodegasService.findByEstado(estado)
  }

  @Get('ciudad/:ciudad')
  @ApiOperation({ summary: 'Obtener bodegas por ciudad' })
  async findByCiudad(@Param('ciudad') ciudad: string) {
    return this.bodegasService.findByCiudad(ciudad)
  }

  @Get('responsable/:responsableId')
  @ApiOperation({ summary: 'Obtener bodegas por responsable' })
  async findByResponsable(@Param('responsableId') responsableId: string) {
    return this.bodegasService.findByResponsable(responsableId)
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar bodegas por término' })
  async search(@Query('term') term: string) {
    return this.bodegasService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una bodega por ID' })
  async findOne(@Param('id') id: string) {
    return this.bodegasService.findOne(+id)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener una bodega por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.bodegasService.findByCodigo(codigo)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una bodega' })
  async update(
    @Param('id') id: string,
    @Body() updateBodegaDto: UpdateBodegaDto,
  ) {
    return this.bodegasService.update(+id, updateBodegaDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una bodega (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.bodegasService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar una bodega eliminada' })
  async restore(@Param('id') id: string) {
    return this.bodegasService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente una bodega' })
  async hardRemove(@Param('id') id: string) {
    return this.bodegasService.hardRemove(+id)
  }
}
