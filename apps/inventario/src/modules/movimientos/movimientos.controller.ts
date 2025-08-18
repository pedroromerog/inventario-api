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
import { MovimientosService } from './movimientos.service'
import { CreateMovimientoDto } from './dto/create-movimiento.dto'
import { UpdateMovimientoDto } from './dto/update-movimiento.dto'

@Controller('movimientos')
@UseGuards(JwtAuthGuard)
export class MovimientosController {
  constructor(private readonly movimientosService: MovimientosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo movimiento' })
  async create(@Body() createMovimientoDto: CreateMovimientoDto) {
    return this.movimientosService.create(createMovimientoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los movimientos activos' })
  async findAll() {
    return this.movimientosService.findAll()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener movimientos por tipo' })
  async findByTipo(@Param('tipo') tipo: string) {
    return this.movimientosService.findByTipo(tipo as any)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener movimientos por estado' })
  async findByEstado(@Param('estado') estado: string) {
    return this.movimientosService.findByEstado(estado as any)
  }

  @Get('motivo/:motivo')
  @ApiOperation({ summary: 'Obtener movimientos por motivo' })
  async findByMotivo(@Param('motivo') motivo: string) {
    return this.movimientosService.findByMotivo(motivo as any)
  }

  @Get('producto/:productoId')
  @ApiOperation({ summary: 'Obtener movimientos por producto' })
  async findByProducto(@Param('productoId') productoId: string) {
    return this.movimientosService.findByProducto(+productoId)
  }

  @Get('bodega-origen/:bodegaOrigenId')
  @ApiOperation({ summary: 'Obtener movimientos por bodega origen' })
  async findByBodegaOrigen(@Param('bodegaOrigenId') bodegaOrigenId: string) {
    return this.movimientosService.findByBodegaOrigen(+bodegaOrigenId)
  }

  @Get('bodega-destino/:bodegaDestinoId')
  @ApiOperation({ summary: 'Obtener movimientos por bodega destino' })
  async findByBodegaDestino(@Param('bodegaDestinoId') bodegaDestinoId: string) {
    return this.movimientosService.findByBodegaDestino(+bodegaDestinoId)
  }

  @Get('autorizador/:autorizadorId')
  @ApiOperation({ summary: 'Obtener movimientos por autorizador' })
  async findByAutorizador(@Param('autorizadorId') autorizadorId: string) {
    return this.movimientosService.findByAutorizador(autorizadorId)
  }

  @Get('fecha-range')
  @ApiOperation({ summary: 'Obtener movimientos por rango de fechas' })
  async findByFechaRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    return this.movimientosService.findByFechaRange(
      new Date(fechaInicio),
      new Date(fechaFin),
    )
  }

  @Get('pendientes')
  @ApiOperation({ summary: 'Obtener movimientos pendientes' })
  async findPendientes() {
    return this.movimientosService.findPendientes()
  }

  @Get('completados')
  @ApiOperation({ summary: 'Obtener movimientos completados' })
  async findCompletados() {
    return this.movimientosService.findCompletados()
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar movimientos por término' })
  async search(@Query('term') term: string) {
    return this.movimientosService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un movimiento por ID' })
  async findOne(@Param('id') id: string) {
    return this.movimientosService.findOne(+id)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un movimiento por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.movimientosService.findByCodigo(codigo)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un movimiento' })
  async update(
    @Param('id') id: string,
    @Body() updateMovimientoDto: UpdateMovimientoDto,
  ) {
    return this.movimientosService.update(+id, updateMovimientoDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un movimiento (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.movimientosService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un movimiento eliminado' })
  async restore(@Param('id') id: string) {
    return this.movimientosService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un movimiento' })
  async hardRemove(@Param('id') id: string) {
    return this.movimientosService.hardRemove(+id)
  }
}
