import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { UserRole } from '../users/entities/user.entity'
import { CreateDependenciaDto } from './dto/create-dependencia.dto'
import { CreateSecretariaDto } from './dto/create-secretaria.dto'
import { UpdateDependenciaDto } from './dto/update-dependencia.dto'
import { UpdateSecretariaDto } from './dto/update-secretaria.dto'
import { OrganigramaService } from './organigrama.service'

@Controller('organigrama')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMINISTRADOR)
export class OrganigramaController {
  constructor(private readonly organigramaService: OrganigramaService) {}

  // Secretarias
  @Post('secretarias')
  createSecretaria(@Body() createSecretariaDto: CreateSecretariaDto) {
    return this.organigramaService.createSecretaria(createSecretariaDto)
  }

  @Get('secretarias')
  findAllSecretarias() {
    return this.organigramaService.findAllSecretarias()
  }

  @Get('secretarias/:id')
  findSecretariaById(@Param('id') id: string) {
    return this.organigramaService.findSecretariaById(+id)
  }

  @Patch('secretarias/:id')
  updateSecretaria(
    @Param('id') id: string,
    @Body() updateSecretariaDto: UpdateSecretariaDto,
  ) {
    return this.organigramaService.updateSecretaria(+id, updateSecretariaDto)
  }

  @Delete('secretarias/:id')
  removeSecretaria(@Param('id') id: string) {
    return this.organigramaService.removeSecretaria(+id)
  }

  // Dependencias
  @Post('dependencias')
  createDependencia(@Body() createDependenciaDto: CreateDependenciaDto) {
    return this.organigramaService.createDependencia(createDependenciaDto)
  }

  @Get('dependencias')
  findAllDependencias() {
    return this.organigramaService.findAllDependencias()
  }

  @Get('dependencias/:id')
  findDependenciaById(@Param('id') id: string) {
    return this.organigramaService.findDependenciaById(+id)
  }

  @Patch('dependencias/:id')
  updateDependencia(
    @Param('id') id: string,
    @Body() updateDependenciaDto: UpdateDependenciaDto,
  ) {
    return this.organigramaService.updateDependencia(+id, updateDependenciaDto)
  }

  @Delete('dependencias/:id')
  removeDependencia(@Param('id') id: string) {
    return this.organigramaService.removeDependencia(+id)
  }
}
