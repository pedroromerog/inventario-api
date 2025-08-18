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
import { StockService } from './stock.service'
import { CreateStockDto } from './dto/create-stock.dto'
import { UpdateStockDto } from './dto/update-stock.dto'

@Controller('stock')
@UseGuards(JwtAuthGuard)
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo registro de stock' })
  async create(@Body() createStockDto: CreateStockDto) {
    return this.stockService.create(createStockDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de stock activos' })
  async findAll() {
    return this.stockService.findAll()
  }

  @Get('producto/:productoId')
  @ApiOperation({ summary: 'Obtener stock por producto' })
  async findByProducto(@Param('productoId') productoId: string) {
    return this.stockService.findByProducto(+productoId)
  }

  @Get('bodega/:bodegaId')
  @ApiOperation({ summary: 'Obtener stock por bodega' })
  async findByBodega(@Param('bodegaId') bodegaId: string) {
    return this.stockService.findByBodega(+bodegaId)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener stock por estado' })
  async findByEstado(@Param('estado') estado: string) {
    return this.stockService.findByEstado(estado as any)
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  async findLowStock() {
    return this.stockService.findLowStock()
  }

  @Get('out-of-stock')
  @ApiOperation({ summary: 'Obtener productos sin stock' })
  async findOutOfStock() {
    return this.stockService.findOutOfStock()
  }

  @Get('over-stock')
  @ApiOperation({ summary: 'Obtener productos con stock excesivo' })
  async findOverStock() {
    return this.stockService.findOverStock()
  }

  @Get('summary')
  @ApiOperation({ summary: 'Obtener resumen de stock' })
  async findStockSummary() {
    return this.stockService.findStockSummary()
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar stock por término' })
  async search(@Query('term') term: string) {
    return this.stockService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de stock por ID' })
  async findOne(@Param('id') id: string) {
    return this.stockService.findOne(+id)
  }

  @Get('producto/:productoId/bodega/:bodegaId')
  @ApiOperation({ summary: 'Obtener stock por producto y bodega' })
  async findByProductoAndBodega(
    @Param('productoId') productoId: string,
    @Param('bodegaId') bodegaId: string,
  ) {
    return this.stockService.findByProductoAndBodega(+productoId, +bodegaId)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro de stock' })
  async update(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.stockService.update(+id, updateStockDto)
  }

  @Patch('producto/:productoId/bodega/:bodegaId/quantities')
  @ApiOperation({ summary: 'Actualizar cantidades de stock' })
  async updateStockQuantities(
    @Param('productoId') productoId: string,
    @Param('bodegaId') bodegaId: string,
    @Body() quantities: { stockActual: number; stockReservado: number },
  ) {
    return this.stockService.updateStockQuantities(
      +productoId,
      +bodegaId,
      quantities.stockActual,
      quantities.stockReservado,
    )
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un registro de stock (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.stockService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un registro de stock eliminado' })
  async restore(@Param('id') id: string) {
    return this.stockService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un registro de stock' })
  async hardRemove(@Param('id') id: string) {
    return this.stockService.hardRemove(+id)
  }
}
