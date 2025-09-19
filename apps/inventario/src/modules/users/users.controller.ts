import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo registro de usuario' })
  async create(@Body() createStockDto: CreateUserDto) {
    return this.usersService.create(createStockDto)
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de usuarios activos' })
  async findAll() {
    return this.usersService.findAll()
  }

  @Get('estado/:estado')
  @ApiOperation({ summary: 'Obtener usuarios por estado' })
  async findByEstado(@Param('estado') estado: string) {
    return this.usersService.findByEstado(estado as any)
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar usuario por término' })
  async search(@Query('term') term: string) {
    return this.usersService.searchByTerm(term)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un registro de stock por ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un registro de usaurio' })
  async update(@Param('id') id: string, @Body() updateStockDto: UpdateUserDto) {
    return this.usersService.update(id, updateStockDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un registro de stock (soft delete)' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restaurar un registro de stock eliminado' })
  async restore(@Param('id') id: string) {
    return this.usersService.restore(id)
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar permanentemente un registro de stock' })
  async hardRemove(@Param('id') id: string) {
    return this.usersService.hardRemove(id)
  }
}
