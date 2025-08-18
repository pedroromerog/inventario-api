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
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ProveedoresService } from './proveedores.service'
import { CreateProveedorDto } from './dto/create-proveedor.dto'
import { UpdateProveedorDto } from './dto/update-proveedor.dto'
import { TipoProveedor, EstadoProveedor } from './enums/proveedor.enums'

@ApiTags('Proveedores')
@Controller('proveedores')
@UseGuards(JwtAuthGuard)
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  async create(@Body() createProveedorDto: CreateProveedorDto) {
    return this.proveedoresService.create(createProveedorDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores activos' })
  async findAll() {
    return this.proveedoresService.findAll()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener proveedores por tipo' })
  async findByTipo(@Param('tipo') tipo: TipoProveedor) {
    return this.proveedoresService.findByTipo(tipo)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener proveedores por estado' })
  async findByEstado(@Param('estado') estado: EstadoProveedor) {
    return this.proveedoresService.findByEstado(estado)
  }

  @Get('ciudad/:ciudad')
  @ApiOperation({ summary: 'Obtener proveedores por ciudad' })
  async findByCiudad(@Param('ciudad') ciudad: string) {
    return this.proveedoresService.findByCiudad(ciudad)
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar proveedores por término' })
  async search(@Query('term') term: string) {
    return this.proveedoresService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por ID' })
  async findOne(@Param('id') id: string) {
    return this.proveedoresService.findOne(+id)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un proveedor por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.proveedoresService.findByCodigo(codigo)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un proveedor' })
  async update(
    @Param('id') id: string,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return this.proveedoresService.update(+id, updateProveedorDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un proveedor (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.proveedoresService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un proveedor eliminado' })
  async restore(@Param('id') id: string) {
    return this.proveedoresService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un proveedor' })
  async hardRemove(@Param('id') id: string) {
    return this.proveedoresService.hardRemove(+id)
  }
}
