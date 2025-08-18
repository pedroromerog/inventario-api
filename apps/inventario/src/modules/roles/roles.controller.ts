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
import { RolesService } from './roles.service'
import { CreateRoleDto } from './dto/create-role.dto'
import { UpdateRoleDto } from './dto/update-role.dto'

@Controller('roles')
//@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo rol' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los roles activos' })
  async findAll() {
    return this.rolesService.findAll()
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar roles por término' })
  async search(@Query('term') term: string) {
    return this.rolesService.searchByTerm(term)
  }

  @Get('codigo/:codigo')
  @ApiOperation({ summary: 'Obtener un rol por código' })
  async findByCodigo(@Param('codigo') codigo: string) {
    return this.rolesService.findByCodigo(codigo)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un rol por ID' })
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un rol' })
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un rol (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(+id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un rol eliminado' })
  async restore(@Param('id') id: string) {
    return this.rolesService.restore(+id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un rol' })
  async hardRemove(@Param('id') id: string) {
    return this.rolesService.hardRemove(+id)
  }
}
