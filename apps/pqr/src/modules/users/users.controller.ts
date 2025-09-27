import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateCiudadanoDto } from './dto/create-ciudadano.dto'
import { UpdateCiudadanoDto } from './dto/update-ciudadano.dto'
import { CreateFuncionarioDto } from './dto/create-funcionario.dto'
import { UpdateFuncionarioDto } from './dto/update-funcionario.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from './entities/user.entity'

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRADOR)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto)
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers()
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id)
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id)
  }

  @Post('ciudadanos')
  createCiudadano(@Body() createCiudadanoDto: CreateCiudadanoDto) {
    return this.usersService.createCiudadano(createCiudadanoDto)
  }

  @Get('ciudadanos')
  findAllCiudadanos() {
    return this.usersService.findAllCiudadanos()
  }

  @Get('ciudadanos/:id')
  findCiudadanoById(@Param('id') id: string) {
    return this.usersService.findCiudadanoById(id)
  }

  @Patch('ciudadanos/:id')
  updateCiudadano(
    @Param('id') id: string,
    @Body() updateCiudadanoDto: UpdateCiudadanoDto,
  ) {
    return this.usersService.updateCiudadano(id, updateCiudadanoDto)
  }

  @Delete('ciudadanos/:id')
  removeCiudadano(@Param('id') id: string) {
    return this.usersService.removeCiudadano(id)
  }

  // Funcionarios
  @Post('funcionarios')
  createFuncionario(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.usersService.createFuncionario(createFuncionarioDto)
  }

  @Get('funcionarios')
  findAllFuncionarios() {
    return this.usersService.findAllFuncionarios()
  }

  @Get('funcionarios/:id')
  findFuncionarioById(@Param('id') id: string) {
    return this.usersService.findFuncionarioById(id)
  }

  @Patch('funcionarios/:id')
  updateFuncionario(
    @Param('id') id: string,
    @Body() updateFuncionarioDto: UpdateFuncionarioDto,
  ) {
    return this.usersService.updateFuncionario(id, updateFuncionarioDto)
  }

  @Delete('funcionarios/:id')
  removeFuncionario(@Param('id') id: string) {
    return this.usersService.removeFuncionario(id)
  }

  @Get('funcionarios/dependencia/:dependenciaId')
  findFuncionariosByDependencia(@Param('dependenciaId') dependenciaId: string) {
    return this.usersService.findFuncionariosByDependencia(+dependenciaId)
  }
}
