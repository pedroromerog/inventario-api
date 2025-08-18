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
import { EmpleadosService } from './empleados.service'
import { CreateEmpleadoDto } from './dto/create-empleado.dto'
import { UpdateEmpleadoDto } from './dto/update-empleado.dto'
import { TipoEmpleado, EstadoEmpleado } from './enums/empleado.enums'

@ApiTags('Empleados')
@Controller('empleados')
@UseGuards(JwtAuthGuard)
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo empleado' })
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los empleados activos' })
  async findAll() {
    return this.empleadosService.findAll()
  }

  @Get('tipo/:tipo')
  @ApiOperation({ summary: 'Obtener empleados por tipo' })
  async findByTipo(@Param('tipo') tipo: TipoEmpleado) {
    return this.empleadosService.findByTipo(tipo)
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener empleados por estado' })
  async findByEstado(@Param('estado') estado: EstadoEmpleado) {
    return this.empleadosService.findByEstado(estado)
  }

  @Get('cargo/:cargo')
  @ApiOperation({ summary: 'Obtener empleados por cargo' })
  async findByCargo(@Param('cargo') cargo: string) {
    return this.empleadosService.findByCargo(cargo)
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar empleados por término' })
  async search(@Query('term') term: string) {
    return this.empleadosService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un empleado por ID' })
  async findOne(@Param('id') id: string) {
    return this.empleadosService.findOne(+id)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un empleado por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.empleadosService.findByCodigo(codigo)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un empleado' })
  async update(
    @Param('id') id: string,
    @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ) {
    return this.empleadosService.update(+id, updateEmpleadoDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un empleado (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.empleadosService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un empleado eliminado' })
  async restore(@Param('id') id: string) {
    return this.empleadosService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un empleado' })
  async hardRemove(@Param('id') id: string) {
    return this.empleadosService.hardRemove(+id)
  }
}
