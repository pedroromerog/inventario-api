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
import { PqrService } from './pqr.service'
import { CreatePqrDto } from './dto/create-pqr.dto'
import { UpdatePqrDto } from './dto/update-pqr.dto'
import { CreateTrazabilidadDto } from './dto/create-trazabilidad.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserRole } from '../users/entities/user.entity'

@Controller('pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Post()
  createPqr(@Body() createPqrDto: CreatePqrDto) {
    return this.pqrService.createPqr(createPqrDto)
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
    UserRole.AUDITOR,
  )
  findAllPqrs() {
    return this.pqrService.findAllPqrs()
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
    UserRole.AUDITOR,
  )
  findPqrById(@Param('id') id: string) {
    return this.pqrService.findPqrById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
  )
  updatePqr(@Param('id') id: string, @Body() updatePqrDto: UpdatePqrDto) {
    return this.pqrService.updatePqr(id, updatePqrDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  removePqr(@Param('id') id: string) {
    return this.pqrService.removePqr(id)
  }

  @Post('trazabilidad')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
  )
  createTrazabilidad(@Body() createTrazabilidadDto: CreateTrazabilidadDto) {
    return this.pqrService.createTrazabilidad(createTrazabilidadDto)
  }
}
