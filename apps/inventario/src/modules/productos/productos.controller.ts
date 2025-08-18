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
import { ProductosService } from './productos.service'
import { CreateProductoDto } from './dto/create-producto.dto'
import { UpdateProductoDto } from './dto/update-producto.dto'

@Controller('productos')
@UseGuards(JwtAuthGuard)
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  async create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos activos' })
  async findAll() {
    return this.productosService.findAll()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener productos por tipo' })
  async findByTipo(@Param('tipo') tipo: string) {
    return this.productosService.findByTipo(tipo as any)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener productos por estado' })
  async findByEstado(@Param('estado') estado: string) {
    return this.productosService.findByEstado(estado as any)
  }

  @Get('categoria/:categoriaId')
  @ApiOperation({ summary: 'Obtener productos por categoría' })
  async findByCategoria(@Param('categoriaId') categoriaId: string) {
    return this.productosService.findByCategoria(+categoriaId)
  }

  @Get('proveedor/:proveedorId')
  @ApiOperation({ summary: 'Obtener productos por proveedor' })
  async findByProveedor(@Param('proveedorId') proveedorId: string) {
    return this.productosService.findByProveedor(+proveedorId)
  }

  @Get('marca/:marca')
  @ApiOperation({ summary: 'Obtener productos por marca' })
  async findByMarca(@Param('marca') marca: string) {
    return this.productosService.findByMarca(marca)
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  async findLowStock() {
    return this.productosService.findLowStock()
  }

  @Get('out-of-stock')
  @ApiOperation({ summary: 'Obtener productos sin stock' })
  async findOutOfStock() {
    return this.productosService.findOutOfStock()
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar productos por término' })
  async search(@Query('term') term: string) {
    return this.productosService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  async findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un producto por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.productosService.findByCodigo(codigo)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  async update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(+id, updateProductoDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.productosService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un producto eliminado' })
  async restore(@Param('id') id: string) {
    return this.productosService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un producto' })
  async hardRemove(@Param('id') id: string) {
    return this.productosService.hardRemove(+id)
  }
}
