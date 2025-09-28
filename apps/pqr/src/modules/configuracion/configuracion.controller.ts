import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common'
import { ConfiguracionService } from './configuracion.service'
import { UpdateConfiguracionDto } from './dto/update-configuracion.dto'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { Public } from '../auth/decorators/public.decorator'
import { UserRole } from '../users/entities/user.entity'

@Controller('configuracion')
export class ConfiguracionController {
  constructor(private readonly configuracionService: ConfiguracionService) {}

  @Public()
  @Get()
  getConfiguracion() {
    return this.configuracionService.getConfiguracion()
  }

  @Put()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR)
  updateConfiguracion(@Body() updateConfiguracionDto: UpdateConfiguracionDto) {
    return this.configuracionService.updateConfiguracion(updateConfiguracionDto)
  }
}
