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
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Public } from '../auth/decorators/public.decorator'
import { UserRole } from '../users/entities/user.entity'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { UserLogin } from '../../shared/interfaces/current-user.interface'

@Controller('pqr')
export class PqrController {
  constructor(private readonly pqrService: PqrService) {}

  @Public()
  @Post()
  createPqr(
    @Body() createPqrDto: CreatePqrDto,
    @CurrentUser() user: UserLogin,
  ) {
    return this.pqrService.createPqr(createPqrDto, user)
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
    UserRole.AUDITOR,
  )
  findAllPqrs() {
    return this.pqrService.findAllPqrs()
  }

  @Get('mine')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CIUDADANO)
  findAllPqrsMine(@CurrentUser() user: any) {
    return this.pqrService.findAllPqrsMine(user.id)
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
    UserRole.AUDITOR,
    UserRole.CIUDADANO,
  )
  findPqrById(@Param('id') id: string) {
    return this.pqrService.findPqrById(id)
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
  )
  updatePqr(@Param('id') id: string, @Body() updatePqrDto: UpdatePqrDto) {
    return this.pqrService.updatePqr(id, updatePqrDto)
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  removePqr(@Param('id') id: string) {
    return this.pqrService.removePqr(id)
  }

  @Post('trazabilidad')
  @UseGuards(RolesGuard)
  @Roles(
    UserRole.FUNCIONARIO,
    UserRole.LIDER_DEPENDENCIA,
    UserRole.ADMINISTRADOR,
  )
  createTrazabilidad(@Body() createTrazabilidadDto: CreateTrazabilidadDto) {
    return this.pqrService.createTrazabilidad(createTrazabilidadDto)
  }
}
